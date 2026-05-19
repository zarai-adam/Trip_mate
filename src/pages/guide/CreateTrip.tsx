import { useState } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  APIProvider, 
  useMapsLibrary,
  useMap
} from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY !== "";

export default function CreateTrip() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    latitude: null as number | null,
    longitude: null as number | null,
    price: "",
    days: "",
    maxParticipants: "8",
    description: "",
    type: "Mountain",
    difficulty: "Moderate",
    itinerary: [{ day: 1, title: "", desc: "" }],
    included: [""],
    notIncluded: [""],
    coverImage: "",
    gallery: [] as string[]
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const addGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    const token = localStorage.getItem("token") || document.cookie.split("token=")[1]?.split(";")[0];

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, data.url] }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    const token = localStorage.getItem("token") || document.cookie.split("token=")[1]?.split(";")[0];

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, coverImage: data.url }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });
  };

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: "", desc: "" }]
    });
  };

  const removeItineraryDay = (index: number) => {
     const newItinerary = formData.itinerary.filter((_, i) => i !== index);
     setFormData({ ...formData, itinerary: newItinerary.map((d, i) => ({ ...d, day: i + 1 })) });
  };

  const addIncluded = () => setFormData({ ...formData, included: [...formData.included, ""] });
  const updateIncluded = (index: number, val: string) => {
    const newIncluded = [...formData.included];
    newIncluded[index] = val;
    setFormData({ ...formData, included: newIncluded });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      console.log("Saving trip...", formData);
      await new Promise(r => setTimeout(r, 2000));
      navigate("/guide/dashboard/trips");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
         <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10"></div>
         {[1, 2, 3].map(i => (
           <div 
            key={i}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${
              step >= i ? "bg-forest text-white" : "bg-white text-gray-400 border-4 border-gray-100"
            }`}
           >
             {step > i ? <CheckCircle size={24} /> : i}
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sleek border border-sage/10 p-8 md:p-12">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h2 className="text-3xl font-black text-forest">The Basics</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trip Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Saharal Sunset & Starlit Dunes"
                  className="w-full p-4 bg-offwhite rounded-2xl border-none focus:ring-2 focus:ring-sage/20 focus:outline-none font-bold text-lg"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sage z-10" size={18} />
                    {hasValidKey ? (
                      <APIProvider apiKey={API_KEY} version="weekly">
                        <PlaceAutocomplete 
                          onPlaceSelect={(name, lat, lng) => {
                            setFormData({ ...formData, destination: name, latitude: lat, longitude: lng });
                          }}
                          defaultValue={formData.destination}
                        />
                      </APIProvider>
                    ) : (
                      <input 
                        type="text" 
                        placeholder="e.g. Morocco"
                        className="w-full p-4 pl-12 bg-offwhite rounded-2xl border-none focus:ring-2 focus:ring-sage/20 focus:outline-none font-bold"
                        value={formData.destination}
                        onChange={e => setFormData({...formData, destination: e.target.value})}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-sage" size={18} />
                    <input 
                      type="number" 
                      placeholder="e.g. 450"
                      className="w-full p-4 pl-12 bg-offwhite rounded-2xl border-none focus:ring-2 focus:ring-sage/20 focus:outline-none font-bold"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trip Type</label>
                    <select 
                      className="w-full p-4 bg-offwhite rounded-2xl border-none focus:ring-2 focus:ring-sage/20 focus:outline-none font-bold appearance-none"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                       <option>Mountain</option>
                       <option>Desert</option>
                       <option>Coast</option>
                       <option>Cultural</option>
                       <option>Arctic</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Difficulty</label>
                    <select 
                      className="w-full p-4 bg-offwhite rounded-2xl border-none focus:ring-2 focus:ring-sage/20 focus:outline-none font-bold appearance-none"
                      value={formData.difficulty}
                      onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    >
                       <option>Easy</option>
                       <option>Moderate</option>
                       <option>Challenging</option>
                    </select>
                 </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <Button onClick={nextStep} className="h-14 bg-forest text-white px-12 rounded-2xl font-black gap-2">
                Continue <ArrowRight size={20} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
            <h2 className="text-3xl font-black text-forest">Itinerary & Details</h2>
            
            <div className="space-y-8">
               {formData.itinerary.map((day, idx) => (
                 <div key={idx} className="p-8 bg-offwhite rounded-3xl relative space-y-4">
                    <button 
                      onClick={() => removeItineraryDay(idx)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 bg-forest text-white rounded-xl flex items-center justify-center font-bold">
                          {day.day}
                       </div>
                       <input 
                        type="text"
                        placeholder="Day Title (e.g. Arrival in Marrakesh)"
                        className="bg-transparent border-none focus:ring-0 font-black text-xl text-forest flex-1"
                        value={day.title}
                        onChange={e => {
                          const newItin = [...formData.itinerary];
                          newItin[idx].title = e.target.value;
                          setFormData({ ...formData, itinerary: newItin });
                        }}
                       />
                    </div>
                    <textarea 
                      placeholder="What will you do? Where will you stay?"
                      className="w-full bg-white/50 rounded-xl p-4 border-none focus:ring-2 focus:ring-sage/20 focus:outline-none font-medium text-sm min-h-[100px]"
                      value={day.desc}
                      onChange={e => {
                        const newItin = [...formData.itinerary];
                        newItin[idx].desc = e.target.value;
                        setFormData({ ...formData, itinerary: newItin });
                      }}
                    />
                 </div>
               ))}
               <Button variant="outline" onClick={addItineraryDay} className="w-full h-14 rounded-2xl border-dashed border-sage/40 text-sage font-black gap-2">
                  <Plus size={20} /> Add Another Day
               </Button>
            </div>

            <div className="pt-8 flex justify-between">
              <Button onClick={prevStep} variant="outline" className="h-14 border-forest/10 text-forest px-12 rounded-2xl font-black gap-2">
                <ArrowLeft size={20} /> Back
              </Button>
              <Button onClick={nextStep} className="h-14 bg-forest text-white px-12 rounded-2xl font-black gap-2">
                Almost Done <ArrowRight size={20} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
            <h2 className="text-3xl font-black text-forest">Final Touches</h2>
            
            <div className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">What's Included?</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.included.map((item, idx) => (
                      <input 
                        key={idx}
                        type="text"
                        placeholder="e.g. All Meals"
                        className="p-4 bg-offwhite rounded-xl border-none focus:ring-2 focus:ring-sage/20 focus:outline-none font-bold"
                        value={item}
                        onChange={e => updateIncluded(idx, e.target.value)}
                      />
                    ))}
                    <Button variant="outline" onClick={addIncluded} className="h-[56px] rounded-xl border-dashed border-sage/40 text-sage font-black gap-2">
                       <Plus size={20} /> Add Item
                    </Button>
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cover Image</label>
                  <label className="block h-64 bg-offwhite rounded-[2rem] border-2 border-dashed border-sage/20 flex flex-col items-center justify-center text-sage gap-4 cursor-pointer hover:bg-sage/5 transition-colors relative overflow-hidden">
                     {formData.coverImage ? (
                       <img src={formData.coverImage} className="w-full h-full object-cover" alt="Cover" />
                     ) : (
                       <>
                        <ImageIcon size={48} />
                        <span className="font-bold text-center px-4">Upload high-res cover photo<br/><span className="text-[10px] font-medium opacity-60">(This will be the main thumbnail)</span></span>
                       </>
                     )}
                     <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                  </label>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trip Gallery</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm">
                        <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                        <button 
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <label 
                      className="aspect-square bg-offwhite rounded-2xl border-2 border-dashed border-sage/20 flex flex-col items-center justify-center text-sage gap-2 hover:bg-sage/5 transition-all cursor-pointer"
                    >
                      <Plus size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={addGalleryImage} />
                    </label>
                  </div>
               </div>

               <div className="p-8 bg-forest/5 rounded-[2rem] border border-sage/10">
                  <div className="flex gap-4">
                     <Users className="text-forest shrink-0" size={24} />
                     <div>
                        <h4 className="font-bold text-forest mb-2">Participant Limit</h4>
                        <p className="text-xs text-gray-500 font-medium mb-4">We recommend 8-12 people for the best tribal experience.</p>
                        <input 
                          type="range" min="2" max="20" 
                          className="w-full accent-forest" 
                          value={formData.maxParticipants} 
                          onChange={e => setFormData({...formData, maxParticipants: e.target.value})}
                        />
                        <div className="text-right mt-2 font-black text-forest">{formData.maxParticipants} People</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-8 flex justify-between">
              <Button onClick={prevStep} variant="outline" className="h-14 border-forest/10 text-forest px-12 rounded-2xl font-black gap-2">
                <ArrowLeft size={20} /> Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="h-14 bg-forest text-white px-12 rounded-2xl font-black gap-2 shadow-xl shadow-forest/20"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Publish Trip"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface PlaceAutocompleteProps {
  onPlaceSelect: (name: string, lat: number, lng: number) => void;
  defaultValue: string;
}

const PlaceAutocomplete = ({ onPlaceSelect, defaultValue }: PlaceAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const places = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["formatted_address", "geometry", "name"],
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelect(
          place.formatted_address || place.name || "",
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
        setInputValue(place.formatted_address || place.name || "");
      }
    });

    return () => {
      // Cleanup if needed (the SDK doesn't have a direct destroy but we can remove listeners)
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [places]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search for a destination..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="w-full p-4 pl-12 bg-offwhite rounded-2xl border-none focus:ring-2 focus:ring-sage/20 focus:outline-none font-bold"
    />
  );
};
