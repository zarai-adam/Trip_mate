import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { apiFetch } from "@/lib/api";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await apiFetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const userStr = localStorage.getItem("user");
      let token = localStorage.getItem("token") || document.cookie.split("token=")[1]?.split(";")[0];
      if (token === "undefined" || token === "null" || token?.trim() === "") {
        token = undefined as any;
      }

      if (userStr && token) {
        fetchNotifications();

        if (!socketRef.current) {
          const newSocket = io({
            auth: { token }
          });

          newSocket.on("connect", () => {
            console.log("Connected to notification socket");
          });

          newSocket.on("notification:new", (notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            window.dispatchEvent(new CustomEvent("new-notification", { detail: notification }));
          });

          socketRef.current = newSocket;
        }
      } else {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      }
    };

    handleAuthChange();

    // Listen for custom login/logout events if they exist, or just check storage
    window.addEventListener("storage", handleAuthChange);
    // Custom events for better reliability within same tab
    window.addEventListener("auth-state-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-state-change", handleAuthChange);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      const res = await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      if (!res.ok) {
        // Revert if failed
        fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    const previousNotifications = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      const res = await apiFetch("/api/notifications/read-all", { method: "PATCH" });
      if (!res.ok) {
        setNotifications(previousNotifications);
        setUnreadCount(previousNotifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setNotifications(previousNotifications);
    }
  };

  const deleteNotification = async (id: string) => {
    const previousNotifications = [...notifications];
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => {
      const wasUnread = previousNotifications.find(n => n.id === id)?.read === false;
      return wasUnread ? Math.max(0, prev - 1) : prev;
    });

    try {
      const res = await apiFetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setNotifications(previousNotifications);
        setUnreadCount(previousNotifications.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
      setNotifications(previousNotifications);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
