import React from "react";
import { motion } from "motion/react";
import { MapPin, Heart, Star, Users, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  };
  type: string;
  difficulty: string;
  image?: string;
}

interface ListViewCardProps {
  trip: Trip;
  index: number;
}

export default function ListViewCard({ trip, index }: ListViewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-sleek hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row h-auto md:h-64"
    >
      <div className="w-full md:w-80 h-64 md:h-full relative shrink-0 overflow-hidden">
        <img 
          src={trip.image || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800"} 
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-forest/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-white/10">
            {trip.type}
          </span>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col justify-between">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sage font-black text-[10px] uppercase tracking-widest">
              <MapPin size={12} /> {trip.destination}
            </div>
            <h3 className="text-xl font-heading font-extrabold text-forest line-clamp-1">{trip.title}</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
               <div className="flex items-center gap-1.5"><Calendar size={14} className="text-forest/30" /> 5 Days</div>
               <div className="flex items-center gap-1.5"><Users size={14} className="text-forest/30" /> Max 8</div>
               <div className="flex items-center gap-1.5 font-black text-sand uppercase tracking-widest"><Star size={14} fill="currentColor" /> 4.9</div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Price</div>
             <div className="text-2xl font-black text-forest">${trip.price}</div>
             <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Per Person</div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
           <Link to={`/guide/${trip.guide.id}`} className="flex items-center gap-3 group/guide">
              <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-forest font-bold border border-forest/10 overflow-hidden">
                {trip.guide.avatar ? (
                  <img src={trip.guide.avatar} className="w-full h-full object-cover" alt="" />
                ) : (
                  trip.guide.name[0]
                )}
              </div>
              <div>
                <div className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Local Pro</div>
                <div className="text-xs font-bold text-forest group-hover/guide:text-sage transition-colors">{trip.guide.name}</div>
              </div>
           </Link>
           <Link 
            to={`/trip/${trip.id}`} 
            className="flex items-center gap-2 px-8 py-3 bg-forest text-white rounded-xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-forest-dark transition-all"
           >
             Book Expedition <ArrowRight size={14} />
           </Link>
        </div>
      </div>
    </motion.div>
  );
}
