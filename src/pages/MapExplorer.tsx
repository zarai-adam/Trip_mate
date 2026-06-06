import React, { useState, useEffect, useRef } from "react";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useAdvancedMarkerRef 
} from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  MapPin, 
  Search, 
  Filter, 
  Navigation, 
  Info,
  Calendar,
  Users,
  Star,
  ChevronRight,
  X,
  Target,
  Plane,
  Heart,
  DollarSign,
  Map as MapIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY !== "";

interface Trip {
  id: string;
  title: string;
  destination: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  image: string;
  difficulty: string;
  tripType: string;
  startDate: string;
  groupSizeMax: number;
  guide: {
    name: string;
    avatar: string;
  }
}

const CATEGORIES = ["Adventure", "Culture", "Relaxation", "Nature", "Heritage"];

const MapExplorer = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [hoveredTripId, setHoveredTripId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  useEffect(() => {
    apiFetch("/api/trips")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTrips(data);
        }
      })
      .catch(err => console.error("Failed to load map trips", err));
  }, []);

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || t.tripType === activeCategory;
    const matchesPrice = t.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const MapSplash = () => (
    <div className="w-full h-full bg-sage/5 flex items-center justify-center p-12 text-center overflow-y-auto">
      <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sleek space-y-8">
        <div className="w-20 h-20 bg-sage/20 rounded-[2rem] flex items-center justify-center mx-auto text-forest">
          <MapIcon size={32} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-heading font-extrabold text-forest uppercase tracking-tighter leading-none">KEY REQUIRED</h2>
          <p className="text-gray-400 font-medium text-sm">To unlock the full interactive experience, please configure your Google Maps API Key.</p>
        </div>
        
        <div className="text-left space-y-4 bg-offwhite p-6 rounded-[2rem] border border-gray-50 text-[10px] font-black uppercase tracking-widest text-forest/40">
          <div className="flex items-start gap-4">
            <span className="w-6 h-6 bg-forest text-white rounded-lg flex items-center justify-center shrink-0">1</span>
            <p className="pt-1">Get an API key from <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noopener" className="text-forest hover:underline">Google Cloud</a></p>
          </div>
          <div className="flex items-start gap-4">
            <span className="w-6 h-6 bg-sage text-white rounded-lg flex items-center justify-center shrink-0">2</span>
            <p className="pt-1">Go to <span className="text-forest italic">Settings → Secrets</span> and add <code className="text-[9px] bg-forest/10 px-1 border border-forest/5 text-forest">GOOGLE_MAPS_PLATFORM_KEY</code></p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col font-sans overflow-hidden bg-offwhite">
      {/* Dynamic Header Overlay */}
      <div className="absolute top-6 left-6 right-6 z-10 flex flex-col gap-4 pointer-events-none">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="max-w-xl flex-1 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md p-3 rounded-[1.5rem] shadow-2xl border border-white flex items-center gap-3">
               <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-forest/20">
                 <Search className="w-6 h-6" />
               </div>
               <input 
                 type="text" 
                 placeholder="Search destination, theme, or guide..." 
                 className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-forest placeholder:text-gray-200"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <Link to="/explore" className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-forest px-4 py-2 hover:bg-forest/5 rounded-xl transition-all">
                  List View
               </Link>
            </div>
          </div>

          <div className="pointer-events-auto flex gap-2 overflow-x-auto no-scrollbar py-1">
             {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                    activeCategory === cat 
                    ? "bg-forest text-white border-forest shadow-xl" 
                    : "bg-white text-forest shadow-sm hover:shadow-md border-gray-100"
                  }`}
                >
                  {cat}
                </button>
             ))}
          </div>
        </div>

        {/* Price Filter Tag */}
        <div className="pointer-events-auto">
           <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-sleek">
              <DollarSign size={14} className="text-forest" />
              <input 
                type="range" 
                min="0" 
                max="3000" 
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-forest"
              />
              <span className="text-xs font-black text-forest tracking-tight">LIMIT: ${maxPrice}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <div className="flex-1 relative">
              <Map
                defaultCenter={{ lat: 20, lng: 0 }}
                defaultZoom={3}
                mapId="TRIPMATE_EXPLORER_V2"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
                disableDefaultUI={true}
                zoomControl={true}
                onClick={() => setSelectedTrip(null)}
              >
                <AnimatePresence>
                  {filteredTrips.map((trip) => (
                    trip.latitude && trip.longitude && (
                      <TripMarker 
                        key={trip.id} 
                        trip={trip} 
                        isSelected={selectedTrip?.id === trip.id}
                        isHovered={hoveredTripId === trip.id}
                        onClick={(t) => setSelectedTrip(t)}
                      />
                    )
                  ))}
                </AnimatePresence>

                {selectedTrip && (
                  <InfoWindow 
                    position={{ lat: selectedTrip.latitude!, lng: selectedTrip.longitude! }}
                    onCloseClick={() => setSelectedTrip(null)}
                    headerDisabled={true}
                  >
                    <div className="p-2 min-w-[260px]">
                      <div className="relative mb-4">
                        <img 
                          src={selectedTrip.image} 
                          className="w-full h-36 object-cover rounded-2xl" 
                          alt=""
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-forest text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">{selectedTrip.tripType}</div>
                      </div>
                      <h3 className="font-heading font-extrabold text-forest uppercase tracking-tight leading-snug mb-4">
                        {selectedTrip.title}
                      </h3>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="text-2xl font-heading font-extrabold text-forest">${selectedTrip.price}</span>
                        <Link 
                          to={`/trip/${selectedTrip.id}`}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-forest px-5 py-2.5 rounded-xl hover:bg-forest-dark transition-all shadow-lg"
                        >
                          Details <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </div>
          </APIProvider>
        ) : (
          <div className="flex-1">
            <MapSplash />
          </div>
        )}

        {/* Floating Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute right-6 top-40 lg:top-24 bottom-6 w-80 lg:w-96 bg-white/95 backdrop-blur-xl shadow-2xl rounded-[3rem] border border-white flex flex-col overflow-hidden z-20"
            >
              <div className="p-10 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="text-left">
                  <h2 className="text-2xl font-heading font-extrabold text-forest uppercase tracking-tighter leading-none">Trip Explorer</h2>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2">{filteredTrips.length} EXPEDITIONS FOUND</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-12 h-12 bg-offwhite rounded-2xl text-gray-300 hover:text-forest transition-all flex items-center justify-center border border-gray-50"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {filteredTrips.map(trip => (
                  <motion.div
                    key={trip.id}
                    onHoverStart={() => setHoveredTripId(trip.id)}
                    onHoverEnd={() => setHoveredTripId(null)}
                    onClick={() => setSelectedTrip(trip)}
                    className={`group cursor-pointer p-6 rounded-[2.5rem] border-2 transition-all duration-500 ${
                      selectedTrip?.id === trip.id 
                        ? "bg-forest border-forest text-white shadow-2xl shadow-forest/20" 
                        : "bg-offwhite border-transparent hover:bg-white hover:border-sage/20 hover:shadow-xl"
                    }`}
                  >
                    <div className="space-y-6 text-left">
                      <div className="flex justify-between items-start">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                          selectedTrip?.id === trip.id ? "bg-white/20 text-white" : "bg-forest text-white"
                        }`}>
                          {trip.tripType}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Star className={`w-4 h-4 fill-current ${selectedTrip?.id === trip.id ? "text-sand" : "text-sand"}`} />
                          <span className={`text-xs font-black ${selectedTrip?.id === trip.id ? "text-white" : "text-forest"}`}>4.9</span>
                        </div>
                      </div>
                      <h4 className={`font-heading font-extrabold text-lg uppercase tracking-tight leading-tight group-hover:text-forest transition-colors ${
                        selectedTrip?.id === trip.id ? "text-white group-hover:text-white" : "text-forest"
                      }`}>
                        {trip.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-6">
                         <div className="flex items-center gap-2">
                           <MapPin className={`w-4 h-4 ${selectedTrip?.id === trip.id ? "text-white/60" : "text-sage"}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTrip?.id === trip.id ? "text-white/80" : "text-gray-400"}`}>{trip.destination}</span>
                         </div>
                         <div className="flex items-center gap-2 ml-auto">
                           <span className={`text-2xl font-heading font-extrabold ${selectedTrip?.id === trip.id ? "text-white" : "text-forest"}`}>${trip.price}</span>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle (when closed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute right-6 top-24 z-20 bg-white w-16 h-16 rounded-[2rem] shadow-2xl border-4 border-white text-forest hover:bg-forest hover:text-white transition-all flex items-center justify-center group"
          >
            <Compass className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" />
          </button>
        )}
      </div>
    </div>
  );
};

const TripMarker = ({ trip, onClick, isSelected, isHovered }: { trip: Trip, onClick: (t: Trip) => void, isSelected: boolean, isHovered: boolean }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: trip.latitude!, lng: trip.longitude! }}
      onClick={() => onClick(trip)}
      title={trip.title}
    >
      <div className="relative group cursor-pointer outline-none">
        <motion.div
          animate={{ 
            scale: isSelected ? 1.4 : isHovered ? 1.2 : 1,
            y: isSelected ? -12 : 0
          }}
          className="relative z-10"
        >
          <div className={`p-1.5 rounded-[1.5rem] border-4 bg-white transition-all duration-500 shadow-2xl ${
            isSelected ? "border-forest" : isHovered ? "border-sage" : "border-white"
          }`}>
            <div className={`w-12 h-12 rounded-2xl overflow-hidden transition-all duration-500 ${isSelected ? "rounded-full" : ""}`}>
               <img 
                 src={trip.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200"} 
                 className="w-full h-full object-cover" 
                 alt="" 
                 referrerPolicy="no-referrer"
               />
            </div>
          </div>
          
          {/* Beacon effect for selected */}
          {isSelected && (
            <div className="absolute inset-0 bg-forest rounded-full animate-ping -z-10 opacity-30" />
          )}
        </motion.div>
        
        {/* Price Tag Overlay */}
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-dark rounded-2xl shadow-2xl whitespace-nowrap transition-all duration-500 ${
          isSelected || isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">${trip.price}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-dark" />
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default MapExplorer;
