import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Compass, 
  Edit3, 
  Plus, 
  Loader2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";

export default function MyTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/trips/guide/my-trips");
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch (err) {
      console.error("Failed to fetch guide's trips", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const getStatusBadge = (status: string) => {
    const formatted = status.replace(/_/g, " ");
    switch (status) {
      case "DRAFT":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500">
            <Edit3 size={11} /> {formatted}
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200/50">
            <Clock size={11} /> {formatted}
          </span>
        );
      case "ACCEPTED":
      case "PUBLISHED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200/50">
            <CheckCircle size={11} /> {formatted}
          </span>
        );
      case "DENIED":
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-200/50">
            <XCircle size={11} /> {formatted}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600">
            <AlertCircle size={11} /> {formatted}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="text-left">
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tighter">My Built Expeditions</h1>
          <p className="text-gray-500 font-medium">Manage, edit, and inspect status transitions for all your curated trips.</p>
        </div>
        <Button 
          onClick={() => navigate("/guide/dashboard/create")} 
          className="bg-forest text-white h-14 px-8 rounded-2xl font-black gap-2 shrink-0 hover:scale-102 active:scale-98 transition-transform"
        >
          <Plus size={20} /> Build New Trip
        </Button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-forest animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Loading your ledger...</span>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-sage/20">
          <div className="w-24 h-24 bg-offwhite rounded-3xl flex items-center justify-center mx-auto mb-8 text-gray-300">
            <Compass size={48} />
          </div>
          <h3 className="text-3xl font-heading font-extrabold text-forest mb-4 uppercase tracking-tight">No adventures found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium leading-relaxed italic">
            Get started by crafting your first expedition and sharing it with the tribal network.
          </p>
          <Button 
            onClick={() => navigate("/guide/dashboard/create")} 
            className="bg-forest text-white px-10 h-16 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-forest/20 hover:scale-102 active:scale-98 transition-all"
          >
            Create Your First Trip
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trips.map((trip) => (
            <motion.div 
              key={trip.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-sleek border border-sage/10 overflow-hidden flex flex-col text-left group hover:shadow-hover border-transparent hover:border-sage/20 transition-all duration-300"
            >
              <div className="h-48 bg-gray-50 relative overflow-hidden">
                {trip.image ? (
                  <img src={trip.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={trip.title} />
                ) : (
                  <div className="w-full h-full bg-forest/5 flex items-center justify-center text-forest/20">
                    <Compass size={64} />
                  </div>
                )}
                <div className="absolute top-4 right-4 shadow-sm">
                  {getStatusBadge(trip.status)}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest">
                    <MapPin size={14} className="text-sage" /> {trip.destination}
                  </div>
                  <h3 className="text-2xl font-heading font-extrabold text-forest leading-tight uppercase tracking-tight line-clamp-2">
                    {trip.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={15} className="text-sage" />
                      {new Date(trip.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="font-bold text-forest">
                      ${trip.price} <span className="text-[10px] text-gray-400 font-extrabold uppercase">/ traveler</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div className="text-xs text-gray-400 font-semibold italic">
                    {trip.status === "DRAFT" ? "Drafted but not yet submitted." : trip.status === "UNDER_REVIEW" ? "Pending admin verification." : "Live on the platform!"}
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/guide/dashboard/edit/${trip.id}`)}
                    className="rounded-xl border-sage/20 text-forest font-bold gap-2 hover:bg-forest/5"
                  >
                    <Edit3 size={16} /> Edit Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
