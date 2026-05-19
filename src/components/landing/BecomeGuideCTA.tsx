import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Users } from "lucide-react";

export default function BecomeGuideCTA() {
  return (
    <section className="container mx-auto px-6 py-32">
      <div className="bg-gradient-mesh rounded-[4rem] overflow-hidden shadow-2xl relative border border-white">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Photo Side */}
          <div className="lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              alt="Guide leading a group"
            />
            <div className="absolute inset-0 bg-gradient-signature/20 hover:bg-transparent transition-all duration-500"></div>
          </div>

          {/* Text Side */}
          <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-signature text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-forest/20"
              >
                Join our expert team
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-foreground leading-[0.9] tracking-tighter uppercase"
              >
                Share your <br /> travel expertise
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-foreground-muted font-medium italic leading-relaxed"
              >
                Lead small groups of like-minded travelers to destinations you know. Apply to become a verified Trip Mate guide and earn doing what you love.
              </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background-soft rounded-2xl flex items-center justify-center text-primary shadow-md border border-border-dim">
                  <Trophy size={24} />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground leading-none">$1,500+</p>
                  <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest opacity-50">Avg. per trip</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background-soft rounded-2xl flex items-center justify-center text-primary shadow-md border border-border-dim">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground leading-none">48+</p>
                  <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest opacity-50">Active guides</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/register?role=guide"
                className="inline-flex items-center gap-6 px-12 py-6 bg-gradient-signature text-white rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Apply to be a Guide <ArrowRight size={24} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
