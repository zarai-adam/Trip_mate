import { motion } from "motion/react";
import { Link } from "react-router-dom";

const DESTINATIONS = [
  { 
    name: "Morocco", 
    trips: 12, 
    image: "https://images.unsplash.com/photo-1541097166060-633190be6c87?auto=format&fit=crop&q=80&w=800",
    size: "large"
  },
  { 
    name: "Tunisia", 
    trips: 8, 
    image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=800",
    size: "small"
  },
  { 
    name: "Japan", 
    trips: 24, 
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800",
    size: "medium"
  },
  { 
    name: "Peru", 
    trips: 15, 
    image: "https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?auto=format&fit=crop&q=80&w=800",
    size: "small"
  },
  { 
    name: "Tanzania", 
    trips: 10, 
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800",
    size: "medium"
  },
  { 
    name: "Vietnam", 
    trips: 18, 
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800",
    size: "large"
  },
];

export default function DestinationsGrid() {
  return (
    <section className="py-32 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tighter"
          >
            Popular Destinations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-foreground-muted font-medium italic"
          >
            Explore the world's most authentic paths.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px]">
          {DESTINATIONS.map((dest, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`relative rounded-[3rem] overflow-hidden group cursor-pointer ${
                dest.size === "large" ? "row-span-2 col-span-2 md:col-span-1" : 
                dest.size === "medium" ? "row-span-2" : "row-span-1"
              }`}
            >
              <Link to={`/explore?destination=${dest.name}`} className="block h-full">
                <img src={dest.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-forest/80 group-hover:backdrop-blur-[2px] transition-all duration-500"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">{dest.name}</h3>
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{dest.trips} trips available</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
