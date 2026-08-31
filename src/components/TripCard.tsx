import { motion } from "motion/react";
import { MapPin, Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import VerificationBadge from "./VerificationBadge";

interface Trip {
  id: string;
  title: string;
  destination: string;
  price: number;
  startDate: string;
  endDate: string;
  guide: {
    id: string;
    name: string;
    avatar?: string;
    emailVerified?: boolean;
    role?: string;
    tripCount?: number;
    ratingAverage?: number;
  };
  type: string;
  difficulty: string;
  image?: string;
}

interface TripCardProps {
  trip: Trip;
  index: number;
}

export default function TripCard({ trip, index }: TripCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("roamigo_wishlist");
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setIsFavorite(favorites.includes(trip.id));
    }
  }, [trip.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const savedFavorites = localStorage.getItem("roamigo_wishlist");
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (favorites.includes(trip.id)) {
      favorites = favorites.filter((id: string) => id !== trip.id);
      setIsFavorite(false);
    } else {
      favorites.push(trip.id);
      setIsFavorite(true);
    }
    
    localStorage.setItem("roamigo_wishlist", JSON.stringify(favorites));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12, scale: 1.02 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.05 
      }}
      className="group bg-background/70 backdrop-blur-sm rounded-[3rem] overflow-hidden shadow-sleek hover:shadow-2xl transition-all duration-700 border border-border-dim relative h-full flex flex-col"
    >
      <button 
        onClick={toggleFavorite}
        className={`absolute top-6 right-6 z-10 w-12 h-12 backdrop-blur-md rounded-2xl flex items-center justify-center border transition-all ${
          isFavorite
            ? "bg-gradient-signature text-white border-forest/10" 
            : "bg-white/20 text-white border-white/30 hover:bg-gradient-signature hover:text-white"
        }`}
      >
        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      
      <div className="relative h-80 overflow-hidden">
        <img 
          src={trip.image || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800"} 
          srcSet={trip.image?.includes('unsplash') ? `${trip.image}&w=400 400w, ${trip.image}&w=800 800w, ${trip.image}&w=1200 1200w` : undefined}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="bg-gradient-signature/80 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/10">
            {trip.type}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 bg-background p-6 rounded-3xl shadow-xl border border-border-dim transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
           <div className="flex justify-between items-center gap-4">
             <div className="max-w-[70%]">
               <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest mb-1.5">
                  <MapPin size={12} /> {trip.destination}
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground leading-tight line-clamp-1 tracking-tight">{trip.title}</h3>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-foreground-muted font-bold uppercase tracking-widest mb-1">From</div>
                <div className="text-xl font-heading font-bold text-foreground leading-none">
                  ${trip.price}
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="p-8 pt-10 flex-grow flex flex-col justify-between">
        <div className="flex items-center justify-between pb-6 border-b border-border-dim">
            <Link to={`/guide/${trip.guide.id}`} className="flex items-center gap-3 relative z-10 group/guide">
               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold border-4 border-background shadow-md overflow-hidden group-hover/guide:scale-110 transition-transform">
                 {trip.guide.avatar ? (
                   <img src={trip.guide.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                 ) : (
                   (trip.guide?.name || "G")[0]
                 )}
               </div>
               <div>
                 <div className="flex items-center gap-1.5 mb-0.5">
                   <div className="text-[9px] text-foreground-muted font-bold uppercase tracking-widest">Local Expert</div>
                   <VerificationBadge user={trip.guide} size={10} />
                 </div>
                 <div className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">{trip.guide.name}</div>
               </div>
            </Link>
        </div>
        
        <div className="pt-6 flex justify-between items-center">
           <div className="flex items-center gap-2 text-accent font-bold text-sm drop-shadow-sm">
              <Star size={16} fill="currentColor" className="text-accent" /> 
              <span className="text-foreground">4.9</span> 
              <span className="text-foreground-muted font-medium">(24)</span>
           </div>
           <Link 
            to={`/trip/${trip.id}`} 
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-signature text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-md shadow-forest/10 hover:shadow-lg active:scale-95"
           >
             View Trip
           </Link>
        </div>
      </div>
      
      <Link to={`/trip/${trip.id}`} className="absolute inset-0 z-0 opacity-0" />
    </motion.div>
  );
}
