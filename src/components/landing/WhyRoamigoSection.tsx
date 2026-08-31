import { motion } from "motion/react";
import { Backpack, Wallet, ShieldCheck, Map, Users2, HeartHandshake } from "lucide-react";

const FEATURES = [
  {
    icon: Backpack,
    title: "No tourist traps",
    description: "Real travelers who know the hidden gems beyond the guidebook.",
  },
  {
    icon: Wallet,
    title: "Any budget",
    description: "From sustainable free trips to premium adventures, you choose your path.",
  },
  {
    icon: HeartHandshake,
    title: "Travel with trust",
    description: "Verified guides and a two-sided review system for total peace of mind.",
  },
  {
    icon: Map,
    title: "Skip the agencies",
    description: "Direct connection to guides. No middlemen, no hidden booking fees.",
  },
  {
    icon: Users2,
    title: "Find your tribe",
    description: "Meet like-minded solo travelers looking for the same kind of adventure.",
  },
  {
    icon: ShieldCheck,
    title: "Travel safe",
    description: "Every guide is vetted and verified by our global safety team.",
  },
];

export default function WhyRoamigoSection() {
  return (
    <section className="py-32 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tighter"
          >
            Built by backpackers, <br className="md:hidden" /> for backpackers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-foreground-muted font-medium italic"
          >
            We're changing the way the world travels, one authentic trip at a time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex gap-8 items-start"
            >
              <div className="w-16 h-16 bg-forest/5 text-forest flex items-center justify-center rounded-[1.5rem] group-hover:bg-gradient-signature group-hover:text-white transition-all shrink-0">
                <feature.icon size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{feature.title}</h3>
                <p className="text-foreground-muted font-medium leading-relaxed italic">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
