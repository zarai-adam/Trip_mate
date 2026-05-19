import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Bell, MessageSquare, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import Logo from "./Logo";
import NotificationBell from "./NotificationBell";
import { useChat } from "@/context/ChatContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { totalUnreadCount } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Track visits for PWA prompt
    const visits = parseInt(localStorage.getItem("tm_visits") || "0");
    localStorage.setItem("tm_visits", (visits + 1).toString());

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install button if visited 3+ times
      if (visits >= 3) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const navLinks = [
    { name: "Explore", href: "/explore" },
    { name: "Destinations", href: "/destinations" },
    { name: "Blog", href: "/blog" },
    { name: "How it Works", href: "/how-it-works" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav 
      id="navbar" 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
        ? "bg-background/90 backdrop-blur-md border-b border-border-dim py-2 shadow-sm" 
        : "bg-transparent py-4"
      }`}
    >
      <div className="container-wide">
        <div className="flex justify-between items-center">
          <Logo />

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className={`font-semibold text-sm transition-all ${
                    scrolled 
                      ? "text-foreground hover:text-primary" 
                      : "text-foreground/90 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-800 pl-8">
               <AnimatePresence>
                 {showInstallPrompt && (
                   <motion.button
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     onClick={handleInstall}
                     className="flex items-center gap-2 bg-sage text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-sage/10 hover:shadow-sage/20 transition-all mr-2 group"
                   >
                     <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                     Install App
                   </motion.button>
                 )}
               </AnimatePresence>
               {user && (
                 <div className="flex items-center gap-2">
                   <Link 
                     to="/dashboard/messages" 
                     className="relative p-2 text-gray-400 hover:text-forest transition-colors"
                     title="Messages"
                   >
                     <MessageSquare size={18} />
                     {totalUnreadCount > 0 && (
                       <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-forest text-white text-[7px] font-black flex items-center justify-center rounded-full border border-white dark:border-gray-900">
                         {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                       </span>
                     )}
                   </Link>
                   <NotificationBell />
                 </div>
               )}
               {user ? (
                 <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end leading-none">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Welcome</span>
                       <span className="text-sm font-semibold text-dark dark:text-gray-100">{user.name.split(' ')[0]}</span>
                    </div>
                    <div className="relative group/user">
                      <div className="w-9 h-9 rounded-xl bg-sage/10 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-center text-forest font-bold cursor-pointer group-hover/user:bg-forest group-hover/user:text-white transition-all text-xs">
                        {getInitials(user.name)}
                      </div>
                      
                      {/* Sub-menu */}
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-sleek border border-gray-100 dark:border-gray-700 p-1.5 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all scale-95 group-hover/user:scale-100 origin-top-right z-[60]">
                         <div className="px-4 py-2.5 border-b border-gray-50 dark:border-gray-700 flex flex-col">
                            <span className="text-xs font-bold text-dark dark:text-gray-100">{user.name}</span>
                            <span className="text-[9px] text-gray-400 uppercase font-bold">{user.role} Account</span>
                         </div>
                          <div className="p-1 space-y-0.5">
                            <Link 
                              to={user.role === "ADMIN" ? "/admin" : (user.role === "GUIDE" ? "/guide/dashboard" : "/dashboard")}
                              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold text-dark dark:text-gray-100 group/item"
                            >
                               <div className="w-7 h-7 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 group-hover/item:text-forest transition-colors">
                                 <User size={14} />
                               </div>
                               Dashboard
                            </Link>
                            <Link 
                              to="/dashboard/settings"
                              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold text-dark dark:text-gray-100 group/item"
                            >
                               <div className="w-7 h-7 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 group-hover/item:text-forest transition-colors">
                                 <Menu size={14} />
                               </div>
                               Settings
                            </Link>
                            <button 
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-xs font-semibold text-red-500 group/item"
                            >
                               <div className="w-7 h-7 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-300 group-hover/item:text-red-500 transition-colors">
                                 <LogOut size={14} />
                               </div>
                               Log Out
                            </button>
                         </div>
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="flex items-center gap-4">
                   <Link to="/login" className="text-xs font-bold text-dark dark:text-gray-100 hover:text-forest transition-colors">Log in</Link>
                   <Link 
                    to="/register" 
                    className="bg-gradient-signature text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-forest/10 hover:shadow-forest/20 active:scale-95 transition-all"
                   >
                    Join Us
                   </Link>
                 </div>
               )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {showInstallPrompt && (
              <button 
                onClick={handleInstall}
                className="w-10 h-10 bg-sage text-white rounded-xl flex items-center justify-center shadow-sm"
                title="Install App"
              >
                <Download size={20} />
              </button>
            )}
            {user && (
              <div className="flex items-center gap-1">
                <Link 
                  to="/dashboard/messages" 
                  className="relative p-2 text-gray-400"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare size={20} />
                  {totalUnreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-forest text-white text-[7px] font-black flex items-center justify-center rounded-full border border-white dark:border-gray-900">
                      {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                    </span>
                  )}
                </Link>
                <NotificationBell />
              </div>
            )}
            <button 
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="lg:hidden absolute top-full left-4 right-4 bg-background rounded-3xl shadow-xl border border-border-dim overflow-hidden mt-2"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="flex items-center px-5 py-4 text-lg font-bold text-foreground hover:bg-background-soft rounded-2xl"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                {user ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      to={user.role === "ADMIN" ? "/admin" : (user.role === "GUIDE" ? "/guide/dashboard" : "/dashboard")}
                      className="flex justify-center items-center py-4 text-foreground font-bold text-xs bg-background-soft rounded-2xl"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex justify-center items-center py-4 bg-red-50 dark:bg-red-900/30 text-red-500 font-bold text-xs rounded-2xl"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      to="/login" 
                      className="flex justify-center items-center py-4 text-foreground font-bold text-xs border border-border-dim rounded-2xl"
                      onClick={() => setIsOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link 
                      to="/register" 
                      className="flex justify-center items-center py-4 bg-gradient-signature text-white font-bold text-xs rounded-2xl shadow-lg shadow-forest/10"
                      onClick={() => setIsOpen(false)}
                    >
                      Join Us
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
