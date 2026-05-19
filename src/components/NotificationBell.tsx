import React, { useState, useEffect } from "react";
import { Bell, X, Check, ExternalLink, Calendar, Star, Info, AlertTriangle, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

const getIcon = (type: string) => {
  switch (type) {
    case "BOOKING_REQUEST":
    case "BOOKING_APPROVED":
    case "BOOKING_REJECTED":
      return <Calendar className="w-4 h-4 text-forest" />;
    case "REVIEW_RECEIVED":
      return <Star className="w-4 h-4 text-amber-500" />;
    case "QA_QUESTION":
      return <MessageSquare className="w-4 h-4 text-forest" />;
    case "APPLICATION_APPROVED":
    case "APPLICATION_REJECTED":
      return <Check className="w-4 h-4 text-sage" />;
    case "TRIP_CANCELLED":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return <Info className="w-4 h-4 text-forest" />;
  }
};

const getTargetLink = (notification: any) => {
  const { type, data } = notification;
  switch (type) {
    case "BOOKING_REQUEST":
      return "/guide/dashboard/requests";
    case "BOOKING_APPROVED":
    case "BOOKING_REJECTED":
      return "/dashboard/bookings";
    case "REVIEW_RECEIVED":
      return "/dashboard/reviews";
    case "QA_QUESTION":
      return `/trip/${data?.tripId}`;
    case "APPLICATION_APPROVED":
    case "APPLICATION_REJECTED":
      return "/guide/dashboard";
    case "TRIP_CANCELLED":
      return `/trip/${data?.tripId}`;
    default:
      return "/notifications";
  }
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const handleNewNotification = () => {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 2000);
    };

    window.addEventListener("new-notification", handleNewNotification);
    return () => window.removeEventListener("new-notification", handleNewNotification);
  }, []);

  const handleClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    navigate(getTargetLink(notification));
  };

  return (
    <div className="relative">
      <button 
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-300 ${isOpen ? "bg-forest/10 text-forest" : "text-gray-500 hover:bg-forest/5 hover:text-forest"}`}
      >
        <motion.div
          animate={isBouncing ? {
            y: [0, -4, 0, -2, 0],
            rotate: [0, -10, 10, -5, 5, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: isBouncing ? 3 : 0 }}
        >
          <Bell size={22} className={unreadCount > 0 ? "fill-current" : ""} />
        </motion.div>
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 lg:hidden" 
              onClick={() => setIsOpen(false)} 
            />
            {/* Desktop Backdrop */}
            <div 
              className="hidden lg:block fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95, x: "var(--x, 0)" }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{ "--x": "0px" } as any}
              className="fixed inset-x-4 top-20 lg:absolute lg:inset-auto lg:right-0 lg:mt-4 w-auto lg:w-[400px] bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-sage/10 dark:border-gray-800 z-[60] overflow-hidden"
            >
              <div className="p-6 border-b border-sage/5 dark:border-gray-800 flex items-center justify-between bg-offwhite/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-forest dark:text-sage uppercase tracking-tight">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-forest text-white text-[9px] font-black rounded-full uppercase">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-black text-sage hover:text-forest transition-colors uppercase tracking-widest"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[min(450px,60vh)] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-sage/5 dark:divide-gray-800">
                    {notifications.slice(0, 8).map((notification) => (
                      <div 
                        key={notification.id}
                        className={`group relative p-6 flex gap-4 hover:bg-offwhite dark:hover:bg-gray-800 transition-colors cursor-pointer ${!notification.read ? "bg-forest/[0.03] dark:bg-forest/[0.05]" : ""}`}
                        onClick={() => handleClick(notification)}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${!notification.read ? "bg-white dark:bg-gray-800 shadow-md scale-105" : "bg-gray-50 dark:bg-gray-900 opacity-60"}`}>
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm font-black truncate ${!notification.read ? "text-forest dark:text-sage" : "text-gray-500 dark:text-gray-400"}`}>
                              {notification.title}
                            </p>
                          </div>
                          <p className={`text-xs font-medium line-clamp-2 leading-relaxed ${!notification.read ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}>
                            {notification.body}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                            <span className={`w-1 h-1 rounded-full ${!notification.read ? "bg-forest" : "bg-gray-300"}`} />
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 px-12 text-center">
                    <div className="w-20 h-20 bg-offwhite dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200 dark:text-gray-700">
                      <Bell size={40} />
                    </div>
                    <h4 className="font-black text-forest dark:text-sage mb-1 uppercase tracking-tight">All caught up!</h4>
                    <p className="text-gray-400 dark:text-gray-500 text-xs font-medium max-w-[200px] mx-auto">
                      Your notification history is empty. We&apos;ll notify you when adventure calls.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-offwhite/30 dark:bg-gray-800/30 border-t border-sage/5 dark:border-gray-800">
                <Link 
                  to="/notifications" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3.5 w-full bg-white dark:bg-gray-800 border border-sage/10 dark:border-gray-700 rounded-2xl text-[10px] font-black text-forest dark:text-sage uppercase tracking-widest hover:border-forest dark:hover:border-sage transition-all shadow-sm"
                >
                  View All Activity
                  <ExternalLink size={12} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
