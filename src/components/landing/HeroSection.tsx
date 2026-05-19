import { motion } from "motion/react";
import { Search, MapPin, Calendar, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const POPULAR_DESTINATIONS = [
  { name: "Morocco", emoji: "🇲🇦" },
  { name: "Tunisia", emoji: "🇹🇳" },
  { name: "Japan", emoji: "🇯🇵" },
  { name: "Peru", emoji: "🇵🇪" },
  { name: "Tanzania", emoji: "🇹🇿" },
];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/explore");
    }
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000"
        >
          <source 
            src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27dbed09d226fc008064d4715f220f862308e92&profile_id=164&oauth2_token_id=57447761" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white mb-6 md:mb-8"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">Trusted by 1,200+ backpackers</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight md:leading-[0.9] tracking-tight md:tracking-tighter"
        >
          Travel with someone <br className="hidden md:block" /> who's actually been there.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-xl text-white/80 max-w-2xl mx-auto mb-10 md:mb-12 font-medium px-4"
        >
          Join expert-led group trips. Real travelers, real knowledge, real adventures.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-4xl mx-auto bg-white rounded-2xl md:rounded-[3rem] p-1.5 md:p-3 shadow-2xl flex flex-col md:flex-row gap-0 md:gap-2"
        >
          <div className="flex-1 flex items-center gap-3 px-6 py-4 md:py-6 border-b md:border-b-0 md:border-r border-gray-100">
            <Search className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 font-semibold placeholder:text-gray-300 text-sm md:text-base px-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="flex-1 hidden md:flex items-center gap-4 px-6 py-6 border-r border-gray-100">
            <Calendar className="text-gray-400" size={18} />
            <span className="text-gray-300 font-semibold">When?</span>
          </div>
          <button 
            onClick={() => handleSearch()}
            className="bg-gradient-signature text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-full font-bold text-sm hover:scale-105 transition-all flex items-center justify-center gap-2 group m-2 md:m-0 shadow-lg shadow-forest/20"
          >
            Find Trips <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              onClick={() => navigate(`/explore?search=${dest.name}`)}
              className="px-4 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-full text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <span>{dest.emoji}</span>
              {dest.name}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
