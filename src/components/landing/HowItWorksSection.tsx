import { motion } from "motion/react";
import { Search, UserPlus, CheckCircle2, Globe } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse trips by destination, style, budget. Find the adventure that speaks to you.",
    color: "bg-blue-500",
  },
  {
    icon: UserPlus,
    title: "Request",
    description: "Send a short intro to your guide. Tell them why you want to join the journey.",
    color: "bg-forest",
  },
  {
    icon: CheckCircle2,
    title: "Join",
    description: "Get accepted into a small group of like-minded travelers. Connect before you go.",
    color: "bg-amber-500",
  },
  {
    icon: Globe,
    title: "Explore",
    description: "Travel authentically with real experts. Skip the tourist traps, find the hidden spots.",
    color: "bg-purple-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-32 bg-transparent overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tighter"
          >
            Travel without the tourist traps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-foreground-muted font-medium italic"
          >
            A simple, secure process to join world-class adventures.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[40px] left-0 right-0 h-0.5 bg-forest/10 -z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 bg-gradient-signature rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  <step.icon size={32} />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                      {idx + 1}
                    </span>
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-foreground-muted font-medium leading-relaxed italic">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
