import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import { 
  Compass, 
  MapPin, 
  Languages, 
  Award, 
  Link as LinkIcon, 
  Camera,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const ApplyGuide = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    travelExperience: "",
    whyBecomeGuide: "",
    countriesVisited: "",
    languagesSpoken: "",
    specialties: "",
    portfolioUrls: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Logic for application submission
      const payload = {
        ...formData,
        userId: user.id,
        countriesVisited: formData.countriesVisited.split(",").map(i => i.trim()),
        languagesSpoken: formData.languagesSpoken.split(",").map(i => i.trim()),
        specialties: formData.specialties.split(",").map(i => i.trim()),
        portfolioUrls: formData.portfolioUrls.split(",").map(i => i.trim()),
      };

      const res = await apiFetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit application.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-2xl max-w-md text-center space-y-6"
        >
          <div className="w-20 h-20 bg-forest/10 rounded-3xl flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-forest" />
          </div>
          <h1 className="text-3xl font-black text-forest tracking-tight italic">APPLICATION SENT!</h1>
          <p className="text-gray-500 font-medium">
            Our admin team will review your travel history and expertise. You'll receive an email once your guide badge is ready.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="w-full bg-forest text-offwhite py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-forest-light transition-all shadow-xl shadow-forest/20"
          >
            Return to Explore
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage/10 rounded-full">
            <Award className="w-4 h-4 text-forest" />
            <span className="text-[10px] font-black uppercase tracking-widest text-forest">Verification Process</span>
          </div>
          <h1 className="text-5xl font-black text-forest tracking-tighter italic">START YOUR JOURNEY AS A GUIDE</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Share your passion for travel, lead local groups, and earn doing what you love.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-xl space-y-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-forest">
                <Compass className="w-4 h-4" />
                Tell us about your travel experience
              </label>
              <textarea 
                required
                className="w-full bg-offwhite border border-gray-100 rounded-2xl p-6 min-h-[150px] focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all font-medium text-forest"
                placeholder="Where have you been? What kind of trips have you led before?"
                value={formData.travelExperience}
                onChange={(e) => setFormData({ ...formData, travelExperience: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-forest">
                  <MapPin className="w-4 h-4" />
                  Countries Visited
                </label>
                <input 
                  type="text"
                  className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all"
                  placeholder="Chile, Japan, Italy..."
                  value={formData.countriesVisited}
                  onChange={(e) => setFormData({ ...formData, countriesVisited: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-forest">
                  <Languages className="w-4 h-4" />
                  Languages Spoken
                </label>
                <input 
                  type="text"
                  className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all"
                  placeholder="English, Spanish..."
                  value={formData.languagesSpoken}
                  onChange={(e) => setFormData({ ...formData, languagesSpoken: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-forest">
                <Camera className="w-4 h-4" />
                Specialties (separate by comma)
              </label>
              <input 
                type="text"
                className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all"
                placeholder="Hiking, Street Food, Night Photography..."
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-forest">
                <LinkIcon className="w-4 h-4" />
                Portfolio or Social Links
              </label>
              <input 
                type="text"
                className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all"
                placeholder="Instagram link, Blog URL..."
                value={formData.portfolioUrls}
                onChange={(e) => setFormData({ ...formData, portfolioUrls: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-forest">
                Why do you want to become a TripMate guide?
              </label>
              <textarea 
                required
                className="w-full bg-offwhite border border-gray-100 rounded-2xl p-6 min-h-[120px] focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all font-medium text-forest"
                placeholder="Your motivation and philosophy as a travel host..."
                value={formData.whyBecomeGuide}
                onChange={(e) => setFormData({ ...formData, whyBecomeGuide: e.target.value })}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-forest text-offwhite py-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-forest-light transition-all shadow-2xl shadow-forest/20 flex items-center justify-center gap-3"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyGuide;
