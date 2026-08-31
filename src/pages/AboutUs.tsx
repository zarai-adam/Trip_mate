import { motion } from "motion/react";
import { Sparkles, Users, Globe, Shield, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="bg-offwhite min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-16 md:pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20" 
            alt="About us background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest/10 to-offwhite"></div>
        </div>
        
        <div className="container-wide relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest/5 rounded-full mb-8 border border-forest/10">
               <Sparkles size={14} className="text-forest" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-forest">Our story</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-heading font-bold text-forest mb-6 leading-none tracking-tight">We are Roamigo.</h1>
            <p className="text-gray-500 font-medium text-lg md:text-xl max-w-2xl mx-auto italic leading-relaxed">
              Founded by backpackers, for backpackers. We're on a mission to bring authenticity back to travel by connecting you with local experts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-10 md:space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-forest tracking-tight">Why we exist</h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
                In a world of cookie-cutter tours and filtered experiences, true connection is hard to find. We believe the best way to see the world is through the eyes of those who call it home.
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
                Roamigo was born in a dusty common room at Nomads Hostel Tunisia, where our founders realized that the most memorable parts of their journey weren't the monuments, but the people who guided them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                { title: "Empowerment", icon: Users, desc: "We support local economies by giving guides a platform to share their expertise." },
                { title: "Authenticity", icon: Globe, desc: "No scripts, no stages. Just real people and real adventures." },
                { title: "Safety", icon: Shield, desc: "Every guide is verified and every trip is monitored for your peace of mind." },
                { title: "Connection", icon: Heart, desc: "Building bridges across cultures through shared experience." }
              ].map((item) => (
                <div key={item.title} className="p-6 md:p-8 bg-white rounded-3xl shadow-sleek border border-gray-100 group hover:border-sage/30 transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-forest/5 rounded-2xl flex items-center justify-center text-forest mb-6 group-hover:bg-forest group-hover:text-white transition-all">
                    <item.icon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-forest mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0">
             <div className="absolute inset-0 bg-sage/10 rounded-[4rem] md:rounded-[5rem] rotate-3"></div>
             <img 
               src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=1200" 
               className="relative z-10 rounded-[3rem] md:rounded-[4rem] shadow-2xl border-4 md:border-8 border-white w-full"
               alt="Team travel"
             />
             <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-32 h-32 md:w-40 md:h-40 bg-sand rounded-full flex items-center justify-center border-4 md:border-8 border-white shadow-xl z-20">
                <span className="text-forest font-black text-center text-[10px] md:text-xs uppercase leading-tight tracking-widest">Est <br/>2024</span>
             </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32 px-6 bg-white overflow-hidden">
        <div className="container-wide">
          <div className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-heading font-black text-forest mb-6 uppercase tracking-tighter">The Visionaries</h2>
             <p className="text-gray-400 font-medium max-w-xl mx-auto italic">Meet the seekers who decided that connecting people was the ultimate adventure.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { name: "Adem Z.", role: "The Navigator", bio: "Former digital nomad who stayed at 200+ hostels across 4 continents.", img: "https://i.pravatar.cc/150?u=adem" },
              { name: "Sarah L.", role: "Vibe Curator", bio: "Specialist in identifying local gems and building community culture.", img: "https://i.pravatar.cc/150?u=sarah" },
              { name: "Malik T.", role: "Safety Architect", bio: "Ensures every explorer feels secure while pushing their boundaries.", img: "https://i.pravatar.cc/150?u=malik" }
            ].map((member, idx) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[3.5rem] bg-offwhite border border-sage/10 hover:shadow-2xl transition-all"
              >
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <div className="absolute inset-0 bg-sage rounded-[3rem] rotate-6 group-hover:rotate-12 transition-transform"></div>
                  <img src={member.img} className="relative z-10 w-full h-full object-cover rounded-[2.5rem] border-4 border-white grayscale group-hover:grayscale-0 transition-all shadow-xl" alt={member.name} />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-heading font-black text-forest mb-1">{member.name}</h3>
                  <p className="text-sage font-bold text-[10px] uppercase tracking-widest mb-4">{member.role}</p>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed italic">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="container-wide max-w-5xl mx-auto bg-forest rounded-3xl md:rounded-[4rem] p-10 md:p-24 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-heading font-extrabold text-white mb-6 md:mb-8 leading-tight tracking-tight">Ready to write<br/>your story?</h2>
            <p className="text-white/70 text-base md:text-lg mb-8 md:mb-12 font-medium italic">Join our community of verified explorers today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Link to="/register" className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-6 bg-white text-forest rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02]">Join the tribe</Link>
              <Link to="/explore" className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-6 bg-transparent text-white border-2 border-white/20 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-white/10 flex items-center justify-center gap-2 font-heading">Explore Trips <ArrowRight size={18}/></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
