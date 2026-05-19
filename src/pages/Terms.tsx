import { motion } from "motion/react";
import { Scale, Sparkles } from "lucide-react";

export default function Terms() {
  return (
    <div className="bg-offwhite min-h-screen font-sans pb-32">
      <section className="pt-32 md:pt-48 pb-16 px-6">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest/5 rounded-full mb-8 border border-forest/10">
               <Scale size={14} className="text-forest" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-forest">Community Rules</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-forest uppercase tracking-tighter leading-none mb-8">Terms of <br/>Service.</h1>
            <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto italic">Last updated: May 16, 2026. The traveler's code.</p>
          </motion.div>
        </div>
      </section>

      <section className="px-6">
        <div className="container-wide max-w-4xl bg-white rounded-[3rem] p-10 md:p-20 shadow-sleek border border-sage/10">
          <div className="prose prose-sage max-w-none text-gray-600 font-medium leading-relaxed italic">
            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">1. Acceptance of Terms</h2>
            <p className="mb-8">By creating an account on Trip Mate, you agree to respect our community guidelines and legal terms. We are a platform for adults (18+) unless explicitly specified in family-oriented trips.</p>

            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">2. Guide Responsibilities</h2>
            <p className="mb-8">Guides are responsible for the accuracy of their itineraries and the safety of their groups. Providing false information or engaging in illegal activities will result in immediate permanent ban and reported to authorities.</p>

            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">3. Explorer Behavior</h2>
            <p className="mb-8">Explorers must respect the local cultures, follow the guide's safety instructions, and treat fellow travelers with dignity. Harassment or disruptive behavior is grounds for removal from a trip without refund.</p>

            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">4. Payments and Refunds</h2>
            <p className="mb-8">All financial transactions must happen through the platform. Side-payments are strictly prohibited for safety and verification reasons. Refund eligibility is determined by the policy selected by the guide at the time of posting.</p>

            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">5. Platform Liability</h2>
            <p className="mb-8">Trip Mate is a facilitator of connections. While we verify identities and monitor trips, we are not responsible for the inherent risks of travel, changes in local conditions, or personal disputes between travelers.</p>

            <div className="mt-16 p-8 bg-forest text-white rounded-3xl shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                  <Sparkles className="text-sand" size={24} />
                  <h4 className="text-lg font-heading font-black text-sand uppercase">The Essence</h4>
               </div>
               <p className="text-sm font-bold opacity-80 italic italic">Be real. Be respectful. Be safe. Don't be the person who ruins the vibe for everyone else. Use common sense, and let's explore.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
