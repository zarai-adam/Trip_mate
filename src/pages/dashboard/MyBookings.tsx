import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, MapPin, Calendar, MessageCircle, AlertCircle, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";

const MOCK_BOOKINGS = [
  {
    id: "b1",
    tripId: "1",
    tripTitle: "Sahara Sunset & Starlit Dunes",
    destination: "Merzouga, Morocco",
    startDate: "Oct 12, 2025",
    endDate: "Oct 16, 2025",
    image: "https://images.unsplash.com/photo-1489493585343-b99d86028ca1?auto=format&fit=crop&q=80&w=600",
    status: "Upcoming",
    guide: "Malik A.",
    price: 450
  },
  {
    id: "b2",
    tripId: "2",
    tripTitle: "Bali Spiritual Retreat",
    destination: "Ubud, Indonesia",
    startDate: "Nov 05, 2025",
    endDate: "Nov 12, 2025",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600",
    status: "Upcoming",
    guide: "Sita D.",
    price: 890
  }
];

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<any | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState<string | null>(null);

  const { startDirectMessage, startTripGroupChat } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    // Load bookings from local storage or use mock
    const saved = localStorage.getItem("roamigo_bookings");
    if (saved) {
      setBookings(JSON.parse(saved));
    } else {
      setBookings(MOCK_BOOKINGS);
    }
  }, []);

  const handleCancelRequest = (booking: any) => {
    setBookingToCancel(booking);
    setShowCancelDialog(true);
  };

  const confirmCancellation = async () => {
    if (!bookingToCancel) return;
    
    try {
      // For demo purposes, we first try to call the real API
      const response = await apiFetch(`/api/bookings/${bookingToCancel.id}/cancel`, {
        method: "PATCH",
      });

      if (response.ok) {
        // Update local state by changing status instead of removing
        setBookings(prev => prev.map(b => 
          b.id === bookingToCancel.id ? { ...b, status: "CANCELLED" } : b
        ));
        
        // Update localStorage if we were using it
        const saved = localStorage.getItem("roamigo_bookings");
        if (saved) {
          const bookings = JSON.parse(saved);
          const updated = bookings.map((b: any) => 
            b.id === bookingToCancel.id ? { ...b, status: "CANCELLED" } : b
          );
          localStorage.setItem("roamigo_bookings", JSON.stringify(updated));
        }
      } else {
        // Fallback for mock/local data if API fails (e.g. ID doesn't exist in DB)
        setBookings(prev => prev.map(b => 
          b.id === bookingToCancel.id ? { ...b, status: "CANCELLED" } : b
        ));
      }
    } catch (error) {
      console.error("Cancellation failed:", error);
      // Fallback for local-only data
      setBookings(prev => prev.map(b => 
        b.id === bookingToCancel.id ? { ...b, status: "CANCELLED" } : b
      ));
    } finally {
      setShowCancelDialog(false);
      setBookingToCancel(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <div className="max-w-5xl">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tighter">My Expeditions</h1>
            <p className="text-gray-500 font-medium">Keep track of your past and upcoming adventures.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-forest text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Active</button>
            <button className="px-6 py-2 bg-white text-gray-400 rounded-full text-xs font-black uppercase tracking-widest border border-gray-100 hover:text-forest transition-colors">Past</button>
          </div>
       </div>

       <AnimatePresence>
         {showSuccess && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="mb-8 p-4 bg-sage/10 border border-sage/20 rounded-2xl flex items-center gap-4 text-forest font-bold"
           >
              <div className="w-10 h-10 bg-forest text-white rounded-xl flex items-center justify-center">
                 <Clock size={20} />
              </div>
              Booking successfully cancelled.
           </motion.div>
         )}
       </AnimatePresence>

       <div className="space-y-8">
          {bookings.map((booking, idx) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] shadow-sleek border border-sage/10 overflow-hidden flex flex-col lg:flex-row text-left group"
            >
               <div className="lg:w-72 h-48 lg:h-auto shrink-0 bg-gray-100 relative overflow-hidden">
                  <img src={booking.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="trip" referrerPolicy="no-referrer" />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    booking.status === "Upcoming" ? "bg-forest text-white" : booking.status === "CANCELLED" ? "bg-red-500 text-white" : "bg-gray-400 text-white"
                  }`}>
                    {booking.status}
                  </div>
               </div>
               
               <div className="p-8 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest">
                        <MapPin size={14} className="text-sage" /> {booking.destination}
                     </div>
                     <h3 className="text-2xl font-heading font-extrabold text-forest leading-tight uppercase tracking-tight">{booking.tripTitle}</h3>
                     <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                           <Calendar size={16} className="text-sage" /> {booking.startDate}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                           <Clock size={16} className="text-sage" /> {booking.endDate}
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between h-full py-2">
                     <div className="text-right mb-4 md:mb-0">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lead Guide</div>
                        <div className="text-sm font-bold text-forest uppercase">{booking.guide}</div>
                     </div>
                     <div className="flex gap-3 relative">
                        {booking.status !== "CANCELLED" && (
                          <Button 
                            onClick={() => handleCancelRequest(booking)}
                            variant="outline" 
                            className="rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold px-4"
                          >
                            Cancel
                          </Button>
                        )}
                        <div className="relative">
                          <Button 
                            onClick={() => setShowChatOptions(showChatOptions === booking.id ? null : booking.id)}
                            variant="outline" 
                            className={`rounded-xl border-sage/20 text-forest font-bold gap-2 ${booking.status === "CANCELLED" ? "opacity-50 grayscale pointer-events-none" : ""}`}
                          >
                            <MessageCircle size={18} /> Chat
                          </Button>

                          <AnimatePresence>
                            {showChatOptions === booking.id && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-full right-0 mb-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-10"
                              >
                                <button 
                                  onClick={() => {
                                    // Guide ID would be needed here, using a placeholder for demo
                                    startDirectMessage("guide-placeholder-id", booking.tripId);
                                    navigate("/dashboard/messages");
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-forest flex items-center gap-3"
                                >
                                  <MessageCircle size={16} /> DM Guide
                                </button>
                                <button 
                                  onClick={() => {
                                    startTripGroupChat(booking.tripId);
                                    navigate("/dashboard/messages");
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-forest flex items-center gap-3"
                                >
                                  <Users size={16} /> Tribe Chat
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          ))}
       </div>

       {bookings.length === 0 && (
         <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-sage/20">
            <div className="w-24 h-24 bg-offwhite rounded-3xl flex items-center justify-center mx-auto mb-8 text-gray-300">
               <MapPin size={48} />
            </div>
            <h3 className="text-3xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tight">No active expeditions</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed italic">
               The horizon is calling. Find your next adventure and meet the tribe.
            </p>
            <Button className="bg-forest text-white px-10 h-16 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-forest/20">Find Adventure</Button>
         </div>
       )}

       {/* Cancellation Dialog */}
       <AnimatePresence>
         {showCancelDialog && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCancelDialog(false)}
                className="absolute inset-0 bg-forest/20 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[3.5rem] p-12 shadow-2xl border border-white space-y-8"
              >
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
                   <AlertCircle size={40} />
                </div>
                
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-heading font-extrabold text-forest uppercase tracking-tighter">Cancel Expedition?</h3>
                  <p className="text-gray-500 font-medium italic">
                    Are you sure you want to cancel your booking for <span className="text-forest font-bold">{bookingToCancel?.tripTitle}</span>? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowCancelDialog(false)}
                    className="flex-1 h-16 bg-offwhite text-forest rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sage/10 transition-all"
                  >
                    Keep it
                  </button>
                  <button 
                    onClick={confirmCancellation}
                    className="flex-1 h-16 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all"
                  >
                    Confirm Cancel
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowCancelDialog(false)}
                  className="absolute top-8 right-8 text-gray-300 hover:text-forest transition-colors"
                >
                  <X size={24} />
                </button>
              </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
}

