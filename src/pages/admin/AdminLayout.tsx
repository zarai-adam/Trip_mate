import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  Users, 
  Map, 
  Calendar, 
  Star, 
  AlertCircle, 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  History,
  ShieldCheck,
  Globe,
  MoreVertical,
  Search,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "motion/react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Guide Apps", path: "/admin/guide-applications", icon: FileText, badge: 3 },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Trips", path: "/admin/trips", icon: Map },
    { label: "Bookings", path: "/admin/bookings", icon: Calendar },
    { label: "Reviews", path: "/admin/reviews", icon: Star },
    { label: "Suspended", path: "/admin/suspended", icon: AlertCircle },
    { label: "Activity", path: "/admin/activity-log", icon: History },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col bg-[#1a1a2e] dark:bg-gray-950 text-white overflow-hidden shrink-0 border-r border-white/5 dark:border-gray-800 transition-colors">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sage rounded-xl flex items-center justify-center shadow-lg shadow-sage/20">
              <ShieldCheck className="text-forest" size={24} />
            </div>
            <div>
              <span className="text-xl font-heading font-black tracking-tight block leading-none">TRIP MATE</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sage-dark">Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all group relative
                  ${active 
                    ? "bg-sage text-forest shadow-xl shadow-sage/10 translate-x-2" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"}
                `}
              >
                {active && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-forest rounded-full -ml-4"
                  />
                )}
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={active ? "text-forest" : "group-hover:text-sage transition-colors"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active ? "bg-forest text-white" : "bg-red-500 text-white"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[1.25rem] overflow-hidden bg-gray-700 border-2 border-sage/30">
              <img src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name || "Admin User"}</p>
              <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-gray-400 text-xs font-bold transition-all transition-transform active:scale-95"
          >
            <LogOut size={16} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-20 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-4 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={18} />
              </div>
              <span className="text-sm font-black tracking-tight">ADMIN</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-[var(--color-bg-secondary)] px-4 py-2.5 rounded-2xl w-full max-w-sm border border-[var(--color-border)]">
            <Search size={18} className="text-[var(--color-text-muted)]" />
            <input 
              type="text" 
              placeholder="Quick search..."
              className="bg-transparent border-none focus:ring-0 w-full text-sm font-medium text-[var(--color-text-primary)]"
            />
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="relative">
              <button 
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                className="w-10 h-10 rounded-xl bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-forest/10 hover:text-forest transition-all border border-[var(--color-border)]"
              >
                <div className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-[var(--color-bg-primary)] rounded-full animate-shake"></span>
                </div>
              </button>
            </div>

            <Link 
              to="/" 
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-all"
            >
              <Globe size={14} />
              <span>Preview Live</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-12 pb-32 md:pb-12">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 h-18 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl px-6 flex items-center justify-around z-50 shadow-2xl transition-all">
          {menuItems.slice(0, 5).map((item) => {
            const active = isActive(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-all ${active ? "text-forest dark:text-sage" : "text-gray-400"}`}
              >
                <item.icon size={20} className={active ? "scale-110" : ""} />
                <span className="text-[9px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <MoreVertical size={20} />
            <span className="text-[9px] font-black uppercase tracking-tighter">More</span>
          </button>
        </nav>
      </div>

      {/* Mobile More Sheet */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 bg-[var(--color-bg-primary)] shadow-2xl z-[70] md:hidden flex flex-col p-8"
            >
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-black uppercase tracking-tighter">Administration</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${active ? "bg-forest text-white" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto pt-8 border-t border-[var(--color-border)]">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-50 text-red-500 font-bold"
                >
                  <LogOut size={20} />
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
