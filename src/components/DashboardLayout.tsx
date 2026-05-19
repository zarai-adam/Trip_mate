import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageCircle, 
  Heart, 
  Star, 
  Settings, 
  LogOut,
  ChevronRight,
  Briefcase,
  PlusCircle,
  FileText,
  Users,
  Wallet,
  TrendingUp,
  ShieldAlert,
  Bell,
  User,
  Compass
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import NotificationBell from "./NotificationBell";
import Logo from "./Logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "Traveler", role: "EXPLORER" };

  const isGuide = user.role === "GUIDE";

  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const explorerLinks = [
    { name: "My Bookings", icon: <Compass size={20} />, href: "/dashboard" },
    { name: "Notifications", icon: <Bell size={20} />, href: "/notifications", badge: unreadCount },
    { name: "Messages", icon: <MessageCircle size={20} />, href: "/dashboard/messages" },
    { name: "Wishlist", icon: <Heart size={20} />, href: "/dashboard/wishlist" },
    { name: "My Reviews", icon: <Star size={20} />, href: "/dashboard/reviews" },
    { name: "Custom Requests", icon: <FileText size={20} />, href: "/dashboard/requests" },
  ];

  const guideLinks = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/guide/dashboard" },
    { name: "Notifications", icon: <Bell size={20} />, href: "/notifications", badge: unreadCount },
    { name: "My Trips", icon: <Briefcase size={20} />, href: "/guide/dashboard/trips" },
    { name: "Booking Requests", icon: <Users size={20} />, href: "/guide/dashboard/requests" },
    { name: "Earnings", icon: <Wallet size={20} />, href: "/guide/dashboard/earnings" },
    { name: "Messages", icon: <MessageCircle size={20} />, href: "/dashboard/messages" },
    { name: "Analytics", icon: <TrendingUp size={20} />, href: "/guide/dashboard/analytics" },
  ];

  const menuLinks = isGuide ? guideLinks : explorerLinks;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-mesh selection:bg-forest selection:text-white">
      {/* Sidebar */}
      <aside className="w-80 bg-background/40 backdrop-blur-md border-r border-border-dim p-8 hidden lg:flex flex-col">
        <div className="mb-12">
          <Logo />
        </div>

        <nav className="flex-1 space-y-2">
          <div className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mb-4 ml-4">Main Menu</div>
          {menuLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                location.pathname === link.href 
                ? "bg-gradient-signature text-white shadow-lg shadow-forest/20" 
                : "text-gray-500 hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <span className={location.pathname === link.href ? "text-white" : "text-sage"}>
                {link.icon}
              </span>
              {link.name}
              {link.badge !== undefined && link.badge > 0 && (
                <span className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${location.pathname === link.href ? "bg-background text-primary" : "bg-accent text-forest"}`}>
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          
          <div className="pt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-4">Account</div>
          <Link
            to="/dashboard/profile"
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
              location.pathname === "/dashboard/profile" 
              ? "bg-forest text-white shadow-lg shadow-forest/20" 
              : "text-gray-500 hover:bg-forest/5 hover:text-forest"
            }`}
          >
            <span className="text-sage"><User size={20} /></span>
            My Profile
          </Link>
          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
              location.pathname === "/dashboard/settings" 
              ? "bg-forest text-white shadow-lg shadow-forest/20" 
              : "text-gray-500 hover:bg-forest/5 hover:text-forest"
            }`}
          >
            <span className="text-sage"><Settings size={20} /></span>
            Settings
          </Link>
        </nav>

        {isGuide && (
          <div className="mt-8 p-6 bg-accent/20 rounded-3xl border border-forest/5">
             <div className="flex items-center gap-3 mb-4">
                <PlusCircle size={20} className="text-forest" />
                <h4 className="font-extrabold text-sm text-forest leading-tight">Create Trip</h4>
             </div>
             <Link 
              to="/guide/dashboard/create"
              className="block w-full py-3 bg-gradient-signature text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
             >
               Build New Adventure
             </Link>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="mt-8 flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-24 bg-background/40 backdrop-blur-md border-b border-border-dim flex items-center justify-between px-8">
           <div className="flex items-center gap-4 lg:hidden">
              <Logo showTagline={false} />
           </div>
           
           <h2 className="text-xl font-black text-forest">Dashboard</h2>

           <div className="flex items-center gap-6">
              <NotificationBell />
              <div className="hidden md:flex flex-col text-right">
                 <span className="text-sm font-black text-forest">{user.name}</span>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user.role}</span>
              </div>
              <div className="w-12 h-12 bg-forest/5 border border-sage/20 rounded-2xl flex items-center justify-center font-black text-forest">
                 {user.name[0]}
              </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
