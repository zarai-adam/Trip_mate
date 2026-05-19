import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Calendar, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";

interface Trip {
  id: string;
  title: string;
  destination: string;
  price: number;
  startDate: string;
  image: string;
  guide: {
    name: string;
    avatar?: string;
  };
  ratingAverage?: number;
}

export default function FeaturedTripsSection() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/trips")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTrips(data.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch featured trips", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="py-24 text-center text-gray-400 font-semibold tracking-widest text-xs animate-pulse">
      Curating your next adventure...
    </div>
  );

  if (trips.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-transparent">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
          <div className="text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4 tracking-tight"
            >
              Upcoming adventures
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-foreground-muted font-medium italic"
            >
              Curated trips led by verified local experts.
            </motion.p>
          </div>
          <Link 
            to="/explore"
            className="flex items-center gap-2 text-forest font-bold uppercase tracking-widest text-[10px] md:text-xs hover:gap-4 transition-all"
          >
            Explore all trips <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trips.map((trip, idx) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-background/60 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-border-dim shadow-sm hover:shadow-2xl transition-all"
            >
              <Link to={`/trip/${trip.id}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={trip.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"} 
                      alt={trip.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-gray-900">{trip.ratingAverage || "5.0"}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                        <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-0.5">Price</p>
                        <p className="text-xl font-bold text-white">${trip.price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-forest">
                        <MapPin size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{trip.destination}</span>
                      </div>
                      <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-forest transition-colors line-clamp-2 leading-tight tracking-tight">
                        {trip.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <img 
                          src={trip.guide.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${trip.guide.name}`} 
                          className="w-8 h-8 rounded-xl object-cover border border-gray-100" 
                          alt="" 
                        />
                        <span className="text-xs font-bold text-foreground">{trip.guide.name}</span>
                      </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} />
                      <span className="text-[10px] font-bold">{new Date(trip.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 md:mt-20 text-center">
           <Link 
             to="/explore"
             className="inline-flex items-center gap-4 px-10 md:px-12 py-5 md:py-6 bg-gradient-signature text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-forest/20 hover:scale-[1.02] transition-all"
           >
             Explore all 120+ trips <ArrowRight size={18} />
           </Link>
        </div>
      </div>
    </section>
  );
}
