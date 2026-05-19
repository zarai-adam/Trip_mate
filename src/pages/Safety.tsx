import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Users, 
  PhoneCall, 
  AlertTriangle, 
  HeartHandshake, 
  FileCheck,
  ArrowRight,
  ShieldAlert,
  Zap,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SafetyPage() {
  const sections = [
    {
      title: "How We Verify Guides",
      icon: <ShieldCheck className="text-forest" />,
      content: "Every guide on our platform goes through a multi-step verification process including identity checks, experience validation, and an interview process. We prioritize local expertise and safety certifications.",
      color: "bg-sage/10"
    },
    {
      title: "Community Guidelines",
      icon: <Users className="text-sage" />,
      content: "Respect, inclusivity, and sustainability are at our core. We have zero tolerance for harassment, discrimination, or activities that harm local ecosystems and cultures.",
      color: "bg-forest/5"
    },
    {
      title: "Emergency Contacts",
      icon: <PhoneCall className="text-forest" />,
      content: "Our 24/7 support line is available for active trips. We also provide local emergency numbers for every destination in your trip details.",
      color: "bg-sage/10"
    },
    {
      title: "Insurance Requirements",
      icon: <HeartHandshake className="text-sage" />,
      content: "We strongly recommend all travelers to have comprehensive travel insurance. Guides are required to provide their own liability insurance for organized activities.",
      color: "bg-forest/5"
    }
  ];

  return (
    <div className="min-h-screen bg-offwhite pb-20">
      {/* Hero */}
      <section className="bg-forest pt-32 pb-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={14} className="text-sand" /> Your Safety is Our Priority
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Travel with <span className="text-sand italic text-6xl md:text-8xl">Confidence.</span></h1>
            <p className="text-xl text-white/80 font-medium leading-relaxed mb-10">
              We've built the world's most rigorous verification system for outdoor guides so you can focus on the adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((s, idx) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`${s.color} p-10 rounded-[3rem] border border-forest/5 shadow-sleek group hover:bg-white transition-all duration-500`}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="text-2xl font-black text-forest mb-4">{s.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed leading-relaxed">{s.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Reporting Section */}
        <section className="mt-20 bg-white rounded-[4rem] p-12 md:p-20 shadow-sleek border border-sage/10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-black text-forest tracking-tight">Reporting & Moderation</h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                Notice something not right? Our moderation team reviews every report within 24 hours. We take proactive steps to maintain the integrity of our community.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                      <AlertTriangle size={20} />
                   </div>
                   <div>
                      <h4 className="font-black text-forest">Zero Tolerance</h4>
                      <p className="text-gray-400 text-sm font-medium italic">Instant suspension for misleading profiles or safety violations.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center text-sage shrink-0">
                      <Zap size={20} />
                   </div>
                   <div>
                      <h4 className="font-black text-forest">Rapid AI Analysis</h4>
                      <p className="text-gray-400 text-sm font-medium italic">We use AI to monitor messages for scams and inappropriate content.</p>
                   </div>
                </div>
              </div>
              <div className="pt-6">
                <button className="bg-forest text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl flex items-center gap-3">
                   Submit a Report <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
               <div className="relative w-full max-w-sm aspect-square bg-offwhite rounded-[4rem] flex items-center justify-center overflow-hidden border border-sage/10">
                  <ShieldCheck size={200} className="text-forest/5 absolute -right-10 -bottom-10" />
                  <div className="relative z-10 text-center p-8">
                     <ShieldAlert size={80} className="mx-auto text-forest mb-6" />
                     <h3 className="text-2xl font-black text-forest mb-2">SafeTravel Guarantee</h3>
                     <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-6">Terms & Conditions Apply</p>
                     <div className="h-px w-20 bg-forest/10 mx-auto mb-6"></div>
                     <p className="text-gray-600 text-sm font-medium leading-relaxed italic">
                        &quot;Our mission is to make the world&apos;s wildest places accessible through safe, verified human connections.&quot;
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Global Policy Footer */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-3xl border border-forest/5 text-center">
              <Globe className="mx-auto text-sage mb-4" />
              <h5 className="font-black text-forest text-sm">International Standards</h5>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Global Safety Compliance</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-forest/5 text-center">
              <FileCheck className="mx-auto text-sage mb-4" />
              <h5 className="font-black text-forest text-sm">Clear Refund Policy</h5>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Fairness For All</p>
           </div>
           <div className="bg-white p-6 rounded-3xl border border-forest/5 text-center">
              <HeartHandshake className="mx-auto text-sage mb-4" />
              <h5 className="font-black text-forest text-sm">Explorer Protection</h5>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">24/7 Assisted Support</p>
           </div>
        </div>
      </div>
    </div>
  );
}
