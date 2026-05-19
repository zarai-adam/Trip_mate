import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  UserPlus, 
  CreditCard, 
  Plane, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle,
  Users,
  Backpack,
  Map,
  Star,
  ChevronDown,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'guide'>('explorer');

  const explorerSteps = [
    {
      title: "Discover your tribe",
      desc: "Browse authentic trips led by verified expert travelers. Filter by destination, budget, or adventure type.",
      icon: <Search className="text-sage" size={32} />
    },
    {
      title: "Request to join",
      desc: "Find a trip you love? Send a request to join. Introduce yourself to the guide and share why you're excited.",
      icon: <UserPlus className="text-sage" size={32} />
    },
    {
      title: "Connect & Book",
      desc: "Once approved, chat with your tribe in our group chat. Secure your spot with a safe, escrowed payment.",
      icon: <CreditCard className="text-sage" size={32} />
    },
    {
      title: "Travel Authentically",
      desc: "Meet your guide and group at the destination. Skip the tourist traps and experience life like a local.",
      icon: <Plane className="text-sage" size={32} />
    }
  ];

  const guideSteps = [
    {
       title: "Build your itinerary",
       desc: "Use our easy trip builder to outline your adventure, set your price, and describe the experience. Share your passion.",
       icon: <Map className="text-forest" size={32} />
    },
    {
       title: "Review participants",
       desc: "Select the travelers who fit your group's vibe. You have full control over who joins your circle.",
       icon: <CheckCircle className="text-forest" size={32} />
    },
    {
       title: "Connect via Chat",
       desc: "Automatic group chats are created for each trip. Coordinate gear, meetings, and build excitement.",
       icon: <MessageCircle className="text-forest" size={32} />
    },
    {
       title: "Get paid safely",
       desc: "No more chasing cash. We handle the payments securely and deposit them after the trip starts.",
       icon: <CreditCard className="text-forest" size={32} />
    }
  ];

  const faqs = [
    { q: "Is my payment safe?", a: "Yes. All payments are held in escrow. The guide only receives the funds after the trip has officially started and you are on the ground." },
    { q: "How do you verify guides?", a: "Guides go through a multi-stage verification including ID checks, travel history review, and a personal interview for premium tiers." },
    { q: "What if a trip is cancelled?", a: "If a guide cancels, you get a 100% refund immediately. If you cancel, the refund depends on the guide's specific policy (Flexible/Moderate/Strict)." },
    { q: "Can I message a guide before booking?", a: "Absolutely! You can send an inquiry or message the guide directly from the trip page to ask any questions." },
    { q: "Are flights included?", a: "Usually no. Trip Mate focuses on the on-ground experience led by locals. You are responsible for your own transport to the meeting point." },
    { q: "Is there an age limit?", a: "Most trips are 18+, but some family-friendly trips are available. Each guide sets their own age requirements." },
    { q: "What is the community fee?", a: "We charge a small platform fee (typically 10-15%) to cover insurance, secure payment processing, and 24/7 support." },
    { q: "Can I lead my own trip?", a: "Yes! If you have local expertise or a deep knowledge of a destination, you can apply to become a guide." },
    { q: "What happens if I'm not happy with a trip?", a: "We have a dispute resolution process. If the experience significantly differs from the description, we will mediate a refund." },
    { q: "Is insurance included?", a: "We recommend all travelers have their own travel insurance. Some premium trips include basic local coverage." }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-forest pt-32 md:pt-48 pb-20 md:pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-10"></div>
        <div className="container-wide text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 tracking-tight leading-tight">Travel with friends <br/><span className="text-sand">you haven&apos;t met yet.</span></h1>
            <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed italic">
              TripMate is a peer-to-peer marketplace that cuts out the middlemen and connects real travelers for authentic adventures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Tabs Selection */}
      <section className="py-20 px-4">
        <div className="container-wide">
          <div className="flex justify-center mb-16">
            <div className="inline-flex p-2 bg-offwhite rounded-[2.5rem] border border-sage/10 shadow-inner">
               <button 
                onClick={() => setActiveTab('explorer')}
                className={`px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'explorer' ? 'bg-forest text-white shadow-xl' : 'text-forest/40 hover:text-forest'}`}
               >
                 For Explorers
               </button>
               <button 
                onClick={() => setActiveTab('guide')}
                className={`px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'guide' ? 'bg-sage text-white shadow-xl' : 'text-forest/40 hover:text-forest'}`}
               >
                 For Guides
               </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'explorer' ? (
              <motion.div 
                key="explorer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {explorerSteps.map((step, idx) => (
                  <div key={step.title} className="flex flex-col items-center text-center p-8 bg-offwhite rounded-[2.5rem] border border-sage/10 hover:shadow-sleek transition-all snap-start">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-8">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-forest mb-4">{step.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                    <div className="mt-6 text-sage font-bold text-4xl opacity-20">{idx + 1}</div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="guide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {guideSteps.map((step, idx) => (
                  <div key={step.title} className="flex flex-col items-center text-center p-8 bg-sage/5 rounded-[2.5rem] border border-sage/10 hover:shadow-sleek transition-all">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-8">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-forest mb-4">{step.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                    <div className="mt-6 text-forest font-bold text-4xl opacity-20">{idx + 1}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 px-4 bg-offwhite">
        <div className="container-wide max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-forest mb-6 uppercase tracking-tighter">Common Inquiries</h2>
            <p className="text-gray-400 font-medium italic">Everything you need to know before the venture.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto bg-forest rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-sage/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
              <div className="space-y-8">
                 <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Why Trip Mate?</h2>
                 <p className="text-white/70 text-xl font-medium leading-relaxed italic">
                   We built this for the backpackers who want real connection, not just a sightseeing tour. We removed the agencies, simplified the safety, and focused on the people.
                 </p>
                 <div className="flex gap-4">
                    <div className="text-center p-6 bg-white/5 rounded-3xl flex-1 border border-white/10">
                       <div className="text-3xl font-black text-sand mb-2">30-40%</div>
                       <div className="text-[10px] uppercase font-black tracking-widest text-white/50">Cheaper than agencies</div>
                    </div>
                    <div className="text-center p-6 bg-white/5 rounded-3xl flex-1 border border-white/10">
                       <div className="text-3xl font-black text-sand mb-2">100%</div>
                       <div className="text-[10px] uppercase font-black tracking-widest text-white/50">Peer-to-Peer Verified</div>
                    </div>
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex gap-6 items-start">
                    <div className="w-12 h-12 bg-red-400/20 rounded-2xl flex items-center justify-center text-red-300 shrink-0">
                       <Backpack size={24} />
                    </div>
                    <div>
                       <h4 className="text-xl font-black mb-2 uppercase tracking-tighter">Typical Tour Agency</h4>
                       <p className="text-white/60 text-sm font-medium leading-relaxed">Overpriced hidden fees. Large, anonymous groups. Corporate itineraries with tourist traps. Zero-connection with guides.</p>
                    </div>
                 </div>
                 <div className="p-8 bg-white/10 rounded-[2rem] border border-sage/30 flex gap-6 items-start shadow-2xl scale-105">
                    <div className="w-12 h-12 bg-sage rounded-2xl flex items-center justify-center text-white shrink-0">
                       <Users size={24} />
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-sand mb-2 uppercase tracking-tighter">Trip Mate Way</h4>
                       <p className="text-white/80 text-sm font-medium leading-relaxed font-heading">Real-world prices. Small circles of like-minded travelers. Authentic local secret spots. Direct friendship with expert travelers.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
         <h2 className="text-4xl md:text-6xl font-black text-forest mb-10">Stop dreaming, <br/>start wandering.</h2>
         <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="bg-forest text-white px-12 h-16 rounded-full font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-forest/20 flex items-center justify-center">
              Create an account
            </Link>
            <Link to="/explore" className="bg-white text-forest border border-sage/20 px-12 h-16 rounded-full font-black text-xl hover:bg-offwhite transition-all flex items-center justify-center shadow-sm">
              Browse trip gallery
            </Link>
         </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-[2rem] border border-sage/10 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-bold text-forest group-hover:text-sage transition-colors">{question}</span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="text-forest/30" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-6 text-gray-500 font-medium leading-relaxed italic"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
