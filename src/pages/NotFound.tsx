import { motion } from "motion/react";
import { Compass, Home, Map } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="bg-forest min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-spin-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-reverse-spin"></div>

      <div className="container max-w-xl text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
        >
          <div className="w-32 h-32 bg-sand rounded-[3rem] flex items-center justify-center text-forest mx-auto mb-12 shadow-2xl relative">
             <Map size={64} />
             <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-forest border-4 border-sand shadow-lg">
                <span className="text-xs font-black">?</span>
             </div>
          </div>
          
          <h1 className="text-8xl md:text-[10rem] font-black text-white leading-none mb-4 tracking-tighter opacity-20">404</h1>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-sand mb-6 uppercase tracking-tight">You've gone off-grid.</h2>
          
          <p className="text-white/60 text-lg mb-12 font-medium italic">Even the best explorers get lost sometimes. This coordinate doesn't seem to have any trips... yet.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/" className="inline-flex items-center justify-center gap-3 bg-white text-forest px-10 h-16 rounded-full font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Home size={18} /> Basecamp
             </Link>
             <Link to="/explore" className="inline-flex items-center justify-center gap-3 bg-white/10 text-white border border-white/20 px-10 h-16 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
                <Compass size={18} /> Find a tribe
             </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Coordinates decoration */}
      <div className="absolute bottom-12 left-12 text-white/10 italic text-[10px] font-mono select-none">
         LAT: 44.404 N | LON: 19.86 E
      </div>
    </div>
  );
}
