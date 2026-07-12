import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function BookingRequests() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Load the current user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      if (!user.id) return;
      // Get all bookings of guide
      const res = await apiFetch(`/api/bookings?guideId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Failed to load guide booking requests", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user.id]);

  const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setActioningId(id);
    const message = prompt(`Optional message to send to the explorer upon ${newStatus.toLowerCase()}:`);
    
    try {
      const res = await apiFetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: newStatus,
          message: message || ""
        })
      });

      if (res.ok) {
        setBookings(prev => prev.map(booking => 
          booking.id === id ? { ...booking, status: newStatus, guideResponse: message } : booking
        ));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update booking status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setActioningId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-amber-50 text-amber-600 border border-amber-200/50";
      case "APPROVED":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200/50";
      case "REJECTED":
        return "bg-rose-50 text-rose-600 border border-rose-200/50";
      default:
        return "bg-gray-50 text-gray-500 border border-gray-200";
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="text-left mb-12">
        <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tighter">Booking Ledger</h1>
        <p className="text-gray-500 font-medium">Verify credentials, approve applications, and welcome travelers to the fold.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-forest animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Retrieving booking logs...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-sage/20">
          <div className="w-24 h-24 bg-offwhite rounded-3xl flex items-center justify-center mx-auto mb-8 text-gray-300">
            <Clock size={48} />
          </div>
          <h3 className="text-3xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tight">No requests received</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed italic">
            Once adventurers request custom places in your upcoming expeditions, requests will populate here!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {bookings.map((booking, idx) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] shadow-sleek border border-sage/10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left hover:shadow-hover transition-all duration-300"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-xs font-bold text-gray-400">ID: {booking.id.slice(-6).toUpperCase()}</span>
                  </div>

                  <h3 className="text-2xl font-heading font-extrabold text-forest uppercase tracking-tight">
                    {booking.trip?.title || "Curated Expedition"}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-sage" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Explorer</span>
                        <span className="text-forest font-bold">{booking.explorer?.name || "Fellow Traveler"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-sage" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Requested At</span>
                        <span>{new Date(booking.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>

                  {booking.guideResponse && (
                    <div className="p-4 bg-offwhite rounded-2xl border border-gray-100/50 text-xs text-gray-500 italic flex items-start gap-2">
                      <MessageSquare size={14} className="text-sage shrink-0 mt-0.5" />
                      <span>"{booking.guideResponse}"</span>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 gap-3">
                  {booking.status === "REQUESTED" ? (
                    <>
                      <Button 
                        disabled={actioningId === booking.id}
                        onClick={() => handleStatusUpdate(booking.id, "REJECTED")}
                        variant="outline"
                        className="rounded-xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold px-4 gap-1"
                      >
                        <X size={16} /> Decline
                      </Button>
                      <Button 
                        disabled={actioningId === booking.id}
                        onClick={() => handleStatusUpdate(booking.id, "APPROVED")}
                        className="bg-forest text-white rounded-xl font-bold px-6 gap-2 hover:scale-102 transition-transform"
                      >
                        {actioningId === booking.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Check size={16} />} Approve
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      {booking.status === "APPROVED" ? (
                        <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={16} /> Already Approved</span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600"><XCircle size={16} /> Already Declined</span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
