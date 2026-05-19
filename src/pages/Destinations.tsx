import { motion } from "motion/react";
import { Search, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const destinations = [
  { name: "Morocco", trips: 42, img: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800", slug: "Morocco" },
  { name: "Vietnam", trips: 35, img: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800", slug: "Vietnam" },
  { name: "Peru", trips: 28, img: "https://images.unsplash.com/photo-1581010866019-903fd1136c3e?auto=format&fit=crop&q=80&w=800", slug: "Peru" },
  { name: "Iceland", trips: 19, img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800", slug: "Iceland" },
  { name: "Thailand", trips: 56, img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800", slug: "Thailand" },
  { name: "Jordan", trips: 15, img: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&q=80&w=800", slug: "Jordan" },
  { name: "Egypt", trips: 22, img: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&q=80&w=800", slug: "Egypt" },
  { name: "Colombia", trips: 31, img: "https://images.unsplash.com/photo-1583997051651-8255c8d30560?auto=format&fit=crop&q=80&w=800", slug: "Colombia" }
];

export default function Destinations() {
  return (
    <div className="bg-offwhite min-h-screen font-sans">
      <section className="pt-32 md:pt-48 pb-16 px-6">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest/5 rounded-full mb-8 border border-forest/10">
               <Sparkles size={14} className="text-forest" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-forest">Global Network</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-forest uppercase tracking-tighter leading-none mb-8">Where to <br/>next?</h1>
            <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto italic">Explore the corners of the world through the trips currently calling for explorers.</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="container-wide grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Link to={`/explore?destination=${dest.slug}`} className="group relative block aspect-[4/5] rounded-[3rem] overflow-hidden shadow-sleek animate-on-hover">
                <img 
                  src={dest.img} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                  alt={dest.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div className="text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-sand mb-1">{dest.trips} Trips</p>
                    <h3 className="text-3xl font-heading font-black">{dest.name}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-forest shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 bg-forest text-white text-center">
        <div className="max-w-3xl mx-auto">
          <MapPin size={48} className="mx-auto mb-8 text-sand animate-bounce-slow" />
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-6 tracking-tight uppercase">Don't see your destination?</h2>
          <p className="text-white/60 text-lg mb-12 font-medium italic">New trips are added daily. Join our newsletter to be the first to know when your dream spot opens up.</p>
          <div className="flex bg-white/5 rounded-full p-2 border border-white/10 max-w-md mx-auto">
             <input type="email" placeholder="you@email.com" className="bg-transparent border-none focus:ring-0 px-6 py-4 flex-1 font-bold text-white placeholder-white/30" />
             <button className="bg-sand text-forest px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px]">Alert Me</button>
          </div>
        </div>
      </section>
    </div>
  );
}
