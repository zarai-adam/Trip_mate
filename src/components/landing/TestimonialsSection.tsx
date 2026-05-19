import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Jenkins",
    country: "United Kingdom",
    trip: "Moroccan Sahara Expedition",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    quote: "Actually meeting people who had been there before made such a difference. I've never felt more safe or more adventurous in my life.",
    rating: 5,
  },
  {
    name: "Luca Rossi",
    country: "Italy",
    trip: "Hidden Temples of Japan",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luca",
    quote: "Trip Mate connected me with a group of solo travelers I now call friends. Our guide, Kenji, showed us spots you simply cannot find on Google Maps.",
    rating: 5,
  },
  {
    name: "Elena Martinez",
    country: "Spain",
    trip: "Peru Mountains & Culture",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    quote: "The direct connection to the guide was key. I could ask anything before joining, and the trip itself was perfectly organized. Best solo trip ever!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tighter"
          >
            What backpackers say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-foreground-muted font-medium italic"
          >
            Verified reviews from our global community of adventurers.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-background/60 backdrop-blur-sm p-10 rounded-[3rem] relative group hover:bg-white dark:hover:bg-background-soft hover:shadow-2xl hover:shadow-forest/5 transition-all border border-border-dim hover:border-border-dim"
            >
              <div className="absolute top-8 right-8 text-forest/5 group-hover:text-forest/10 transition-colors">
                <Quote size={80} />
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                
                <p className="text-lg text-foreground-muted font-medium leading-relaxed italic">
                  "{t.quote}"
                </p>
                
                <div className="flex items-center gap-4 pt-8 border-t border-gray-200">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-forest/10 border border-gray-200">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-foreground uppercase tracking-tight">{t.name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.country} — {t.trip}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
