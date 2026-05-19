import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  MapPin, 
  Calendar, 
  Star, 
  Globe, 
  User,
  Quote,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { PageTransition } from "@/components/ui/PageTransition";
import { format } from "date-fns";

export default function ExplorerPublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch(`/api/users/${id}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch explorer profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="pt-32 flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
    </div>
  );

  if (!profile) return (
    <div className="pt-32 text-center">
      <h2 className="text-2xl font-bold text-forest">Explorer not found</h2>
      <Link to="/" className="text-sage font-bold mt-4 inline-block underline">Back Home</Link>
    </div>
  );

  return (
    <PageTransition>
      <div className="bg-[var(--color-bg-primary)] min-h-screen font-sans pb-20">
        <div className="pt-32 container-tight">
           {/* Profile Card */}
           <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-sleek border border-sage/10 overflow-hidden">
              {/* Header */}
              <div className="h-32 bg-forest relative">
                 <div className="absolute -bottom-16 left-12">
                    <div className="w-32 h-32 rounded-3xl border-8 border-white dark:border-gray-800 bg-sage/10 overflow-hidden shadow-2xl">
                       <img 
                          src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.firstName}`} 
                          alt={profile.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-20 pb-12 px-12">
                 <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                    <div>
                       <h1 className="text-4xl font-black text-forest dark:text-white mb-2">{profile.name}</h1>
                       <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-400">
                          <div className="flex items-center gap-2"><MapPin size={16} className="text-sage" /> {profile.country || "Global Explorer"}</div>
                          <div className="flex items-center gap-2"><Calendar size={16} className="text-sage" /> Joined {format(new Date(profile.memberSince), "MMM yyyy")}</div>
                          <div className="flex items-center gap-2"><User size={16} className="text-sage" /> {profile.role}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 bg-offwhite p-4 rounded-2xl border border-sage/10">
                       <div className="text-center px-4 border-r border-sage/20">
                          <div className="text-2xl font-black text-forest">{profile.ratingAverage || "N/A"}</div>
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Traveler Rating</div>
                       </div>
                       <div className="text-center px-4">
                          <div className="text-2xl font-black text-forest">{profile.totalReviews || 0}</div>
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Reviews</div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-12">
                       <section>
                          <h3 className="text-xl font-black text-forest dark:text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
                            <ShieldCheck size={20} className="text-sage" /> Explorer Bio
                          </h3>
                          <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                             &quot;{profile.bio || "This explorer prefers to let their adventures do the talking."}&quot;
                          </p>
                       </section>

                       <section>
                          <h3 className="text-xl font-black text-forest dark:text-white mb-6 uppercase tracking-widest">Interests & Tribes</h3>
                          <div className="flex flex-wrap gap-2">
                             {(profile.specialties?.length ? profile.specialties : ["Culture", "Nature", "Solo Travel"]).map((spec: string) => (
                               <span key={spec} className="px-6 py-2.5 bg-forest/5 text-forest rounded-xl text-xs font-bold border border-forest/10">
                                  {spec}
                               </span>
                             ))}
                          </div>
                       </section>

                       <section>
                          <h3 className="text-xl font-black text-forest dark:text-white mb-6 uppercase tracking-widest">Recent Travels</h3>
                          <div className="space-y-4">
                             {[
                               { id: "1", dest: "Machu Picchu, Peru", date: "Jan 2026", guide: "Sarah Chen" },
                               { id: "2", dest: "Tuscany, Italy", date: "Oct 2025", guide: "Marco Rossi" }
                             ].map(trip => (
                               <div key={trip.id} className="flex items-center justify-between p-6 bg-offwhite/50 rounded-2xl border border-sage/10 border-l-4 border-l-forest hover:bg-white transition-all shadow-sm group">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sage shadow-inner">
                                        <MapPin size={20} />
                                     </div>
                                     <div>
                                        <div className="font-bold text-forest group-hover:text-forest transition-colors">{trip.dest}</div>
                                        <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Explored with {trip.guide}</div>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <div className="text-[10px] font-bold text-forest mb-1">{trip.date}</div>
                                     <ChevronRight size={16} className="text-gray-300 ml-auto" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </section>
                    </div>

                    <div className="space-y-12">
                       <section className="bg-sand/30 p-8 rounded-[2.5rem] border border-forest/5 shadow-inner">
                          <Quote size={40} className="text-forest/10 mb-4" />
                          <h4 className="text-sm font-black text-forest mb-4 uppercase tracking-widest">Travel Motto</h4>
                          <p className="text-lg font-serif italic text-forest/80 leading-relaxed">
                             &quot;The world is a book and those who do not travel read only one page.&quot;
                          </p>
                       </section>

                       <section>
                          <h4 className="text-sm font-black text-forest mb-6 uppercase tracking-widest">Visited Regions</h4>
                          <div className="flex items-center gap-2 p-6 bg-white rounded-3xl border border-sage/10 shadow-sm">
                             <Globe size={40} className="text-sage/20" />
                             <div>
                                <div className="text-xl font-black text-forest">{profile.countriesVisited?.length || 5}</div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Countries Explored</div>
                             </div>
                          </div>
                       </section>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PageTransition>
  );
}
