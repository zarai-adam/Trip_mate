import React, { useState, useEffect } from "react";
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
  ArrowRight,
  Clock,
  ShieldAlert,
  Check,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

const ApplyGuide = () => {
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [personalApp, setPersonalApp] = useState<any>(null);
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

  // Fetch application status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await apiFetch("/api/admin/applications/my");
        if (res.ok) {
          const data = await res.json();
          setPersonalApp(data);
          if (data) {
            // Pre-fill form in case they want to re-submit or see what they entered
            setFormData({
              travelExperience: data.travelExperience || "",
              whyBecomeGuide: data.whyBecomeGuide || "",
              countriesVisited: Array.isArray(data.countriesVisited) ? data.countriesVisited.join(", ") : "",
              languagesSpoken: Array.isArray(data.languagesSpoken) ? data.languagesSpoken.join(", ") : "",
              specialties: Array.isArray(data.specialties) ? data.specialties.join(", ") : "",
              portfolioUrls: Array.isArray(data.portfolioUrls) ? data.portfolioUrls.join(", ") : ""
            });
          }
        }
      } catch (err) {
        console.error("Error fetching guide application status:", err);
      } finally {
        setLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const payload = {
        ...formData,
        userId: user.id,
        countriesVisited: formData.countriesVisited.split(",").map(i => i.trim()).filter(Boolean),
        languagesSpoken: formData.languagesSpoken.split(",").map(i => i.trim()).filter(Boolean),
        specialties: formData.specialties.split(",").map(i => i.trim()).filter(Boolean),
        portfolioUrls: formData.portfolioUrls.split(",").map(i => i.trim()).filter(Boolean),
      };

      const res = await apiFetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setPersonalApp(data);
        setIsSuccess(true);
      } else {
        alert("Failed to submit application.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit application.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetApplication = async () => {
    if (!window.confirm("Are you sure you want to start a new application? This will clear your previous application.")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/admin/applications/my", {
        method: "DELETE"
      });
      if (res.ok) {
        setPersonalApp(null);
        setIsSuccess(false);
      } else {
        alert("Failed to reset application.");
      }
    } catch (err) {
      console.error(err);
      alert("Error resetting application.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncApprovedRole = async () => {
    setIsLoading(true);
    try {
      // Fetch private profile to sync local storage with updated user schema role
      const res = await apiFetch("/api/users/me/private");
      if (res.ok) {
        const latestUser = await res.json();
        const updatedUserObj = {
          ...latestUser,
          name: `${latestUser.firstName} ${latestUser.lastName}`.trim()
        };
        localStorage.setItem("user", JSON.stringify(updatedUserObj));
        window.dispatchEvent(new Event("user-profile-updated"));
        navigate("/guide/dashboard");
      }
    } catch (err) {
      console.error("Error syncing role:", err);
      // Fallback
      const cached = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...cached, role: "GUIDE" }));
      window.dispatchEvent(new Event("user-profile-updated"));
      navigate("/guide/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingStatus) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-forest border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-[10px] font-black text-forest uppercase tracking-widest animate-pulse">Checking Status...</div>
      </div>
    );
  }

  if (personalApp) {
    const isApproved = personalApp.status === "APPROVED";
    const isRejected = personalApp.status === "REJECTED";
    const isPending = personalApp.status === "PENDING";

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage/10 rounded-full">
            <Award className="w-3.5 h-3.5 text-forest" />
            <span className="text-[9px] font-black uppercase tracking-widest text-forest">Verification Center</span>
          </div>
          <h1 className="text-3xl font-black text-forest tracking-tight">Guide Application Status</h1>
          <p className="text-gray-500 font-medium text-sm">
            Track and manage your verification path from explorer to local guide.
          </p>
        </header>

        {isPending && (
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-10">
            {/* Horizontal Timeline */}
            <div className="relative flex justify-between items-center max-w-xl mx-auto">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-10 rounded-full" />
              <div className="absolute left-0 w-1/2 top-1/2 -translate-y-1/2 h-1 bg-forest -z-10 rounded-full" />
              
              {/* Point 1 */}
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center shadow-lg shadow-forest/20">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-forest">Submitted</span>
              </div>

              {/* Point 2 */}
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className="w-10 h-10 rounded-full bg-sage text-white flex items-center justify-center shadow-lg shadow-sage/20 animate-pulse">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sage">Under Review</span>
              </div>

              {/* Point 3 */}
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Approval</span>
              </div>
            </div>

            <div className="p-6 bg-accent/20 rounded-2xl border border-forest/5 flex items-start gap-4">
              <Clock className="w-8 h-8 text-forest shrink-0 mt-1" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-forest">Application Received</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Our core routing division is scanning your portfolio links, verified country checklists, and narrative responses. We usually complete audits within 24–48 hours. Let's make sure you stand by for notifications!
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">What You Submitted</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs text-gray-400 font-bold block mb-1">Travel Experience</span>
                  <p className="text-forest font-semibold line-clamp-3">{personalApp.travelExperience}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-bold block mb-1">Why Become a Guide</span>
                  <p className="text-forest font-semibold line-clamp-3">{personalApp.whyBecomeGuide}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-2xl text-center space-y-8">
            <div className="w-24 h-24 bg-forest/10 rounded-3xl flex items-center justify-center mx-auto">
              <Award className="w-12 h-12 text-forest animate-bounce" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-forest tracking-tighter italic">YOU'RE A VERIFIED GUIDE!</h2>
              <p className="text-gray-500 font-medium max-w-md mx-auto">
                Congratulations! Our moderation desk approved your guide application. Your profile is loaded with guide credentials and trip construction rights.
              </p>
            </div>
            
            <button 
              onClick={handleSyncApprovedRole}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-signature text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-forest/20 flex items-center gap-2 mx-auto"
            >
              {isLoading ? "Synchronizing..." : "Enter Guide Dashboard"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {isRejected && (
          <div className="bg-white p-10 rounded-[32px] border border-red-100 shadow-xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-red-950 tracking-tight">Application Declined</h2>
                <p className="text-xs text-gray-400 font-bold">Feedback from TripMate verification division</p>
              </div>
            </div>

            <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100 text-sm">
              <h3 className="font-black text-red-900 mb-1">Reason for Rejection:</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                {personalApp.reviewNotes || "Your submission did not provide sufficient detail regarding previous group tour leading experience or social credentials. Please supply clear links to active travel reviews/portfolio sites."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-8 mt-4">
              <button 
                onClick={handleResetApplication}
                disabled={isLoading}
                className="flex-1 bg-forest text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-forest-light transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Update Profile & Re-apply
              </button>
              <button 
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-50 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all text-center"
              >
                Go Back to My Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-2xl max-w-md text-center space-y-6 mx-auto my-10">
        <div className="w-20 h-20 bg-forest/10 rounded-3xl flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-forest animate-pulse" />
        </div>
        <h1 className="text-3xl font-black text-forest tracking-tight italic">APPLICATION SENT!</h1>
        <p className="text-gray-500 font-medium">
          Our core audit desk has logged your response. You can follow your application's status in this menu tab anytime!
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-forest text-offwhite py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-forest-light transition-all shadow-xl shadow-forest/20"
        >
          Track Progress
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="mb-4 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage/10 rounded-full">
          <Award className="w-3.5 h-3.5 text-forest" />
          <span className="text-[9px] font-black uppercase tracking-widest text-forest">Verification Process</span>
        </div>
        <h1 className="text-3xl font-black text-forest tracking-tighter italic">START YOUR JOURNEY AS A GUIDE</h1>
        <p className="text-gray-500 text-sm font-medium">
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
              className="w-full bg-offwhite border border-gray-100 rounded-2xl p-6 min-h-[150px] focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all font-medium text-forest text-sm"
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
                required
                className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all text-sm font-semibold text-forest"
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
                required
                className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all text-sm font-semibold text-forest"
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
              required
              className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all text-sm font-semibold text-forest"
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
              required
              className="w-full bg-offwhite border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all text-sm font-semibold text-forest"
              placeholder="Instagram link, Blog URL..."
              value={formData.portfolioUrls}
              onChange={(e) => setFormData({ ...formData, portfolioUrls: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-forest block">
              Why do you want to become a TripMate guide?
            </label>
            <textarea 
              required
              className="w-full bg-offwhite border border-gray-100 rounded-2xl p-6 min-h-[120px] focus:ring-2 focus:ring-sage/20 focus:outline-none transition-all font-medium text-forest text-sm"
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
  );
};

export default ApplyGuide;
