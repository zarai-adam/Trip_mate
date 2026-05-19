import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Star, MapPin, ArrowRight, UserCheck, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";

interface Guide {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  verificationStatus?: string;
  _count: {
    trips: number;
  };
  specialties?: string[];
}

export default function TopGuidesCarousel() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    apiFetch("/api/guides")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setGuides(data.slice(0, 6));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch guides", err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (guides.length === 0) return null;

  return (
    <section className="py-32 bg-gradient-signature relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/5 rounded-full blur-[150px] -z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter"
            >
              Meet Your Guides
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/50 font-medium italic"
            >
              Expert travelers verified by our community.
            </motion.p>
          </div>
          <Link 
            to="/guides"
            className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs hover:gap-4 transition-all"
          >
            Find a Travel Guru <ArrowRight size={18} />
          </Link>
        </div>

        <div className="relative group/carousel">
          {/* Navigation Arrows */}
          <div className="hidden md:block">
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-14 h-14 rounded-full bg-white text-forest flex items-center justify-center shadow-2xl opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-4 transition-all hover:scale-110 active:scale-95 disabled:opacity-0"
              aria-label="Scroll left"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-14 h-14 rounded-full bg-white text-forest flex items-center justify-center shadow-2xl opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:-translate-x-4 transition-all hover:scale-110 active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 pb-12 no-scrollbar px-4 -mx-4 items-stretch snap-x snap-mandatory"
          >
          {guides.map((guide, idx) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[280px] md:min-w-[320px] bg-background rounded-[3rem] p-8 space-y-6 flex flex-col justify-between hover:shadow-2xl hover:shadow-white/10 transition-all border border-border-dim snap-start"
            >
              <div className="space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-gradient-signature rounded-[2rem] rotate-6 opacity-30"></div>
                  <img 
                    src={guide.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${guide.id}`} 
                    className="relative w-full h-full rounded-[2rem] object-cover border-4 border-white shadow-xl" 
                    alt="" 
                  />
                  <div className="absolute -right-2 -bottom-2 bg-forest text-white p-2 rounded-xl shadow-lg border border-white/20">
                    <UserCheck size={16} />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-black text-foreground mb-1">{guide.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-400 font-bold text-xs mb-4">
                    <MapPin size={12} className="text-sage" />
                    {guide.verificationStatus === "VERIFIED" ? "Verified Local" : "Active Guide"}
                  </div>
                  
                  <div className="flex justify-center flex-wrap gap-2">
                    {guide.specialties?.slice(0, 2).map((s) => (
                      <span key={s} className="px-3 py-1 bg-background-soft text-[10px] font-black uppercase tracking-widest text-foreground-muted rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-background-soft rounded-[2rem] p-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mb-1">Rating</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star size={12} className="text-accent fill-accent" />
                    <span className="font-black text-foreground">5.0</span>
                  </div>
                </div>
                <div className="text-center border-l border-border-dim">
                  <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mb-1">Trips Led</p>
                  <span className="font-black text-foreground">{guide._count.trips}</span>
                </div>
              </div>

              <Link 
                to={`/guides/${guide.id}`}
                className="w-full py-4 bg-gradient-signature text-white rounded-2xl font-black uppercase tracking-widest text-[10px] text-center hover:scale-[1.02] transition-all"
              >
                View Profile
              </Link>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
