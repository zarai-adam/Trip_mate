import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Check, 
  X, 
  ArrowLeft, 
  MessageCircle, 
  Share2, 
  Heart,
  Clock,
  Zap,
  Shield,
  Backpack,
  Map as MapIcon,
  Users as UsersIcon,
  ChevronDown,
  ChevronRight,
  Info,
  HelpCircle,
  TrendingUp,
  Award,
  ChevronLeft,
  AlertOctagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VerificationBadge from "@/components/VerificationBadge";
import ReportModal from "@/components/ReportModal";
import { useChat } from "@/context/ChatContext";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin 
} from "@vis.gl/react-google-maps";
import { apiFetch } from "@/lib/api";
import { format } from "date-fns";
import SEO from "@/components/SEO";

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY !== "";

const MOCK_REVIEWS = [
  { id: "r1", user: "Sarah L.", rating: 5, date: "Oct 2025", comment: "Absolutely incredible experience! Malik is a true legend and knows the desert like the back of his hand. The starlit drums session was the highlight of my year.", avatar: "SL" },
  { id: "r2", user: "James W.", rating: 5, date: "Sep 2025", comment: "The dunes are mesmerizing. This trip was well-organized and felt very authentic. Highly recommend for anyone looking for a real adventure.", avatar: "JW" },
  { id: "r3", user: "Elena M.", rating: 4, date: "Aug 2025", comment: "Great trip, though the hike on day 2 was a bit tougher than expected. Malik was very patient and encouraging!", avatar: "EM" },
  { id: "r4", user: "Mark T.", rating: 5, date: "July 2025", comment: "The food was surprisingly good for a desert camp. Tajine under the stars is something I will never forget.", avatar: "MT" }
];

const MOCK_TRIP = {
  id: "1",
  title: "Sahara Sunset & Starlit Dunes Exploration",
  destination: "Merzouga, Morocco",
  price: 1200,
  days: 5,
  difficulty: "Moderate",
  maxParticipants: 8,
  participantsCount: 5,
  rating: 4.9,
  reviewsCount: 128,
  type: "Desert Expedition",
  language: "English, Arabic, French",
  meetingPoint: "Marrakesh Main Square (Djemaa el-Fna)",
  guide: {
    name: "Malik",
    rating: 4.9,
    trips: 42,
    avatar: "M",
    bio: "Passionate nomad with 10 years experience exploring the Sahara. I know the secret spots where the stars are brightest.",
    responseRate: "98%",
    responseTime: "within 2 hours",
    joined: "2021"
  },
  images: [
    "https://images.unsplash.com/photo-1489493585343-b99d86028ca1?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=1200"
  ],
  specialties: [
    "Authentic Berber camp experience away from crowds",
    "Nightly sandboarding session on the highest dunes",
    "Professional stargazing equipment and astronomy talk",
    "Traditional live Gnaoua music around the campfire"
  ],
  itinerary: [
    { 
      day: 1, 
      title: "Marrakesh to High Atlas Gateway", 
      desc: "Leave the hustle of Marrakesh behind as we climb the curves of the Tizi n'Tichka pass. We'll explore the ancient Ait Benhaddou kasbah—a UNESCO site seen in Hollywood films.",
      activities: ["Scenic drive through Atlas Mountains", "Guided tour of Ait Benhaddou", "Traditional lunch in Telouet"],
      schedule: { morning: "Mountain drive", afternoon: "Kasbah tour", evening: "Dinner in Ouarzazate" }
    },
    { 
      day: 2, 
      title: "Dades Gorges to the Golden Dunes", 
      desc: "Wind through the dramatic Todra Gorges before the landscape shifts to soft sand. We reach Merzouga as the sun starts its descent.",
      activities: ["Hike in Todra Gorge", "Fossil workshop visit", "Arrival at Merzouga edge"],
      schedule: { morning: "Gorge hike", afternoon: "Desert drive", evening: "First sunset on dunes" }
    },
    { 
      day: 3, 
      title: "Deep Sahara Immersion", 
      desc: "A full day where time stands still. We trek by camel into the sea of sand, reaching our private camp nestled between giant dunes.",
      activities: ["3-hour camel trek", "Sandboarding session", "Astronomy & drums under the stars"],
      schedule: { morning: "Camel trek initiation", afternoon: "Sandboarding & relaxation", evening: "Stargazing workshop" }
    },
    { 
      day: 4, 
      title: "Nomads & Oasis Shadows", 
      desc: "Visit a 'Khamlia' village to hear Gnaoua musicians and share tea with a nomad family to understand their ancient desert survival skills.",
      activities: ["Gnaoua music performance", "Tea with Berber nomad family", "Desert garden tour"],
      schedule: { morning: "Nomad visit", afternoon: "Khamlia village visit", evening: "Farewell desert party" }
    },
    { 
      day: 5, 
      title: "Sunrise & Return Passage", 
      desc: "One last sunrise from the highest dune before our return journey. We'll stop in the 'Valley of Roses' on our way back to Marrakesh.",
      activities: ["Sunrise dune climb", "Valley of Roses stop", "Arrival in Marrakesh"],
      schedule: { morning: "Sunrise climb", afternoon: "Scenic return drive", evening: "Final arrival" }
    }
  ],
  included: ["Private 4x4 transport", "2 nights in boutique riads", "2 nights in luxury desert camp", "All breakfasts & dinners", "Expert multilingual guide", "Camel trekking gear"],
  notIncluded: ["Lunches (approx $15/day)", "Tips for local staff", "Travel insurance", "Personal expenses"],
  meetingInfo: "We meet at the 'Cafe de France' terrace in Djemaa el-Fna at 8:00 AM. Look for the 'Tribe Guides' sign.",
  packingList: ["Light linen clothing", "Warm fleece for nights", "Sunscreen (SPF 50+)", "Comfortable walking shoes", "Portable power bank"],
  ratingBreakdown: {
    5: 85,
    4: 10,
    3: 3,
    2: 1,
    1: 1
  },
  qAndA: [
    { q: "Is electricity available in the camp?", a: "Yes, our luxury camp has solar power for charging devices and lighting, though we encourage unplugging!" },
    { q: "How much walking is involved?", a: "The most active parts are the 2-hour gorge hike and the dune climbs. A moderate fitness level is recommended." }
  ]
};

const SIMILAR_TRIPS = [
  { id: "2", title: "Atlas Mountain Ridge Trek", price: 850, image: "https://images.unsplash.com/photo-1549488344-cbb6c34ce08b?auto=format&fit=crop&q=80&w=400", destination: "High Atlas" },
  { id: "3", title: "Chefchaouen Blue City Escape", price: 550, image: "https://images.unsplash.com/photo-1548029960-695d127f4543?auto=format&fit=crop&q=80&w=400", destination: "Chefchaouen" },
  { id: "4", title: "Atlantic Coast Surf Camp", price: 920, image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=400", destination: "Essaouira" }
];

function PhotoModal({ images, isOpen, onClose }: { images: string[], isOpen: boolean, onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
      >
        <X size={40} />
      </button>
      
      <div className="relative w-full max-w-6xl px-12 aspect-video">
        <img 
          src={images[currentIndex]} 
          className="w-full h-full object-contain" 
          alt={`Gallery ${currentIndex}`} 
          referrerPolicy="no-referrer"
        />
        
        <button 
          onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft size={48} />
        </button>
        
        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors"
        >
          <ChevronRight size={48} />
        </button>
      </div>
      
      <div className="mt-8 text-white/60 font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
}

function ItineraryItem({ item }: { item: typeof MOCK_TRIP.itinerary[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-start gap-6 text-left group"
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${isOpen ? 'bg-forest text-white' : 'bg-forest/5 text-forest group-hover:bg-forest/10'}`}>
          {item.day}
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-forest uppercase tracking-tight mb-1">{item.title}</h4>
          <div className="flex gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
               <Clock size={12} /> {item.activities.length} activities
             </span>
          </div>
        </div>
        <div className={`mt-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={24} className="text-gray-300" />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-8 pl-18 pr-4 space-y-6">
              <p className="text-gray-500 font-medium leading-relaxed italic">{item.desc}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-sage/5 rounded-2xl">
                  <div className="text-[8px] font-black text-sage uppercase tracking-[0.2em] mb-2">Morning</div>
                  <div className="text-sm font-bold text-forest">{item.schedule.morning}</div>
                </div>
                <div className="p-4 bg-forest/5 rounded-2xl">
                  <div className="text-[8px] font-black text-forest uppercase tracking-[0.2em] mb-2">Afternoon</div>
                  <div className="text-sm font-bold text-forest">{item.schedule.afternoon}</div>
                </div>
                <div className="p-4 bg-sand/5 rounded-2xl">
                  <div className="text-[8px] font-black text-sand/80 uppercase tracking-[0.2em] mb-2">Evening</div>
                  <div className="text-sm font-bold text-forest">{item.schedule.evening}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] font-black text-forest uppercase tracking-widest">Key inclusions</h5>
                <div className="flex flex-wrap gap-2">
                  {item.activities.map(act => (
                    <span key={act} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-sage" />
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startDirectMessage, startTripGroupChat } = useChat();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await apiFetch(`/api/trips/${id}`);
        const data = await res.json();
        setTrip(data);

        // Track trip view
        apiFetch("/api/analytics/track", {
          method: "POST",
          body: JSON.stringify({
            type: "TRIP_VIEW",
            targetId: id,
            metadata: { country: "Visitor" }
          })
        });
      } catch (err) {
        console.error("Failed to fetch trip", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleChatWithGuide = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await startDirectMessage(trip.guideId, id);
      navigate("/dashboard/messages");
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("You can only message guides of trips you've booked or requested.");
      }
    }
  };

  const handleJoinGroupChat = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await startTripGroupChat(id!);
      navigate("/dashboard/messages");
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Only confirmed participants can join the tribe group chat.");
      }
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const review = {
        id: Math.random().toString(36).substr(2, 9),
        user: currentUser?.name || "You",
        rating: newReview.rating,
        date: "Just now",
        comment: newReview.comment,
        avatar: (currentUser?.name || "Y").charAt(0)
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
      setIsSubmitting(false);
    }, 800);
  };

  if (loading) return (
    <div className="pt-32 flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
    </div>
  );

  if (!trip) return (
    <div className="pt-32 text-center text-forest h-[60vh]">
      <h2 className="text-3xl font-black mb-4">Expedition not found</h2>
      <Link to="/explore" className="text-sage font-bold underline">Back to Explore</Link>
    </div>
  );

  const bookingProgress = (trip.participantsCount / trip.groupSizeMax) * 100;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": trip.title,
    "description": trip.description,
    "image": trip.image || trip.images?.[0],
    "offers": {
      "@type": "Offer",
      "price": trip.price,
      "priceCurrency": "USD"
    },
    "itinerary": trip.itinerary?.map((day: any) => ({
      "@type": "EntryPoint",
      "name": day.title,
      "description": day.desc
    })),
    "provider": {
      "@type": "Person",
      "name": trip.guide.name
    }
  };

  const tripImages = trip.images && trip.images.length ? trip.images : [
    trip.image || "https://images.unsplash.com/photo-1489493585343-b99d86028ca1?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=800",
  ];

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <SEO 
        title={`${trip.title} — ${trip.durationDays} Days`}
        description={trip.description?.substring(0, 160)}
        image={trip.image || tripImages[0]}
        type="article"
        structuredData={structuredData}
      />
      <AnimatePresence>
        {isPhotoModalOpen && (
          <PhotoModal 
            images={tripImages} 
            isOpen={isPhotoModalOpen} 
            onClose={() => setIsPhotoModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Hero Section - Full Width Navigation */}
      <div className="container-wide py-4 md:py-6 flex items-center justify-between">
        <Link to="/explore" className="flex items-center gap-2 text-forest font-bold text-sm hover:underline transition-all">
          <ArrowLeft size={16} /> Back to expeditions
        </Link>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 hover:bg-gray-100 rounded-lg text-sm font-bold text-forest transition-all underline">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 hover:bg-gray-100 rounded-lg text-sm font-bold text-forest transition-all underline">
            <Heart size={16} /> Save
          </button>
        </div>
      </div>

      {/* Airbnb-style Photo Grid */}
      <div className="container-wide mb-8 md:mb-12">
        <div className="relative grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-[300px] sm:h-[400px] md:h-[550px] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
            <img src={tripImages[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Hero Main" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          
          {/* Top Row Smaller Images */}
          <div className="hidden md:block relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
            <img src={tripImages[1]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Hero 2" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="hidden md:block relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
            <img src={tripImages[2]} className="w-full h-full object-cover rounded-tr-3xl transition-transform duration-500 group-hover:scale-105" alt="Hero 3" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          
          {/* Bottom Row Smaller Images */}
          <div className="hidden md:block relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
            <img src={tripImages[3]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Hero 4" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="hidden md:block relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
            <img src={tripImages[4]} className="w-full h-full object-cover rounded-br-3xl transition-transform duration-500 group-hover:scale-105" alt="Hero 5" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          <button 
            onClick={() => setIsPhotoModalOpen(true)}
            className="absolute bottom-6 right-6 px-6 py-2.5 bg-white border border-forest rounded-xl text-forest font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => <div key={i} className="w-1 h-1 bg-forest" />)}
            </div>
            Show all photos
          </button>
        </div>
      </div>

      <div className="container-wide grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 relative">
        {/* Left Column: Content */}
        <div className="lg:col-span-8 space-y-10 md:space-y-12">
          {/* Title and Metadata */}
          <div className="border-b border-gray-100 pb-8 md:pb-12">
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-forest mb-4 md:mb-6 tracking-tight">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-semibold text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-sage" /> {trip.destination}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-sage" /> {trip.durationDays} Days
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-sage" /> {trip.difficulty}
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-sage" /> Max {trip.groupSizeMax} participants
              </div>
            </div>
          </div>

          {/* Guide Strip */}
          <div className="flex items-center justify-between pb-12 border-b border-gray-100">
             <Link to={`/guide/${trip.guide.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                <div className="w-14 h-14 bg-forest/5 rounded-full flex items-center justify-center text-forest text-xl font-black border-2 border-forest/10 overflow-hidden shadow-inner">
                   {trip.guide.avatar ? (
                     <img src={trip.guide.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                   ) : (
                     trip.guide.name[0]
                   )}
                </div>
                <div>
                   <h3 className="text-lg font-bold text-forest">{trip.guide.name}</h3>
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Star size={12} fill="currentColor" className="text-sand" /> 4.9 Rating
                      <span className="mx-1">•</span>
                      <VerificationBadge user={trip.guide} showText />
                   </div>
                </div>
             </Link>
             <button 
              onClick={handleChatWithGuide}
              className="px-6 py-3 bg-forest/5 text-forest rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-forest/10 transition-all font-sans"
             >
               Message Guide
             </button>
          </div>

          {/* Overview */}
          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-heading font-extrabold text-forest uppercase tracking-tight">About this trip</h2>
            <div className="prose prose-forest max-w-none text-gray-500 font-medium text-lg leading-relaxed italic">
              <p>{trip.description || "No detailed description provided for this expedition yet."}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {(trip.inclusions || MOCK_TRIP.specialties).slice(0, 4).map((spec: any) => (
                <div key={spec} className="flex items-start gap-3 p-4 bg-sage/5 rounded-2xl border border-sage/10">
                   <Check size={20} className="text-forest shrink-0 mt-0.5" />
                   <p className="text-sm font-bold text-forest/80 leading-snug">{spec}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Day-by-Day Itinerary */}
          <section className="space-y-8 text-left">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-heading font-extrabold text-forest uppercase tracking-tight">Daily EXPEDITION PLAN</h2>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{trip.durationDays} days total</span>
            </div>
            <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
              {(trip.itinerary?.length ? trip.itinerary : MOCK_TRIP.itinerary).map((day: any) => (
                <ItineraryItem key={day.day} item={day} />
              ))}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Inclusions / Exclusions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-6">
               <h3 className="text-xl font-heading font-extrabold text-forest uppercase tracking-tight flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest"><Check size={18} /></div>
                 What's included
               </h3>
               <ul className="grid grid-cols-1 gap-3">
                 {(trip.inclusions?.length ? trip.inclusions : MOCK_TRIP.included).map((item: any) => (
                   <li key={item} className="flex items-start gap-3 text-sm font-bold text-gray-500 uppercase tracking-tight">
                     <div className="w-1.5 h-1.5 rounded-full bg-sage mt-1.5 shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
            </div>
            <div className="space-y-6 opacity-70">
               <h3 className="text-xl font-heading font-extrabold text-forest uppercase tracking-tight flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><X size={18} /></div>
                 Not included
               </h3>
               <ul className="grid grid-cols-1 gap-3">
                 {MOCK_TRIP.notIncluded.map(item => (
                   <li key={item} className="flex items-start gap-3 text-sm font-bold text-gray-500 uppercase tracking-tight">
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Meeting Point & Map placeholder */}
          <section className="space-y-6 text-left">
            <h2 className="text-2xl font-heading font-extrabold text-forest uppercase tracking-tight">Meeting point</h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="flex-1 space-y-4">
                  <div className="p-6 bg-offwhite rounded-3xl border border-gray-100">
                    <p className="text-lg font-bold text-forest leading-relaxed italic">{trip.meetingPoint || "TBD - Join the Tribe Chat for details."}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-gray-400 text-left">
                    <Info size={18} className="text-sage" /> Join the Tribe Chat for live location sharing on the day.
                  </div>
               </div>
               <div className="w-full md:w-1/3 aspect-square rounded-3xl overflow-hidden bg-sage/5 border border-sage/10 relative group">
                  {hasValidKey ? (
                    <APIProvider apiKey={API_KEY} version="weekly">
                      <Map
                        defaultCenter={{ lat: trip.latitude || 31.6295, lng: trip.longitude || -7.9811 }}
                        defaultZoom={15}
                        mapId="MEETING_MAP"
                        disableDefaultUI={true}
                        style={{ width: '100%', height: '100%' }}
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      >
                        <AdvancedMarker position={{ lat: trip.latitude || 31.6295, lng: trip.longitude || -7.9811 }}>
                           <Pin background="#1B3B36" glyphColor="#fff" borderColor="#1B3B36" />
                        </AdvancedMarker>
                      </Map>
                    </APIProvider>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-sand/5">
                        <MapIcon size={32} className="text-sand/40 mb-4" />
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Interactive map offline</span>
                    </div>
                  )}
               </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Packing List */}
          <section className="space-y-8 bg-forest p-12 rounded-[3rem] relative overflow-hidden text-left">
             <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none">
                <Backpack size={160} />
             </div>
             <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-tighter flex items-center gap-4 relative z-10">
               <Backpack size={24} className="text-sand" /> EXPEDITION PACKING LIST
             </h2>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
               {MOCK_TRIP.packingList.map(item => (
                 <div key={item} className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-sand shrink-0" />
                    <span className="text-xs font-bold text-white uppercase tracking-tight">{item}</span>
                 </div>
               ))}
             </div>
          </section>

          <hr className="border-gray-100" />

          {/* Reviews Breakdown */}
          <section className="space-y-12 pt-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
               <div className="md:col-span-5 space-y-6">
                 <h2 className="text-2xl font-heading font-extrabold text-forest uppercase tracking-tight">Traveler echoes</h2>
                 <div className="flex items-center gap-6">
                   <div className="text-7xl font-heading font-extrabold text-forest leading-none uppercase tracking-tighter">4.9</div>
                   <div className="space-y-1">
                      <div className="flex gap-0.5 text-sand">
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} size={20} fill="currentColor" />
                        ))}
                      </div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Based on {trip.reviewsCount} reviews</div>
                   </div>
                 </div>

                 {/* Breakdown Bars */}
                 <div className="space-y-3">
                   {[5, 4, 3, 2, 1].map(num => (
                     <div key={num} className="flex items-center gap-4 group">
                        <span className="text-[10px] font-black text-gray-400 group-hover:text-forest transition-colors">{num}★</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${((trip.ratingBreakdown || {}) as any)[num] || 0}%` }}
                            viewport={{ once: true }}
                            className="h-full bg-forest rounded-full" 
                           />
                        </div>
                        <span className="text-[10px] font-bold text-gray-300 w-8">{((trip.ratingBreakdown || {}) as any)[num] || 0}%</span>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="md:col-span-7 space-y-8">
                 {reviews.map((review, idx) => (
                   <div key={review.id} className="pb-8 border-b border-gray-50 last:border-0 last:pb-0 space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center text-forest font-black text-xs border border-forest/10">
                               {review.avatar}
                            </div>
                            <div>
                               <div className="text-sm font-bold text-forest uppercase tracking-tight">{review.user}</div>
                               <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{review.date}</div>
                            </div>
                         </div>
                         <div className="flex gap-0.5 text-sand">
                            {[...Array(5)].map((_, i) => (
                               <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                         </div>
                      </div>
                      <p className="text-sm text-gray-500 font-medium italic leading-relaxed">&quot;{review.comment}&quot;</p>
                   </div>
                 ))}
                 <button className="w-full py-4 border-2 border-forest rounded-2xl text-forest font-black uppercase tracking-widest text-xs hover:bg-forest/5 transition-all">
                    Show all {trip.reviewsCount} traveler echoes
                 </button>
               </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Q&A Section */}
          <section className="space-y-8 text-left">
            <h2 className="text-2xl font-heading font-extrabold text-forest uppercase tracking-tight">Common inquiries</h2>
            <div className="space-y-6">
              {trip.qAndA.map(qa => (
                <div key={qa.q} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm space-y-4">
                   <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-sand/10 flex items-center justify-center text-sand/80 shrink-0 mt-1"><HelpCircle size={18} /></div>
                      <p className="text-lg font-bold text-forest leading-tight uppercase italic">{qa.q}</p>
                   </div>
                   <div className="pl-12">
                      <p className="text-sm text-gray-500 italic font-medium leading-relaxed">
                        <span className="font-black text-forest not-italic mr-2">Guide:</span>
                        {qa.a}
                      </p>
                   </div>
                </div>
              ))}
            </div>
            <div className="bg-sage/5 p-8 rounded-[2.5rem] border border-sage/10 text-center">
               <p className="text-sm font-bold text-forest mb-4 uppercase tracking-tight">Don't find your answer?</p>
               <button 
                onClick={handleChatWithGuide}
                className="px-8 py-3 bg-forest text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-forest/20 hover:bg-dark transition-all"
               >
                 Ask {trip.guide.name} a question
               </button>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-4 relative text-left">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
               <div className="p-10 space-y-10">
                  <div className="space-y-2">
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-heading font-extrabold text-forest tracking-tighter uppercase">${trip.price}</span>
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">/ per person</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 border border-gray-100 rounded-3xl overflow-hidden group">
                       <button className="p-4 bg-white hover:bg-gray-50 border-r border-gray-100 text-left transition-all">
                          <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Launch Date</div>
                          <div className="text-xs font-bold text-forest uppercase">{trip.startDate ? format(new Date(trip.startDate), 'MMM dd, yyyy') : 'TBD'}</div>
                       </button>
                       <button className="p-4 bg-white hover:bg-gray-50 text-left transition-all">
                          <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Return Date</div>
                          <div className="text-xs font-bold text-forest uppercase">{trip.endDate ? format(new Date(trip.endDate), 'MMM dd, yyyy') : 'TBD'}</div>
                       </button>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className={`${trip.groupSizeMax - trip.participantsCount <= 3 ? 'text-red-500' : 'text-forest'}`}>
                            {trip.groupSizeMax - trip.participantsCount <= 3 ? 'Urgent! ' : ''}
                            {trip.groupSizeMax - (trip.participantsCount || 0)} spots remaining
                          </span>
                          <span className="text-gray-300">{trip.participantsCount || 0} / {trip.groupSizeMax} joined</span>
                       </div>
                       <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${bookingProgress}%` }}
                            className={`h-full rounded-full ${bookingProgress > 80 ? 'bg-red-500' : 'bg-sage'}`} 
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full h-20 bg-forest hover:bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-forest/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                      Request to Join the Tribe
                    </button>
                    <div className="flex gap-2">
                       <button className="flex-1 flex items-center justify-center gap-2 py-3 text-forest font-bold text-xs hover:bg-gray-50 rounded-xl transition-all underline">
                         <Heart size={16} /> Save
                       </button>
                       <button 
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-red-400 font-bold text-xs hover:bg-red-50 rounded-xl transition-all underline"
                       >
                         <AlertOctagon size={16} /> Report
                       </button>
                    </div>
                  </div>

                  <hr className="border-gray-50" />

                  {/* Sidebar Guide Card */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center text-forest font-black border border-sage/20 text-lg overflow-hidden">
                          {trip.guide.avatar ? (
                            <img src={trip.guide.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                          ) : (
                            trip.guide.name[0]
                          )}
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-bold text-forest">Hosted by {trip.guide.name}</h4>
                          <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            Replies {trip.guide.responseTime || "within a day"}
                          </div>
                       </div>
                       <div className="flex items-center gap-1.5 px-2 py-1 bg-sand/10 rounded-lg">
                          <Star size={10} fill="currentColor" className="text-sand" />
                          <span className="text-[10px] font-black text-forest">4.9</span>
                       </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleChatWithGuide}
                      className="w-full py-6 border-2 border-forest rounded-2xl text-forest font-black uppercase tracking-widest text-[10px] hover:bg-forest/5 flex items-center gap-3"
                    >
                      <MessageCircle size={14} /> Direct Message
                    </Button>
                  </div>
               </div>
            </div>

            {/* Quick Summary list */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-sleek border border-gray-100">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Expedition Essence</h4>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-xs font-bold text-forest text-left">
                    <div className="w-2 h-2 rounded-full bg-sage" /> All desert gear included
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-forest text-left">
                    <div className="w-2 h-2 rounded-full bg-sage" /> Maximum {trip.groupSizeMax} participants
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-forest text-left">
                    <div className="w-2 h-2 rounded-full bg-sage" /> Multi-language local guide
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-forest text-left">
                    <div className="w-2 h-2 rounded-full bg-sage" /> Verified accommodation
                  </li>
               </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-2">
                  <Shield size={20} className="text-sage" />
                  <span className="text-[8px] font-black text-forest uppercase tracking-widest">Secure Booking</span>
               </div>
               <div className="bg-white/50 p-4 rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-2">
                  <Clock size={20} className="text-sage" />
                  <span className="text-[8px] font-black text-forest uppercase tracking-widest">Free Cancelation</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Trips Section */}
      <div className="container-wide mt-24 md:mt-32 space-y-10 md:space-y-12">
        {/* Render Modals at the end */}
        <ReportModal 
          isOpen={isReportModalOpen} 
          onClose={() => setIsReportModalOpen(false)}
          targetType="TRIP"
          targetId={trip.id}
          targetName={trip.title}
        />
         <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
           <h2 className="text-3xl md:text-4xl font-heading font-bold text-forest tracking-tighter">You might also like</h2>
           <Link to="/explore" className="text-sm font-bold text-forest underline tracking-widest">View all expeditions</Link>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {SIMILAR_TRIPS.map(trip => (
              <Link 
                key={trip.id} 
                to={`/trip/${trip.id}`}
                className="group space-y-4"
              >
                 <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-sm relative">
                    <img src={trip.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={trip.title} />
                    <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowLeft className="rotate-180" size={20} />
                    </div>
                    <div className="absolute top-6 left-6 px-4 py-2 bg-forest text-white text-[10px] font-black rounded-xl uppercase tracking-widest">
                       ${trip.price}
                    </div>
                 </div>
                 <div className="px-2">
                    <h4 className="text-xl font-bold text-forest group-hover:text-sage transition-colors truncate uppercase tracking-tight">{trip.title}</h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                       <MapPin size={12} className="text-sage" /> {trip.destination}
                    </div>
                 </div>
              </Link>
            ))}
         </div>
      </div>
    </div>
  );
}

