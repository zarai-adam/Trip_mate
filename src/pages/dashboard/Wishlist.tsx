import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Compass, 
  Trash2, 
  ArrowRight, 
  DollarSign, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";

export default function Wishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        setWishlistIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist storage", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch("/api/trips");
        if (res.ok) {
          const allTrips = await res.json();
          // Filter to match of wishlisted IDs
          const wishlisted = allTrips.filter((t: any) => wishlistIds.includes(t.id));
          setTrips(wishlisted);
        }
      } catch (err) {
        console.error("Failed to load wishlist trips", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (wishlistIds.length > 0) {
      fetchTrips();
    } else {
      setTrips([]);
      setIsLoading(false);
    }
  }, [wishlistIds]);

  const removeWishlist = (id: string) => {
    const updated = wishlistIds.filter(item => item !== id);
    setWishlistIds(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    // Trigger cross-page update event
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  return (
    <div className="max-w-5xl">
      <div className="text-left mb-12">
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tighter">My Saved Horizon</h1>
        <p className="text-gray-500 font-medium">Keep track of the expeditions that capture your heart.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-forest animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Loading your saved plans...</span>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-sage/20">
          <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-500 animate-pulse">
            <Heart size={48} fill="currentColor" />
          </div>
          <h3 className="text-3xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tight">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed italic">
            Wander through our curated list of tribal expeditions and hit save on those you wish to join!
          </p>
          <Button 
            onClick={() => navigate("/explore")} 
            className="bg-forest text-white px-10 h-16 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-forest/20 hover:scale-102 active:scale-98 transition-all"
          >
            Explore Expeditions
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence>
            {trips.map((trip, idx) => (
              <motion.div 
                key={trip.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] shadow-sleek border border-sage/10 overflow-hidden flex flex-col lg:flex-row text-left group hover:border-sage/20 transition-all duration-300"
              >
                <div className="lg:w-64 h-48 lg:h-auto shrink-0 bg-gray-100 relative overflow-hidden">
                  {trip.image ? (
                    <img src={trip.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={trip.title} />
                  ) : (
                    <div className="w-full h-full bg-forest/5 flex items-center justify-center text-forest/20">
                      <Compass size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-forest/90 backdrop-blur-sm text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                    {trip.tripType || "Adventure"}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest">
                      <MapPin size={14} className="text-sage" /> {trip.destination}
                    </div>
                    <h3 className="text-2xl font-heading font-extrabold text-forest leading-tight uppercase tracking-tight line-clamp-1">{trip.title}</h3>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <Calendar size={16} className="text-sage" /> 
                        {new Date(trip.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-forest text-sm">
                        <DollarSign size={16} className="text-sage shrink-0" />
                        {trip.price} <span className="text-[10px] text-gray-400 font-extrabold uppercase">/ traveler</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 shrink-0">
                    <Button 
                      onClick={() => removeWishlist(trip.id)}
                      variant="outline"
                      className="rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold px-4"
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button 
                      onClick={() => navigate(`/trip/${trip.id}`)}
                      className="bg-forest text-white rounded-xl font-bold px-6 gap-2 hover:scale-102 transition-transform"
                    >
                      View Details <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
