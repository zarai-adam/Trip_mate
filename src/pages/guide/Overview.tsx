import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Briefcase, Wallet, Star, ChevronRight, PlusCircle, Clock, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";

export default function GuideOverview() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);

      const loadDashboardData = async () => {
        setIsLoading(true);
        try {
          const [profileRes, tripsRes, bookingsRes] = await Promise.all([
            apiFetch(`/api/users/${parsedUser.id}`),
            apiFetch("/api/trips/guide/my-trips"),
            apiFetch(`/api/bookings?guideId=${parsedUser.id}`)
          ]);

          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setFullProfile(profileData);
          }
          if (tripsRes.ok) {
            const tripsData = await tripsRes.json();
            setTrips(tripsData);
          }
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            setBookings(bookingsData);
          }
        } catch (err) {
          console.error("Failed to load guide overview data", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadDashboardData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const activeTripsCount = trips.filter(t => t.status === "PUBLISHED" || t.status === "ACCEPTED").length;
  const totalBookingsCount = bookings.length;
  const approvedBookingsCount = bookings.filter(b => b.status === "APPROVED").length;

  const approvedBookings = bookings.filter(b => b.status === "APPROVED");
  const grossEarnings = approvedBookings.reduce((sum, b) => {
    const tripPrice = b.trip?.price || b.trip?.pricePerPerson || 0;
    return sum + Number(tripPrice);
  }, 0);
  const netEarnings = grossEarnings * 0.85;

  const reviewsList = fullProfile?.reviewsReceived || [];
  const averageRating = reviewsList.length > 0 
    ? (reviewsList.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewsList.length).toFixed(1)
    : "0.0";

  const stats = [
    { 
      label: "Active Trips", 
      value: activeTripsCount.toString(), 
      icon: <Briefcase size={24} />, 
      trend: `${trips.length} total`, 
      color: "bg-sage/10 text-sage" 
    },
    { 
      label: "Total Bookings", 
      value: totalBookingsCount.toString(), 
      icon: <Users size={24} />, 
      trend: `${approvedBookingsCount} approved`, 
      color: "bg-sand text-forest" 
    },
    { 
      label: "Total Earnings", 
      value: `$${grossEarnings.toLocaleString()}`, 
      icon: <Wallet size={24} />, 
      trend: `$${netEarnings.toLocaleString()} net`, 
      color: "bg-forest/5 text-forest" 
    },
    { 
      label: "Avg Rating", 
      value: averageRating, 
      icon: <Star size={24} />, 
      trend: `${reviewsList.length} reviews`, 
      color: "bg-sage/10 text-sage" 
    },
  ];

  const requestedBookings = bookings.filter(b => b.status === "REQUESTED");
  const recentRequests = requestedBookings.slice(0, 3).map(b => ({
    id: b.id,
    avatar: b.explorer?.name ? b.explorer.name[0].toUpperCase() : "T",
    user: b.explorer?.name || "Fellow Traveler",
    trip: b.trip?.title || "Curated Expedition",
    date: new Date(b.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }));

  return (
    <div className="space-y-12 text-left">
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

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-forest animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Loading your tribal metrics...</span>
        </div>
      ) : (
        <>
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
                              <Link to="/guide/dashboard/requests">
                                <Button className="h-10 bg-forest text-white rounded-xl px-6 font-bold text-xs hover:bg-forest/90 whitespace-nowrap">
                                  Manage
                                </Button>
                              </Link>
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
                   {reviewsList.length > 0 ? (
                     <>
                       <p className="text-gray-500 italic text-sm mb-4 leading-relaxed font-medium">
                         &quot;{reviewsList[0].comment}&quot;
                       </p>
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-forest">— {reviewsList[0].reviewer?.firstName || "Traveler"} {reviewsList[0].reviewer?.lastName?.charAt(0) || ""}.</span>
                          <div className="flex text-yellow-500">
                             {Array.from({ length: reviewsList[0].rating }).map((_, i) => (
                               <Star key={i} size={14} fill="currentColor" />
                             ))}
                             {Array.from({ length: 5 - reviewsList[0].rating }).map((_, i) => (
                               <Star key={i} size={14} className="text-gray-200" />
                             ))}
                          </div>
                       </div>
                     </>
                   ) : (
                     <div className="text-center py-6">
                       <p className="text-gray-400 italic text-sm mb-2 leading-relaxed">
                         No reviews yet
                       </p>
                       <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                         Complete trips to get echoes!
                       </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
