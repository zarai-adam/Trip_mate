import React from "react";
import { motion } from "motion/react";
import { Search, History, TrendingUp, Sparkles, MapPin, ArrowUpRight } from "lucide-react";

interface SearchSuggestionsProps {
  isVisible: boolean;
  onSelect: (value: string) => void;
}

export default function SearchSuggestions({ isVisible, onSelect }: SearchSuggestionsProps) {
  if (!isVisible) return null;

  const popular = ["Sahara Desert", "Atlas Mountains", "Marrakech Medina", "Chefchaouen Blue City", "Tuscany Coast"];
  const trending = [
    { title: "Starry Night Sahara", category: "Nature" },
    { title: "Tuscan Vineyard Escape", category: "Culinary" },
    { title: "Peak Discovery Atlas", category: "Adventure" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-forest/5 p-8 z-[100] max-h-[500px] overflow-y-auto no-scrollbar ring-1 ring-black/5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
            <History size={14} className="text-sage" /> Recent Searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {["Chefchaouen", "Italy", "Solo Desert"].map(term => (
              <button 
                key={term}
                onClick={() => onSelect(term)}
                className="px-4 py-2 bg-offwhite hover:bg-forest/5 rounded-xl text-xs font-bold text-forest transition-all border border-sage/10"
              >
                {term}
              </button>
            ))}
          </div>

          <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2 pt-4">
            <MapPin size={14} className="text-sage" /> Popular Destinations
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {popular.map(dest => (
              <button 
                key={dest}
                onClick={() => onSelect(dest)}
                className="flex items-center justify-between p-3 hover:bg-forest/5 rounded-xl text-sm font-bold text-forest/80 group transition-all"
              >
                {dest}
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-sage" />
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-2">
            <TrendingUp size={14} className="text-sage" /> Trending Expeditions
          </h4>
          <div className="space-y-3">
            {trending.map(trip => (
              <button 
                key={trip.title}
                onClick={() => onSelect(trip.title)}
                className="w-full flex items-center gap-4 p-4 bg-offwhite hover:bg-forest/5 rounded-2xl border border-sage/5 transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner group-hover:shadow-md transition-all">
                  <Sparkles size={20} className="text-sage" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-forest">{trip.title}</div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{trip.category}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-sand/10 p-6 rounded-[2rem] border border-sand/30 mt-8">
             <h5 className="text-xs font-black text-forest mb-2">Adventure is calling!</h5>
             <p className="text-[10px] text-forest/60 font-medium leading-relaxed italic">
               &quot;The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.&quot;
             </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
