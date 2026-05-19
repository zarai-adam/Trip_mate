import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  Star, 
  MessageSquare, 
  Info, 
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "all", label: "All", icon: <Bell size={14} /> },
  { id: "unread", label: "Unread", icon: <Circle size={14} /> },
  { id: "bookings", label: "Bookings", icon: <Calendar size={14} /> },
  { id: "reviews", label: "Reviews", icon: <Star size={14} /> },
  { id: "system", label: "System", icon: <Info size={14} /> },
];

function Circle({ size }: { size: number }) {
  return <div className={`border-2 border-current rounded-full`} style={{ width: size, height: size }} />;
}

const getIcon = (type: string) => {
    switch (type) {
      case "BOOKING_REQUEST":
      case "BOOKING_APPROVED":
      case "BOOKING_REJECTED":
        return <Calendar className="w-5 h-5 text-forest" />;
      case "REVIEW_RECEIVED":
        return <Star className="w-5 h-5 text-amber-500" />;
      case "QA_QUESTION":
        return <MessageSquare className="w-5 h-5 text-forest" />;
      case "APPLICATION_APPROVED":
      case "APPLICATION_REJECTED":
        return <CheckCircle className="w-5 h-5 text-sage" />;
      case "TRIP_CANCELLED":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-forest" />;
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

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { notifications, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (activeTab) {
      case "unread": return !n.read;
      case "bookings": return n.type.includes("BOOKING");
      case "reviews": return n.type.includes("REVIEW");
      case "system": return ["SYSTEM_ALERT", "APPLICATION_APPROVED", "APPLICATION_REJECTED", "TRIP_CANCELLED"].includes(n.type);
      default: return true;
    }
  });

  const handleAction = (notification: any) => {
    if (!notification.read) markAsRead(notification.id);
    navigate(getTargetLink(notification));
  };

  return (
    <div className="bg-offwhite min-h-screen">
      <div className="max-w-6xl mx-auto py-12 md:py-20 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage/20 rounded-full">
              <Bell size={12} className="text-forest" />
              <span className="text-[10px] font-black uppercase tracking-widest text-forest">Real-time Activity</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-forest tracking-tighter italic uppercase">Notifications</h1>
            <p className="text-gray-500 font-medium max-w-lg">
              Manage your travel alerts, booking updates, and community interactions in one place.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={loading || notifications.filter(n => !n.read).length === 0}
              className="h-12 border-forest/10 bg-white rounded-2xl font-black uppercase tracking-widest text-[10px] px-8 hover:bg-forest hover:text-white transition-all shadow-sm"
            >
              Mark all read
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Filters */}
          <div className="lg:col-span-3 space-y-10">
            <div className="bg-white p-4 rounded-[2rem] border border-forest/5 shadow-sleek">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 mb-4">Filters</h3>
              <div className="flex flex-col gap-1">
                {tabs.map((tab) => {
                  const count = tab.id === "unread" 
                    ? notifications.filter(n => !n.read).length 
                    : tab.id === "all" 
                      ? notifications.length 
                      : notifications.filter(n => {
                          if (tab.id === "bookings") return n.type.includes("BOOKING");
                          if (tab.id === "reviews") return n.type.includes("REVIEW");
                          if (tab.id === "system") return ["SYSTEM_ALERT", "APPLICATION_APPROVED", "APPLICATION_REJECTED", "TRIP_CANCELLED"].includes(n.type);
                          return false;
                        }).length;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl font-black transition-all text-xs uppercase tracking-tight ${
                        activeTab === tab.id 
                        ? "bg-forest text-white shadow-lg" 
                        : "text-gray-400 hover:bg-forest/5 hover:text-forest"
                      }`}
                    >
                      <span className={activeTab === tab.id ? "text-white" : "text-sage"}>
                        {tab.id === "unread" ? <div className="p-1 rounded-full border border-current"><div className="w-1 h-1 bg-current rounded-full" /></div> : tab.icon}
                      </span>
                      {tab.label}
                      {count > 0 && (
                        <span className={`ml-auto px-2 py-0.5 rounded-lg text-[9px] ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-forest/5 text-forest"}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-sand/30 p-8 rounded-[2.5rem] border border-forest/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Info size={80} />
              </div>
              <h4 className="font-black text-forest mb-3 relative z-10">Mobile Ready</h4>
              <p className="text-xs text-forest/70 font-medium leading-relaxed relative z-10">
                You can access all your notifications on the go. Adventure doesn&apos;t wait for a desktop!
              </p>
            </div>
          </div>

          {/* Main List */}
          <div className="lg:col-span-9 space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-forest transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 pl-16 pr-8 bg-white rounded-2xl border border-forest/5 shadow-sleek focus:ring-4 focus:ring-forest/5 focus:outline-none transition-all font-bold text-forest placeholder:text-gray-300"
              />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-forest/5 shadow-sleek overflow-hidden">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div className="divide-y divide-gray-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-8 flex gap-6 animate-pulse">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                          <div className="h-3 bg-gray-50 rounded-full w-2/3" />
                          <div className="h-2 bg-gray-50 rounded-full w-1/4 pt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {filteredNotifications.map((n, idx) => (
                      <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        className={`group relative p-8 md:p-10 flex gap-6 hover:bg-forest/[0.01] transition-all cursor-pointer ${!n.read ? "bg-forest/[0.03]" : ""}`}
                        onClick={() => handleAction(n)}
                      >
                        <div className={`w-14 md:w-16 h-14 md:h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-500 ${!n.read ? "bg-white shadow-xl ring-1 ring-forest/5" : "bg-gray-50 opacity-60"}`}>
                          {getIcon(n.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-12">
                          <div className="flex items-center flex-wrap gap-3 mb-2">
                            <h4 className={`text-lg md:text-xl font-black tracking-tight ${!n.read ? "text-forest" : "text-gray-400"}`}>
                              {n.title}
                            </h4>
                            {!n.read && (
                               <span className="bg-forest text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">Unread</span>
                            )}
                          </div>
                          <p className={`text-sm md:text-base font-medium leading-relaxed mb-4 ${!n.read ? "text-gray-600" : "text-gray-400"}`}>
                            {n.body}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${!n.read ? "bg-forest" : "bg-gray-200"}`} />
                              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </span>
                            <div className="h-1 w-1 bg-gray-100 rounded-full" />
                            <span className="text-[10px] font-black text-sage uppercase tracking-widest">
                              {n.type.replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>

                        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n.id);
                            }}
                            className="p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            title="Remove"
                          >
                            <Trash2 size={20} />
                          </button>
                          <div className="w-10 h-10 flex items-center justify-center text-forest/20 group-hover:text-forest transition-colors">
                            <ChevronRight size={24} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-32 text-center">
                    <div className="w-32 h-32 bg-offwhite rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-200 rotate-12 group hover:rotate-0 transition-transform duration-500">
                      <Bell size={64} className="group-hover:text-forest transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-forest mb-3">Quiet and peaceful</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                      {searchQuery ? `We couldn't find any results for "${searchQuery}". Maybe try something else?` : "You've addressed all your alerts. Time to plan your next journey!"}
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                        className="mt-6 text-forest font-black uppercase tracking-widest text-[10px]"
                      >
                        Reset Search
                      </Button>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
