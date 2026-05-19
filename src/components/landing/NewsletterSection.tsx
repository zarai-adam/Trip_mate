import { motion } from "motion/react";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-32 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-signature rounded-[4rem] p-12 md:p-24 relative overflow-hidden text-center shadow-2xl shadow-forest/20">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
          
          <div className="max-w-3xl mx-auto relative z-10 space-y-12">
            <div className="space-y-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter uppercase"
              >
                Join 3,000+ backpackers <br /> in our community
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/70 font-medium italic"
              >
                Get trip alerts, travel tips, and hidden gem destinations directly to your inbox.
              </motion.p>
            </div>

            {subscribed ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center text-forest">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight">You're in the inner circle!</h4>
                  <p className="text-white/60 font-medium italic">Welcome to the Tribe.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit}
                className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-4"
              >
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  required
                  className="flex-1 h-18 bg-white/10 border-2 border-white/20 rounded-3xl px-8 text-white font-bold placeholder:text-white/30 focus:border-white transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="h-18 px-8 bg-white text-forest rounded-3xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center justify-center gap-3 shrink-0"
                >
                  Subscribe <Send size={18} />
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
