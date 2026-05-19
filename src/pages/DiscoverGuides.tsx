import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Star, Globe, ShieldCheck, Heart, ChevronRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";

interface Guide {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  verificationStatus: string;
  _count: {
    trips: number;
  };
}

export default function DiscoverGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSpecialty, setActiveSpecialty] = useState("All");

  const specialties = ["All", "Hiking", "Desert", "Food", "Culture", "Photography", "Surf"];

  useEffect(() => {
    apiFetch("/api/guides")
      .then(res => res.json())
      .then(data => {
        setGuides(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch guides", err);
        setIsLoading(false);
      });
  }, []);


  return (
    <div className="bg-offwhite min-h-screen font-sans">
      {/* Header */}
      <section className="bg-white border-b border-gray-100 pt-40 pb-28 px-6 text-left">
        <div className="max-w-7xl mx-auto">
           <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
           >
            <h1 className="text-6xl md:text-8xl font-heading font-extrabold text-forest mb-8 leading-[0.8] tracking-tighter uppercase">LOCAL<br/>LEGENDS</h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl font-medium italic">
              Every guide on Trip Mate is a verified local expert with years of authentic experience. Join their expedition and see the world differently.
            </p>
           </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 -translate-y-16">
        <div className="bg-white p-6 rounded-[3rem] shadow-sleek border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-forest transition-colors" size={24} />
            <input 
              type="text"
              placeholder="Search guides by name, specialty, or location..."
              className="w-full h-20 pl-20 pr-8 bg-offwhite border-none rounded-[2rem] focus:ring-4 focus:ring-sage/10 focus:outline-none font-bold text-forest placeholder:text-gray-200 transition-all text-lg"
            />
          </div>
          <button className="h-20 px-12 bg-forest text-white rounded-[2rem] shadow-2xl shadow-forest/20 transform hover:scale-[1.02] transition-all flex items-center gap-4 font-black uppercase tracking-widest text-xs whitespace-nowrap">
            <SlidersHorizontal size={20} /> Advanced Filter
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div className="flex flex-wrap gap-3 mb-20 overflow-x-auto no-scrollbar py-2">
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setActiveSpecialty(spec)}
              className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                activeSpecialty === spec 
                  ? "bg-forest text-white border-forest shadow-xl" 
                  : "bg-white text-gray-400 border-gray-50 hover:border-sage/20 shadow-sm"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {guides.map((guide, idx) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white rounded-[4rem] shadow-sm border border-gray-50 p-10 flex flex-col sm:flex-row gap-10 hover:shadow-2xl transition-all duration-700 relative group text-left"
            >
              <button className="absolute top-10 right-10 text-gray-200 hover:text-forest transition-colors">
                <Heart size={26} />
              </button>

              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-sage/10 rounded-[2.5rem] border-8 border-white flex items-center justify-center text-forest text-5xl font-black shadow-xl relative overflow-hidden">
                   {guide.avatar ? (
                     <img src={guide.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                   ) : (
                     guide.name[0]
                   )}
                   {guide.verificationStatus === "VERIFIED" && (
                     <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-forest rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-2xl">
                        <ShieldCheck size={22} />
                     </div>
                   )}
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-heading font-extrabold text-forest uppercase tracking-tight">{guide.name}</h3>
                    <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest mt-2">
                       <MapPin size={14} className="text-sage" /> LOCAL LEGEND
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-black text-sand text-lg">
                    <Star size={22} fill="currentColor" /> 5.0
                  </div>
                </div>

                <p className="text-gray-400 line-clamp-2 text-base font-medium leading-relaxed italic">
                  &quot;{guide.bio || "No bio provided yet."}&quot;
                </p>

                <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center text-forest">
                      <Globe size={20} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-forest">Explorer</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center text-forest">
                      <Star size={20} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-forest">{guide._count.trips} EXPEDITIONS</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-3">
                    <span className="px-4 py-1.5 bg-offwhite text-sage text-[10px] font-black rounded-lg border border-gray-100 uppercase tracking-widest">
                      Expert
                    </span>
                  </div>
                  <Link to={`/guide/${guide.id}`} className="text-forest font-black uppercase tracking-widest text-[10px] flex items-center gap-3 group-hover:gap-4 transition-all">
                    View Portfolio <ChevronRight size={16} className="text-sage" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        
        <div className="mt-32 bg-forest rounded-[5rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20"></div>
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-8xl font-heading font-extrabold leading-[0.8] uppercase tracking-tighter">LEAD THE<br/>EXPEDITION</h2>
            <p className="text-gray-300 text-xl md:text-2xl font-medium leading-relaxed italic">
              Join our guild of verified local legends and transform your travel expertise into a career. We provide the infrastructure, you provide the adventure.
            </p>
            <Link to="/register" className="inline-block pt-8">
              <button className="bg-white text-forest px-16 h-20 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Apply to be a Legend
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
