import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Briefcase, Wallet, TrendingUp, Star, ChevronRight, PlusCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function GuideOverview() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const stats = [
    { label: "Active Trips", value: "0", icon: <Briefcase size={24} />, trend: "0", color: "bg-sage/10 text-sage" },
    { label: "Total Bookings", value: "0", icon: <Users size={24} />, trend: "0", color: "bg-sand text-forest" },
    { label: "Total Earnings", value: "$0", icon: <Wallet size={24} />, trend: "$0", color: "bg-forest/5 text-forest" },
    { label: "Avg Rating", value: "0", icon: <Star size={24} />, trend: "0", color: "bg-sage/10 text-sage" },
  ];

  const recentRequests: any[] = [];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h1 className="text-3xl md:text-5xl font-black text-forest mb-4">Welcome back, {user?.name || "Guide"}!</h1>
           <p className="text-gray-500 font-medium italic">&quot;Your tribe is waiting for their next adventure.&quot;</p>
        </div>
        <Link to="/guide/dashboard/create">
           <Button className="h-14 bg-forest text-white rounded-2xl px-10 font-bold gap-3 text-lg shadow-xl shadow-forest/20">
              <PlusCircle size={24} /> Create New Trip
           </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {stats.map((stat, idx) => (
           <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-sage/10 shadow-sleek"
           >
              <div className="flex justify-between items-start mb-6">
                 <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                    {stat.icon}
                 </div>
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
              <div className="flex items-end justify-between">
                 <div className="text-4xl font-black text-forest">{stat.value}</div>
                 <div className="text-[10px] font-black bg-sage/10 text-sage px-2 py-1 rounded-full">{stat.trend}</div>
              </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Booking Requests */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-2xl font-black text-forest">Recent Requests</h3>
               <Link to="/guide/dashboard/requests" className="text-sm font-bold text-forest flex items-center gap-1 group">
                 View all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-sage/10 shadow-sleek overflow-hidden min-h-[200px] flex flex-col items-center justify-center p-8">
               {recentRequests.length > 0 ? recentRequests.map((req, idx) => (
                 <div key={req.id} className={`w-full p-8 flex items-center justify-between hover:bg-offwhite transition-colors ${idx < recentRequests.length - 1 ? "border-b border-sage/10" : ""}`}>
                    <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-forest/5 border border-sage/20 rounded-2xl flex items-center justify-center font-black text-forest text-xl">
                          {req.avatar}
                       </div>
                       <div>
                          <div className="font-black text-forest text-lg">{req.user}</div>
                          <div className="text-sm text-gray-400 font-medium flex items-center gap-1">
                             <MapPin size={12} className="text-sage" /> {req.trip}
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                       <div className="flex items-center gap-1 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          <Clock size={12} /> {req.date}
                       </div>
                       <div className="flex gap-2">
                          <Button variant="outline" className="h-10 rounded-xl px-6 font-bold text-xs">Review</Button>
                          <Button className="h-10 bg-forest text-white rounded-xl px-6 font-bold text-xs">Approve</Button>
                       </div>
                    </div>
                 </div>
               )) : (
                 <div className="text-center py-10">
                   <div className="w-16 h-16 bg-offwhite rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                     <Users size={32} />
                   </div>
                   <p className="text-gray-400 font-bold">No recent requests.</p>
                   <p className="text-gray-300 text-xs font-medium mt-1">They will appear here once travelers start booking.</p>
                 </div>
               )}
            </div>
         </div>

         {/* Sidebar: Analytics / Tips */}
         <div className="space-y-8">
            <h3 className="text-2xl font-black text-forest mb-2">Guide Tips</h3>
            <div className="bg-sand p-8 rounded-[2.5rem] border border-forest/5 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 opacity-10"><Star size={120} /></div>
               <div className="relative z-10">
                  <h4 className="text-xl font-black text-forest mb-4">Complete your verification</h4>
                  <p className="text-forest/70 text-sm font-medium leading-relaxed mb-6">
                    Verified PRO guides get 3x more bookings and can set higher prices. Upload your travel history evidence today.
                  </p>
                  <Button className="w-full bg-forest text-white rounded-xl h-12 font-black uppercase tracking-widest text-xs">Get Verified</Button>
               </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-sage/10 shadow-sleek">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage">
                     <Star size={20} />
                  </div>
                  <h4 className="font-bold text-forest">Recent Review</h4>
               </div>
               <p className="text-gray-500 italic text-sm mb-4 leading-relaxed font-medium">
                 &quot;Malik was the best guide I&apos;ve ever had. He showed us spots in the desert I never would have found as a tourist.&quot;
               </p>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-forest">— Sarah J.</span>
                  <div className="flex text-yellow-500"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
