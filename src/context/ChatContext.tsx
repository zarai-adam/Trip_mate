import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    avatarUrl: string;
  };
  readBy: { id: string }[];
}

interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP";
  tripId?: string;
  trip?: {
    id: string;
    title: string;
    coverImageUrl: string;
  };
  participants: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    role: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  lastMessageAt: string;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  totalUnreadCount: number;
  onlineUsers: string[];
  error: string | null;
  setError: (error: string | null) => void;
  setActiveConversation: (conv: Conversation | null) => void;
  sendMessage: (conversationId: string, body: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string, before?: string) => Promise<void>;
  startDirectMessage: (otherUserId: string, tripId?: string) => Promise<string>;
  startConversationByUsername: (username: string) => Promise<any>;
  startTripGroupChat: (tripId: string) => Promise<string>;
  typingUsers: Record<string, { userId: string; userName: string }[]>;
  setTyping: (conversationId: string, isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, { userId: string; userName: string }[]>>({});
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const activeConversationRef = useRef<Conversation | null>(null);

  const getCleanToken = useCallback(() => {
    const token = localStorage.getItem("token") || document.cookie.split("token=")[1]?.split(";")[0];
    if (!token || token === "undefined" || token === "null" || token.trim() === "") {
      return null;
    }
    return token;
  }, []);

  const fetchConversations = useCallback(async () => {
    const token = getCleanToken();
    if (!token) return;

    try {
      const res = await axios.get("/api/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
      const total = res.data.reduce((acc: number, curr: any) => acc + curr.unreadCount, 0);
      setTotalUnreadCount(total);
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Silently fail or handled by global auth check
        return;
      }
      console.error("Failed to fetch conversations", err);
    }
  }, [getCleanToken]);

  const fetchMessages = useCallback(async (conversationId: string, before?: string) => {
    const token = getCleanToken();
    try {
      const res = await axios.get(`/api/messages/${conversationId}/messages`, {
        params: { before, limit: 50 },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (before) {
        setMessages(prev => [...res.data, ...prev]);
      } else {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  }, [getCleanToken]);

  const setActiveConversation = useCallback((conv: Conversation | null) => {
    setActiveConversationState(conv);
    activeConversationRef.current = conv;
    if (conv) {
      setMessages([]);
      fetchMessages(conv.id);
      markAsRead(conv.id);
      
      // Join conversation room
      if (socketRef.current) {
        socketRef.current.emit("join-conversation", conv.id);
      }
    }
  }, [fetchMessages]);

  const sendMessage = async (conversationId: string, body: string) => {
    const token = getCleanToken();
    setError(null);
    try {
      await axios.post(`/api/messages/${conversationId}/messages`, { body }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError("Whoa there! You're sending messages too fast. Please wait a moment.");
      } else {
        console.error("Failed to send message", err);
      }
      throw err;
    }
  };

  const markAsRead = async (conversationId: string) => {
    const token = getCleanToken();
    try {
      await axios.post(`/api/messages/${conversationId}/read`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ));
      // Recalculate total
      setTimeout(() => {
        const total = conversations.reduce((acc, curr) => 
          curr.id === conversationId ? acc : acc + curr.unreadCount, 0
        );
        setTotalUnreadCount(total);
      }, 100);
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const startDirectMessage = async (otherUserId: string, tripId?: string) => {
    const token = getCleanToken();
    try {
      const res = await axios.post("/api/messages/direct", { otherUserId, tripId }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchConversations();
      return res.data.id;
    } catch (err) {
      console.error("Failed to start DM", err);
      throw err;
    }
  };

  const startConversationByUsername = async (username: string) => {
    const token = getCleanToken();
    try {
      const res = await axios.post("/api/messages/by-username", { username }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      await fetchConversations();
      return res.data;
    } catch (err: any) {
      console.error("Failed to start conversation by username", err);
      if (err.response?.data?.error) {
        throw new Error(err.response.data.error);
      }
      throw err;
    }
  };

  const startTripGroupChat = async (tripId: string) => {
    const token = getCleanToken();
    try {
      const res = await axios.get(`/api/messages/trip/${tripId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchConversations();
      return res.data.id;
    } catch (err) {
      console.error("Failed to start group chat", err);
      throw err;
    }
  };

  const setTyping = (conversationId: string, isTyping: boolean) => {
    if (!socketRef.current) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (isTyping) {
      socketRef.current.emit("typing:start", { 
        conversationId, 
        userId: user.id, 
        userName: user.firstName 
      });
    } else {
      socketRef.current.emit("typing:stop", { conversationId, userId: user.id });
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const token = getCleanToken();

    if (userStr && token) {
      fetchConversations();

      if (!socketRef.current) {
        socketRef.current = io({ auth: { token } });

        socketRef.current.on("connect", () => console.log("Connected to chat socket"));

        socketRef.current.on("online-users", (users: string[]) => {
          setOnlineUsers(users);
        });

        socketRef.current.on("message:new", (message: Message) => {
          // Update the conversations list with the new message and re-sort
          setConversations(prev => {
            const exists = prev.some(c => c.id === message.conversationId);
            if (!exists) {
              // If the conversation was not in the sidebar, fetch them to refresh
              fetchConversations();
              return prev;
            }

            const updated = prev.map(c => {
              if (c.id === message.conversationId) {
                const isCurrentActive = activeConversationRef.current?.id === message.conversationId;
                const newUnreadCount = isCurrentActive ? 0 : (c.unreadCount + 1);
                return {
                  ...c,
                  lastMessage: message,
                  lastMessageAt: message.createdAt,
                  unreadCount: newUnreadCount
                };
              }
              return c;
            });
            // Re-sort list so the active/recent conversation is on top
            return [...updated].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
          });

          // If message is for active conversation, add to live messages list
          if (activeConversationRef.current?.id === message.conversationId) {
            setMessages(prev => {
               if (prev.some(m => m.id === message.id)) return prev;
               return [...prev, message];
            });
            markAsRead(message.conversationId);
          } else {
            setTotalUnreadCount(prev => prev + 1);
            
            // New message notification
            const activeUser = JSON.parse(localStorage.getItem("user") || "{}");
            if (message.senderId !== activeUser.id) {
               window.dispatchEvent(new CustomEvent("new-chat-message", { detail: message }));
            }
          }
        });

        socketRef.current.on("notification:message", (data: { conversationId: string; message: Message }) => {
          const { conversationId, message } = data;
          
          setConversations(prev => {
            const exists = prev.some(c => c.id === conversationId);
            if (!exists) {
              fetchConversations();
              return prev;
            }

            const updated = prev.map(c => {
              if (c.id === conversationId) {
                const isCurrentActive = activeConversationRef.current?.id === conversationId;
                const newUnreadCount = isCurrentActive ? 0 : (c.unreadCount + 1);
                return {
                  ...c,
                  lastMessage: message,
                  lastMessageAt: message.createdAt,
                  unreadCount: newUnreadCount
                };
              }
              return c;
            });
            return [...updated].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
          });

          const activeUser = JSON.parse(localStorage.getItem("user") || "{}");
          if (message.senderId !== activeUser.id) {
            setTotalUnreadCount(prev => prev + 1);
            window.dispatchEvent(new CustomEvent("new-chat-message", { detail: message }));
          }
        });

        socketRef.current.on("typing:start", (data: { conversationId: string; userId: string; userName: string }) => {
          setTypingUsers(prev => {
            const current = prev[data.conversationId] || [];
            if (current.some(u => u.userId === data.userId)) return prev;
            return { ...prev, [data.conversationId]: [...current, data] };
          });
        });

        socketRef.current.on("typing:stop", (data: { conversationId: string; userId: string }) => {
          setTypingUsers(prev => {
            const current = prev[data.conversationId] || [];
            return { ...prev, [data.conversationId]: current.filter(u => u.userId !== data.userId) };
          });
        });
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchConversations]);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      loading,
      totalUnreadCount,
      onlineUsers,
      error,
      setError,
      setActiveConversation,
      sendMessage,
      markAsRead,
      fetchConversations,
      fetchMessages,
      startDirectMessage,
      startConversationByUsername,
      startTripGroupChat,
      typingUsers,
      setTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
