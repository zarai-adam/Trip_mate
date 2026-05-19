import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, MapPin, Calendar, Filter, Heart, Star, 
  Map as MapIcon, SlidersHorizontal, ChevronDown, 
  Activity, Sparkles, LayoutGrid, List, 
  X, Check, Globe, Users, Clock, Languages,
  ShieldCheck, ArrowRight, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { TripCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/PageTransition";
import { apiFetch } from "@/lib/api";
import TripCard from "@/components/TripCard";
import ListViewCard from "@/components/ListViewCard";
import ExploreMap from "@/components/ExploreMap";
import SearchSuggestions from "@/components/SearchSuggestions";

interface Trip {
  id: string;
  title: string;
  destination: string;
  price: number;
  startDate: string;
  endDate: string;
  guide: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
  type: string;
  difficulty: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  durationDays: number;
  groupSizeMax: number;
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">(
    (searchParams.get("view") as any) || "grid"
  );
  const [showMapSplit, setShowMapSplit] = useState(searchParams.get("map") === "true");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [activeType, setActiveType] = useState(searchParams.get("type") || "All");
  const [activeDifficulty, setActiveDifficulty] = useState(searchParams.get("difficulty") || "All");
  const [priceRange, setPriceRange] = useState({ 
    min: Number(searchParams.get("minPrice") || 0), 
    max: Number(searchParams.get("maxPrice") || 5000) 
  });
  const [onlyFree, setOnlyFree] = useState(searchParams.get("free") === "true");
  const [duration, setDuration] = useState(searchParams.get("duration") || "Any");
  const [groupSize, setGroupSize] = useState({ 
    min: Number(searchParams.get("minGroup") || 1), 
    max: Number(searchParams.get("maxGroup") || 20) 
  });
  const [language, setLanguage] = useState(searchParams.get("lang") || "");
  const [soloFriendly, setSoloFriendly] = useState(searchParams.get("solo") === "true");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [startDate, setStartDate] = useState(searchParams.get("start") || "");

  const types = ["All", "ADVENTURE", "CULTURAL", "RELAXATION", "NATURE", "HERITAGE", "DESERT", "COAST", "MOUNTAIN", "CITY", "MIXED"];
  const difficulties = ["All", "EASY", "MODERATE", "CHALLENGING", "EXTREME"];
  const durations = ["Any", "1-3 days", "4-7 days", "8-14 days", "15+ days"];

  const tripsCache = useRef<{ [key: string]: { data: Trip[], timestamp: number } }>({});

  const fetchTrips = async () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (activeType !== "All") params.append("type", activeType);
    if (activeDifficulty !== "All") params.append("difficulty", activeDifficulty);
    if (onlyFree) {
      params.append("maxPrice", "0");
    } else {
      if (priceRange.min > 0) params.append("minPrice", priceRange.min.toString());
      if (priceRange.max < 5000) params.append("maxPrice", priceRange.max.toString());
    }
    if (startDate) params.append("startDate", startDate);
    if (groupSize.min > 1) params.append("minGroupSize", groupSize.min.toString());
    if (groupSize.max < 20) params.append("maxGroupSize", groupSize.max.toString());
    if (language) params.append("language", language);
    if (soloFriendly) params.append("isSoloFriendly", "true");
    if (verifiedOnly) params.append("verifiedOnly", "true");
    if (sort) params.append("sort", sort);

    // Duration mapping
    if (duration !== "Any") {
      if (duration === "1-3 days") { params.append("minDuration", "1"); params.append("maxDuration", "3"); }
      if (duration === "4-7 days") { params.append("minDuration", "4"); params.append("maxDuration", "7"); }
      if (duration === "8-14 days") { params.append("minDuration", "8"); params.append("maxDuration", "14"); }
      if (duration === "15+ days") { params.append("minDuration", "15"); }
    }

    const cacheKey = params.toString();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    const cached = tripsCache.current[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setTrips(cached.data);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch(`/api/trips?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTrips(data);
        tripsCache.current[cacheKey] = { data, timestamp: Date.now() };
      }

      // Update URL
      const urlParams = new URLSearchParams(params);
      urlParams.set("view", viewMode);
      if (showMapSplit) urlParams.set("map", "true");
      setSearchParams(urlParams, { replace: true });
    } catch (err) {
      console.error("Failed to fetch trips", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrips();
    }, 500);
    return () => clearTimeout(timer);
  }, [
    searchQuery, activeType, activeDifficulty, priceRange, 
    onlyFree, duration, groupSize, language, soloFriendly, 
    verifiedOnly, sort, startDate, viewMode, showMapSplit
  ]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (searchQuery) chips.push({ label: `"${searchQuery}"`, key: "search", onRemove: () => setSearchQuery("") });
    if (activeType !== "All") chips.push({ label: activeType, key: "type", onRemove: () => setActiveType("All") });
    if (activeDifficulty !== "All") chips.push({ label: activeDifficulty, key: "difficulty", onRemove: () => setActiveDifficulty("All") });
    if (onlyFree) chips.push({ label: "Free Trips", key: "free", onRemove: () => setOnlyFree(false) });
    else if (priceRange.max < 5000) chips.push({ label: `< $${priceRange.max}`, key: "price", onRemove: () => setPriceRange({ min: 0, max: 5000 }) });
    if (duration !== "Any") chips.push({ label: duration, key: "duration", onRemove: () => setDuration("Any") });
    if (soloFriendly) chips.push({ label: "Solo Friendly", key: "solo", onRemove: () => setSoloFriendly(false) });
    if (verifiedOnly) chips.push({ label: "Verified Only", key: "verified", onRemove: () => setVerifiedOnly(false) });
    return chips;
  }, [searchQuery, activeType, activeDifficulty, priceRange, onlyFree, duration, soloFriendly, verifiedOnly]);

  const toggleViewMode = (mode: "grid" | "list" | "map") => {
    if (mode === "map") {
      setShowMapSplit(true);
      setViewMode("grid");
    } else {
      setShowMapSplit(false);
      setViewMode(mode);
    }
  };

  return (
    <PageTransition>
      <div className="bg-background min-h-screen font-sans">
        {/* Modern Enhanced Header */}
        <div className="relative pt-24 md:pt-32 pb-8 md:pb-12 px-4 md:px-6 overflow-hidden bg-gradient-signature selection:bg-accent selection:text-forest">
          <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover" 
              alt=""
            />
          </div>
          
          <div className="container-wide relative z-10">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
              >
                <h1 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter mb-4">
                  Discover <span className="text-accent italic px-2">hidden</span> worlds
                </h1>
                <p className="text-white/70 font-medium text-sm md:text-base uppercase tracking-[0.3em]">Curated by local legends</p>
              </motion.div>

              <div className="relative group">
                <div className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-3xl p-3 md:p-4 rounded-[2.5rem] border border-white/20 shadow-2xl">
                   <div className="relative flex-1 group">
                     <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                     <input 
                        ref={searchInputRef}
                        type="text"
                        placeholder="Where are you dreaming of?"
                        value={searchQuery}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-16 pl-16 pr-6 bg-transparent rounded-[2rem] focus:outline-none text-white font-bold placeholder:text-white/30"
                     />
                     <AnimatePresence>
                        {showSuggestions && (
                          <SearchSuggestions 
                            isVisible={showSuggestions} 
                            onSelect={(val) => { setSearchQuery(val); setShowSuggestions(false); }} 
                          />
                        )}
                     </AnimatePresence>
                   </div>
                   <div className="flex gap-2">
                     <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`h-16 px-8 rounded-[2rem] transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border-2 ${
                          showFilters ? "bg-accent text-forest border-accent" : "bg-white/10 text-white border-white/20 hover:border-white/40"
                        }`}
                      >
                       <Filter size={18} /> Filters
                     </button>
                     <button className="h-16 px-10 bg-accent hover:bg-white text-forest rounded-[2rem] transition-all font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 shadow-black/10 flex items-center gap-2 text-center justify-center">
                        Seek Adventure <ArrowRight size={16} />
                     </button>
                   </div>
                </div>

                {/* Filter Sidebar/Drawer Overlay */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-6"
                    >
                      <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                         {/* Destination & Dates */}
                         <div className="space-y-6">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Start Date</label>
                              <div className="relative">
                                <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" />
                                <input 
                                  type="date" 
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="w-full h-14 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-sand/50"
                                />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Language</label>
                              <div className="relative">
                                <Languages size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" />
                                <input 
                                  type="text" 
                                  placeholder="Language..."
                                  value={language}
                                  onChange={(e) => setLanguage(e.target.value)}
                                  className="w-full h-14 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm focus:outline-none focus:border-sand/50"
                                />
                              </div>
                            </div>
                         </div>

                         {/* Price Range */}
                         <div className="space-y-6">
                            <div className="flex justify-between items-center mb-2">
                               <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Price Range</label>
                               <button 
                                onClick={() => setOnlyFree(!onlyFree)}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                  onlyFree ? "bg-sand text-forest" : "bg-white/10 text-white border border-white/10"
                                }`}
                               >
                                 Free Only
                               </button>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between text-xs font-black text-white italic">
                                <span>${priceRange.min}</span>
                                <span>${priceRange.max}</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="5000" 
                                step="50"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                disabled={onlyFree}
                                className="w-full accent-sand"
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Duration</label>
                              <div className="flex flex-wrap gap-2">
                                {durations.map(d => (
                                  <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                                      duration === d ? "bg-white text-forest" : "bg-white/5 text-white/60 border border-white/5 hover:bg-white/10"
                                    }`}
                                  >
                                    {d}
                                  </button>
                                ))}
                              </div>
                            </div>
                         </div>

                         {/* Toggles & Group */}
                         <div className="space-y-6">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Trust & Features</label>
                              <button 
                                onClick={() => setVerifiedOnly(!verifiedOnly)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                                  verifiedOnly ? "bg-white/10 border-sand text-sand" : "bg-white/5 border-white/5 text-white/60"
                                }`}
                              >
                                <div className="flex items-center gap-3 font-bold text-xs">
                                  <ShieldCheck size={18} /> Verified Locals Only
                                </div>
                                {verifiedOnly && <Check size={16} />}
                              </button>
                              <button 
                                onClick={() => setSoloFriendly(!soloFriendly)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                                  soloFriendly ? "bg-white/10 border-sand text-sand" : "bg-white/5 border-white/5 text-white/60"
                                }`}
                              >
                                <div className="flex items-center gap-3 font-bold text-xs">
                                  <Users size={18} /> Solo Traveler Friendly
                                </div>
                                {soloFriendly && <Check size={16} />}
                              </button>
                            </div>
                         </div>

                         {/* Difficulty */}
                         <div className="space-y-6">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Difficulty Peak</label>
                            <div className="grid grid-cols-2 gap-2">
                               {difficulties.map(d => (
                                 <button
                                   key={d}
                                   onClick={() => setActiveDifficulty(d)}
                                   className={`p-3 rounded-xl text-[10px] font-bold transition-all border ${
                                     activeDifficulty === d 
                                      ? "bg-sand text-forest border-sand" 
                                      : "bg-white/5 text-white/40 border-white/5 hover:border-white/10"
                                   }`}
                                 >
                                   {d}
                                 </button>
                               ))}
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full rounded-2xl border-white/20 text-white hover:bg-white/10 h-14"
                              onClick={() => {
                                setSearchQuery("");
                                setActiveType("All");
                                setActiveDifficulty("All");
                                setPriceRange({ min: 0, max: 5000 });
                                setOnlyFree(false);
                                setDuration("Any");
                                setLanguage("");
                                setSoloFriendly(false);
                                setVerifiedOnly(false);
                                setStartDate("");
                              }}
                            >
                              Reset All
                            </Button>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* View Controls & Filter Chips */}
        <div className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/20 py-4">
           <div className="container-wide flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-3">
                 <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mr-2">Filters:</div>
                 {activeFilterChips.length > 0 ? (
                   activeFilterChips.map(chip => (
                     <button
                        key={chip.key}
                        onClick={chip.onRemove}
                        className="flex items-center gap-2 px-4 py-1.5 bg-forest/5 rounded-full text-forest text-[10px] font-bold border border-forest/10 hover:bg-forest hover:text-white transition-all group"
                     >
                       {chip.label}
                       <X size={12} className="text-forest/30 group-hover:text-white" />
                     </button>
                   ))
                 ) : (
                   <span className="text-[10px] font-black text-gray-400 italic">None active</span>
                 )}
              </div>

              <div className="flex items-center gap-6">
                 <div className="hidden lg:flex items-center gap-2 bg-forest/5 p-1 rounded-2xl border border-forest/10">
                    <button 
                      onClick={() => toggleViewMode("grid")}
                      className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" && !showMapSplit ? "bg-white text-forest shadow-sm" : "text-forest/40 hover:text-forest"}`}
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button 
                      onClick={() => toggleViewMode("list")}
                      className={`p-2.5 rounded-xl transition-all ${viewMode === "list" && !showMapSplit ? "bg-white text-forest shadow-sm" : "text-forest/40 hover:text-forest"}`}
                    >
                      <List size={18} />
                    </button>
                    <button 
                      onClick={() => toggleViewMode("map")}
                      className={`p-2.5 rounded-xl transition-all ${showMapSplit ? "bg-white text-forest shadow-sm" : "text-forest/40 hover:text-forest"}`}
                    >
                      <MapIcon size={18} />
                    </button>
                 </div>

                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort:</span>
                    <select 
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="bg-transparent text-forest font-black text-[10px] uppercase tracking-widest border-none focus:ring-0 cursor-pointer"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low-High</option>
                      <option value="price-high">Price: High-Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="start-date">Start Date</option>
                    </select>
                 </div>
              </div>
           </div>
        </div>

        {/* Results Metadata */}
        <div className="container-wide pt-8 flex items-center justify-between">
           <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground tracking-tighter">
             {isLoading ? "Scanning World..." : (
               <>Showing <span className="text-primary">{trips.length}</span> adventures</>
             )}
           </h2>
           {!isLoading && trips.length > 0 && (
             <div className="bg-forest/5 px-4 py-2 rounded-xl text-[10px] font-black text-forest/40 uppercase tracking-widest">
               Page 1 of {Math.ceil(trips.length / 12)}
             </div>
           )}
        </div>

        {/* Content Area */}
        <div className="container-wide pt-12 pb-32">
          <div className="flex gap-12 relative items-start">
            {/* Split View Content */}
            <div className={`flex-grow transition-all duration-700 ${showMapSplit ? "md:w-1/2" : "w-full"}`}>
              {isLoading ? (
                <div className={`grid gap-8 ${showMapSplit ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                  {[1, 2, 3, 4, 5, 6].map(i => <TripCardSkeleton key={i} />)}
                </div>
              ) : trips.length > 0 ? (
                <div className={`grid gap-8 ${
                  showMapSplit 
                    ? "grid-cols-1" 
                    : viewMode === "list" 
                      ? "grid-cols-1" 
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}>
                  {trips.map((trip, idx) => (
                    viewMode === "list" && !showMapSplit ? (
                      <ListViewCard key={trip.id} trip={trip} index={idx} />
                    ) : (
                      <TripCard key={trip.id} trip={trip} index={idx} />
                    )
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={Sparkles}
                  title="Adventure horizon is empty"
                  description="Your dream trek is waiting, but your current filters are too specific."
                  actionLabel="Broaden Search"
                  onAction={() => {
                    setSearchQuery("");
                    setActiveType("All");
                    setActiveDifficulty("All");
                    setPriceRange({ min: 0, max: 5000 });
                  }}
                />
              )}
            </div>

            {/* Sticky Map - Desktop Split View */}
            {showMapSplit && (
              <div className="hidden md:block w-1/2 h-[calc(100vh-200px)] sticky top-36 z-10 transition-all duration-700 animate-in fade-in slide-in-from-right-12">
                <ExploreMap trips={trips} />
                <button 
                  onClick={() => setShowMapSplit(false)}
                  className="absolute top-6 right-6 z-[1000] w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-forest hover:bg-sand transition-all border border-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Map Toggle */}
        <div className="md:hidden fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
           <button 
            onClick={() => setShowMapSplit(!showMapSplit)}
            className="bg-forest text-white px-8 h-16 rounded-[2rem] shadow-2xl flex items-center gap-4 font-black text-[10px] uppercase tracking-widest border-4 border-white/20 active:scale-95 transition-all"
           >
             {showMapSplit ? <LayoutGrid size={18} /> : <MapIcon size={18} />}
             {showMapSplit ? "Show List" : "Explore Map"}
           </button>
        </div>

        {/* Full-screen Mobile Map Overlay */}
        <AnimatePresence>
          {showMapSplit && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[100] bg-white"
            >
              <div className="h-full w-full">
                <ExploreMap trips={trips} />
                <button 
                  onClick={() => setShowMapSplit(false)}
                  className="absolute top-8 right-8 z-[1000] w-14 h-14 bg-white rounded-2xl shadow-inner flex items-center justify-center text-forest border-2 border-gray-100"
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

