import { motion } from "motion/react";
import { Shield, Sparkles } from "lucide-react";

export default function Privacy() {
  return (
    <div className="bg-offwhite min-h-screen font-sans pb-32">
      <section className="pt-32 md:pt-48 pb-16 px-6">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest/5 rounded-full mb-8 border border-forest/10">
               <Shield size={14} className="text-forest" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-forest">Legal Framework</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-forest uppercase tracking-tighter leading-none mb-8">Privacy <br/>Policy.</h1>
            <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto italic">Last updated: May 16, 2026. Your data is your territory.</p>
          </motion.div>
        </div>
      </section>

      <section className="px-6">
        <div className="container-wide max-w-4xl bg-white rounded-[3rem] p-10 md:p-20 shadow-sleek border border-sage/10">
          <div className="prose prose-sage max-w-none text-gray-600 font-medium leading-relaxed italic">
            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">1. Information We Collect</h2>
            <p className="mb-8">We collect information that you provide directly to us when you create an account, lead or join a trip, or communicate with us. This includes your name, email, payment information, and any profile details like your travel history.</p>

            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">2. How We Use Your Data</h2>
            <p className="mb-8">Your data is used solely to facilitate the Roamigo experience: verifying guides, processing secure payments, creating group chats, and providing customer support. We do not sell your personal data to advertisers.</p>

            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">3. Data Sharing</h2>
            <p className="mb-8">We share your contact information with other participants of a trip only after a booking is confirmed. Your payment info is handled by secure third-party processors (like Stripe) and is never stored on our servers.</p>

            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">4. Your Rights</h2>
            <p className="mb-8">You have the right to access, update, or delete your data at any time through your settings panel. If you choose to delete your account, all personal identifiers will be scrubbed from our systems within 30 days.</p>

            <h2 className="text-2xl font-heading font-black text-forest uppercase mb-6">5. Cookies</h2>
            <p className="mb-8">We use essential cookies to keep you logged in and functional cookies to improve the user experience. You can manage cookie preferences through your browser settings.</p>

            <div className="mt-16 p-8 bg-offwhite rounded-3xl border border-sage/10">
               <div className="flex items-center gap-4 mb-4">
                  <Sparkles className="text-forest" size={24} />
                  <h4 className="text-lg font-heading font-black text-forest uppercase">TL;DR Version</h4>
               </div>
               <p className="text-sm font-bold text-gray-500 italic">We respect your privacy. We don't spam. We don't sell your info. We only share what's absolutely necessary to make your trip happen safely.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
