import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Languages, 
  Calendar, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Clock,
  Quote,
  AlertOctagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VerificationBadge from "@/components/VerificationBadge";
import ReportModal from "@/components/ReportModal";
import { apiFetch } from "@/lib/api";
import { PageTransition } from "@/components/ui/PageTransition";
import TripCard from "@/components/TripCard";
import { format } from "date-fns";

export default function GuidePublicProfile() {
  const { id } = useParams();
  const [guide, setGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch(`/api/users/${id}`);
        const data = await res.json();
        setGuide(data);
        
        // Track profile view
        apiFetch("/api/analytics/track", {
          method: "POST",
          body: JSON.stringify({
            type: "PROFILE_VIEW",
            targetId: id,
            metadata: { country: "Visitor" } // In a real app, we might get this from IP/user profile
          })
        });
      } catch (err) {
        console.error("Failed to fetch guide profile", err);
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

  if (!guide) return (
    <div className="pt-32 text-center">
      <h2 className="text-2xl font-bold text-forest">Guide not found</h2>
      <Link to="/guides" className="text-sage font-bold mt-4 inline-block underline">Back to guides</Link>
    </div>
  );

  const tabs = [
    { id: "about", label: "About" },
    { id: "trips", label: `Trips (${guide.tripsLed?.length || 0})` },
    { id: "reviews", label: `Reviews (${guide.totalReviews || 0})` },
    { id: "photos", label: "Photos" }
  ];

  return (
    <PageTransition>
      <div className="bg-white min-h-screen font-sans pb-20">
        {/* Hero Section / Cover Photo */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img 
            src={guide.coverUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200"} 
            alt="Cover"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10 pt-20 md:pt-10">
             <Link to="/guides">
                <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white rounded-xl hover:bg-white/20">
                   Back to Guides
                </Button>
             </Link>
             <div className="flex gap-2">
                <Button className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl flex items-center justify-center p-0">
                   <Share2 size={20} />
                </Button>
                <Button 
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-12 h-12 bg-red-500/20 backdrop-blur-md border border-red-500/20 text-red-500 rounded-xl flex items-center justify-center p-0 hover:bg-red-500/30 transition-all"
                >
                   <AlertOctagon size={20} />
                </Button>
                <Button className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl flex items-center justify-center p-0">
                   <MoreHorizontal size={20} />
                </Button>
             </div>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div className="container-wide relative">
           <div className="flex flex-col md:flex-row items-end gap-6 -mt-24 md:-mt-32 mb-12">
              <div className="relative">
                 <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] border-8 border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-sage/10">
                    <img 
                       src={guide.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${guide.firstName}`} 
                       alt={guide.name}
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                    />
                 </div>
                 {guide.status === "ACTIVE" && (
                   <div className="absolute bottom-4 right-4 bg-forest text-sand w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                      <ShieldCheck size={24} />
                   </div>
                 )}
              </div>

              <div className="flex-1 pb-4 text-center md:text-left">
                 <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                    <h1 className="text-4xl md:text-5xl font-black text-forest tracking-tight">{guide.name}</h1>
                    <VerificationBadge user={guide} size={24} showText />
                 </div>
                 <p className="text-xl md:text-2xl font-serif italic text-gray-500 mb-6 px-4 md:px-0 max-w-2xl">
                    &quot;{guide.tagline || (guide.bio ? guide.bio.substring(0, 50) : "")}...&quot;
                 </p>
                 <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-400 justify-center md:justify-start">
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-sage" /> {guide.country}</div>
                    <div className="flex items-center gap-2 text-forest"><Star size={18} fill="currentColor" className="text-sand" /> {guide.ratingAverage} ({guide.totalReviews} reviews)</div>
                    <div className="flex items-center gap-2"><Calendar size={16} className="text-sage" /> Joined {guide.memberSince ? format(new Date(guide.memberSince), "MMMM yyyy") : "recently"}</div>
                 </div>
              </div>

              <div className="flex gap-4 pb-4">
                 <Button className="h-16 px-10 bg-forest text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-forest/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Book a Consultation
                 </Button>
                 <Link to="/dashboard/messages">
                   <Button variant="outline" className="h-16 w-16 p-0 rounded-2xl border-2 border-forest/10 hover:bg-offwhite transition-all flex items-center justify-center">
                      <MessageCircle size={24} className="text-forest" />
                   </Button>
                 </Link>
              </div>
           </div>

           {/* Stats Row */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {[
                { label: "Response Rate", value: `${guide.responseRate || 100}%`, icon: <TrendingUp size={20} />, color: "bg-sage/10 text-sage" },
                { label: "Response Time", value: guide.responseTime || "within an hour", icon: <Clock size={20} />, color: "bg-sand text-forest" },
                { label: "Trips Led", value: guide.tripsLed?.length || 0, icon: <Globe size={20} />, color: "bg-forest/5 text-forest" },
                { label: "Happy Travelers", value: guide.totalReviews * 4 + 10, icon: <Heart size={20} />, color: "bg-sage/10 text-sage" },
              ].map((stat, idx) => (
                <div key={idx} className="bg-offwhite/50 p-6 rounded-3xl border border-sage/10 flex items-center gap-4">
                   <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                      {stat.icon}
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{stat.label}</div>
                      <div className="text-lg font-black text-forest">{stat.value}</div>
                   </div>
                </div>
              ))}
           </div>

           {/* Tabs and Content */}
           <div className="border-b border-sage/10 mb-12 overflow-x-auto no-scrollbar">
              <div className="flex gap-12">
                 {tabs.map((tab) => (
                   <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-6 text-sm font-black uppercase tracking-widest transition-all relative ${
                      activeTab === tab.id ? "text-forest" : "text-gray-400 hover:text-forest"
                    }`}
                   >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTabProfile"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-forest rounded-full"
                        />
                      )}
                   </button>
                 ))}
              </div>
           </div>

           <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                 {activeTab === "about" && (
                   <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-16"
                   >
                      <div className="lg:col-span-2 space-y-12">
                         <section>
                            <h3 className="text-3xl font-black text-forest mb-6">About the Guide</h3>
                            <div className="prose prose-forest max-w-none">
                               <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                  {guide.bio || "No biography provided."}
                               </p>
                            </div>
                         </section>

                         <section className="bg-sand p-10 rounded-[3rem] border border-forest/5 relative overflow-hidden">
                             <Quote size={80} className="absolute -top-4 -left-4 text-forest/5" />
                             <h4 className="text-xl font-black text-forest mb-6 flex items-center gap-3">
                                Travel Philosophy
                             </h4>
                             <p className="text-2xl font-serif italic text-forest leading-relaxed">
                                {guide.travelPhilosophy || "Exploration is the ultimate education."}
                             </p>
                         </section>

                         <section>
                             <h3 className="text-2xl font-black text-forest mb-6">World Footprint</h3>
                             <div className="bg-offwhite p-10 rounded-[3rem] border border-sage/10">
                                <div className="flex items-center gap-6 mb-8 flex-wrap">
                                   <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-sm border border-sage/10 text-forest font-bold">
                                      <Globe size={18} className="text-sage" /> {guide.countriesVisited?.length || 0} Countries Visited
                                   </div>
                                   <div className="flex flex-wrap gap-2">
                                      {guide.countriesVisited?.map((c: string) => (
                                        <span key={c} className="px-4 py-1.5 bg-forest/5 text-forest rounded-full text-xs font-bold border border-forest/10">{c}</span>
                                      ))}
                                   </div>
                                </div>
                                {/* Simple SVG Illustration for Map */}
                                <div className="aspect-video bg-white/50 rounded-2xl flex items-center justify-center border border-sage/20 relative overflow-hidden group">
                                   <Globe size={120} className="text-sage/30 group-hover:scale-110 transition-transform duration-1000" />
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="text-center">
                                         <div className="text-4xl font-black text-forest/20 uppercase tracking-[0.3em]">Mapping Adventure</div>
                                         <p className="text-[10px] font-bold text-gray-300 mt-2">Interactive regional history coming soon</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                         </section>
                      </div>

                      <div className="space-y-12">
                         <section>
                            <h4 className="text-lg font-black text-forest mb-6 uppercase tracking-widest">Specialties</h4>
                            <div className="flex flex-wrap gap-3">
                               {guide.specialties?.map((spec: string, i: number) => {
                                 const colors = ["bg-forest text-sand", "bg-sand text-forest", "bg-sage text-white", "bg-black text-white"];
                                 return (
                                   <span key={spec} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-forest/5 shadow-sm transform hover:-translate-y-1 transition-all ${colors[i % colors.length]}`}>
                                      {spec}
                                   </span>
                                 )
                               })}
                            </div>
                         </section>

                         <section>
                            <h4 className="text-lg font-black text-forest mb-6 uppercase tracking-widest">Languages Spoken</h4>
                            <div className="space-y-4">
                               {guide.languages?.map((lang: string) => (
                                 <div key={lang} className="flex items-center justify-between p-4 bg-offwhite/50 rounded-2xl border border-sage/10">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 bg-forest/10 rounded-lg flex items-center justify-center">
                                          <Languages size={16} className="text-forest" />
                                       </div>
                                       <span className="font-bold text-gray-600">{lang}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-sage uppercase tracking-widest">Native / Fluent</span>
                                 </div>
                               ))}
                            </div>
                         </section>
                      </div>
                   </motion.div>
                 )}

                 {activeTab === "trips" && (
                   <motion.div
                    key="trips"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                   >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {guide.tripsLed?.length > 0 ? guide.tripsLed.map((trip: any, idx: number) => (
                           <TripCard 
                            key={trip.id} 
                            trip={{
                              ...trip,
                              price: Number(trip.pricePerPerson),
                              guide: { name: guide.name, avatar: guide.avatarUrl }
                            }} 
                            index={idx} 
                           />
                         )) : (
                            <div className="col-span-full py-20 text-center bg-offwhite rounded-[3rem] border-2 border-dashed border-sage/20">
                               < Globe size={64} className="mx-auto text-sage/40 mb-6" />
                               <h4 className="text-2xl font-black text-forest mb-2">No active trips yet</h4>
                               <p className="text-gray-400 font-medium italic">Check back soon for new adventures.</p>
                            </div>
                         )}
                      </div>
                   </motion.div>
                 )}

                 {activeTab === "reviews" && (
                   <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8 max-w-4xl"
                   >
                       <div className="flex items-center justify-between mb-8">
                          <h3 className="text-3xl font-black text-forest">What travelers say</h3>
                          <div className="flex items-center gap-1 font-black text-xl text-forest">
                             <Star size={24} fill="currentColor" className="text-sand" /> 4.9 <span className="text-gray-300 text-sm font-medium ml-2">Total rating</span>
                          </div>
                       </div>

                       {guide.reviewsReceived?.length > 0 ? guide.reviewsReceived.map((review: any) => (
                          <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-sage/10 shadow-sleek flex flex-col md:flex-row gap-8">
                             <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-2xl bg-forest/5 flex items-center justify-center font-black text-forest text-xl border border-forest/10 overflow-hidden">
                                   {review.reviewer.avatarUrl ? (
                                      <img src={review.reviewer.avatarUrl} alt="" className="w-full h-full object-cover" />
                                   ) : (
                                      review.reviewer.firstName[0]
                                   )}
                                </div>
                             </div>
                             <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                   <div>
                                      <div className="font-black text-forest text-lg">
                                         {review.reviewer.firstName} {review.reviewer.lastName}
                                      </div>
                                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                         Verified Traveler <ChevronRight size={10} /> {review.trip.title}
                                      </div>
                                   </div>
                                   <div className="flex text-sand">
                                      {[...Array(5)].map((_, i) => (
                                         <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                                      ))}
                                   </div>
                                </div>
                                <p className="text-gray-500 font-medium leading-relaxed italic mb-4">
                                   &quot;{review.comment}&quot;
                                </p>
                                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                   Reviewed on {format(new Date(review.createdAt), "MMM d, yyyy")}
                                </div>
                             </div>
                          </div>
                       )) : (
                          <div className="py-20 text-center bg-offwhite rounded-[3rem] border-2 border-dashed border-sage/20">
                             < Star size={64} className="mx-auto text-sage/40 mb-6" />
                             <h4 className="text-2xl font-black text-forest mb-2">No reviews yet</h4>
                             <p className="text-gray-400 font-medium italic">Be the first to review this guide!</p>
                          </div>
                       )}
                   </motion.div>
                 )}

                 {activeTab === "photos" && (
                   <motion.div
                    key="photos"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                   >
                      {[
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
                        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
                        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
                        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
                        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
                        "https://images.unsplash.com/photo-1433086566207-c58a8348ee7c",
                        "https://images.unsplash.com/photo-1501854140801-50d01698950b"
                      ].map((url, i) => (
                        <div key={i} className="aspect-square rounded-3xl overflow-hidden group cursor-pointer relative shadow-md">
                           <img 
                              src={`${url}?auto=format&fit=crop&q=80&w=400`} 
                              alt="" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                              referrerPolicy="no-referrer"
                           />
                           <div className="absolute inset-0 bg-forest/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Share2 className="text-white" />
                           </div>
                        </div>
                      ))}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        targetType="USER"
        targetId={guide.id}
        targetName={guide.name}
      />
    </PageTransition>
  );
}
