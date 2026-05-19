import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Camera, 
  MapPin, 
  Languages, 
  Globe, 
  Shield, 
  Bell, 
  Lock, 
  Trash2, 
  Save,
  CheckCircle2,
  XCircle,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { Toast } from "@/components/ui/Toast";

export default function UserProfileEdit() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    country: "",
    tagline: "",
    phoneNumber: "",
    avatarUrl: "",
    coverUrl: "",
    languages: [] as string[],
    countriesVisited: [] as string[],
    specialties: [] as string[],
    travelPhilosophy: ""
  });

  const [langInput, setLangInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiFetch("/api/users/me/private");
        const data = await res.json();
        setUser(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          bio: data.bio || "",
          country: data.country || "",
          tagline: data.tagline || "",
          phoneNumber: data.phoneNumber || "",
          avatarUrl: data.avatarUrl || "",
          coverUrl: data.coverUrl || "",
          languages: data.languages || [],
          countriesVisited: data.countriesVisited || [],
          specialties: data.specialties || [],
          travelPhilosophy: data.travelPhilosophy || ""
        });
      } catch (err) {
        console.error("Failed to fetch own profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("user", JSON.stringify(updated));
        showToast("Profile updated successfully!", "success");
      } else {
        showToast("Failed to update profile", "error");
      }
    } catch (err) {
      showToast("An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: "languages" | "countriesVisited" | "specialties", value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    if (formData[field].includes(value.trim())) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter("");
  };

  const removeItem = (field: "languages" | "countriesVisited" | "specialties", value: string) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter(i => i !== value) }));
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
       <Toast 
         message={toast.message} 
         type={toast.type} 
         isVisible={toast.isVisible} 
         onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
       />
       <div>
          <h1 className="text-4xl font-black text-forest mb-2">My Profile</h1>
          <p className="text-gray-400 font-medium">Manage your public presence and account settings.</p>
       </div>

       <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 space-y-2">
             {[
               { id: "profile", label: "Public Profile", icon: <User size={20} /> },
               { id: "account", label: "Account Settings", icon: <Shield size={20} /> },
               { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
               { id: "security", label: "Security", icon: <Lock size={20} /> },
             ].map(item => (
               <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === item.id 
                    ? "bg-forest text-white shadow-xl shadow-forest/10" 
                    : "text-gray-400 hover:bg-forest/5 hover:text-forest"
                }`}
               >
                  {item.icon} {item.label}
               </button>
             ))}
          </div>

          {/* Main Form Area */}
          <div className="flex-1">
             <div className="bg-white rounded-[2.5rem] border border-sage/10 shadow-sleek overflow-hidden">
                <form onSubmit={handleSave}>
                   {activeTab === "profile" && (
                     <div className="p-10 space-y-12">
                        {/* Images Section */}
                        <div className="space-y-8">
                           <h3 className="text-xl font-black text-forest border-b border-sage/10 pb-4 flex items-center gap-2">
                              <Camera size={20} /> Profile Visuals
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Avatar</label>
                                 <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-3xl bg-sage/10 overflow-hidden border-2 border-forest/10">
                                       <img src={formData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.firstName}`} alt="" />
                                    </div>
                                    <div className="flex-1">
                                       <input 
                                          type="text" 
                                          name="avatarUrl"
                                          placeholder="URL to your avatar image"
                                          value={formData.avatarUrl}
                                          onChange={handleChange}
                                          className="w-full bg-offwhite border border-sage/10 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-forest/10 outline-none" 
                                       />
                                       <p className="text-[10px] text-gray-400 mt-2 italic">Square images (800x800) work best.</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cover Photo</label>
                                 <div className="h-24 w-full bg-sage/5 rounded-3xl border border-sage/10 overflow-hidden relative group">
                                    {formData.coverUrl && <img src={formData.coverUrl} className="w-full h-full object-cover opacity-50" alt="" />}
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                       <input 
                                          type="text" 
                                          name="coverUrl"
                                          placeholder="URL to cover photo"
                                          value={formData.coverUrl}
                                          onChange={handleChange}
                                          className="w-full bg-white/80 backdrop-blur-sm border border-forest/10 rounded-xl px-4 h-10 text-xs focus:ring-2 focus:ring-forest/10 outline-none" 
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-8">
                           <h3 className="text-xl font-black text-forest border-b border-sage/10 pb-4 flex items-center gap-2">
                              <User size={20} /> Basic Information
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                 <input 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full bg-offwhite border border-sage/10 rounded-2xl px-6 h-14 font-bold text-forest focus:ring-4 focus:ring-forest/5 outline-none" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                 <input 
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-offwhite border border-sage/10 rounded-2xl px-6 h-14 font-bold text-forest focus:ring-4 focus:ring-forest/5 outline-none" 
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profile Tagline</label>
                                 <input 
                                    name="tagline"
                                    placeholder="A short punchy line for your profile"
                                    value={formData.tagline}
                                    onChange={handleChange}
                                    className="w-full bg-offwhite border border-sage/10 rounded-2xl px-6 h-14 font-bold text-forest focus:ring-4 focus:ring-forest/5 outline-none" 
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Biography</label>
                                 <textarea 
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full bg-offwhite border border-sage/10 rounded-[2rem] p-6 font-medium text-gray-600 focus:ring-4 focus:ring-forest/5 outline-none resize-none"
                                    placeholder="Tell your story..."
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Experience Section */}
                        <div className="space-y-8">
                           <h3 className="text-xl font-black text-forest border-b border-sage/10 pb-4 flex items-center gap-2">
                              <Globe size={20} /> Travel Expertise
                           </h3>
                           <div className="space-y-10">
                              {/* Countries */}
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Countries Visited</label>
                                 <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.countriesVisited.map(c => (
                                      <span key={c} className="px-4 py-1.5 bg-forest text-sand rounded-xl text-xs font-bold flex items-center gap-2">
                                         {c} <button type="button" onClick={() => removeItem("countriesVisited", c)} className="hover:text-white"><Hash size={12} /></button>
                                      </span>
                                    ))}
                                 </div>
                                 <div className="flex gap-3">
                                    <input 
                                       value={countryInput}
                                       onChange={(e) => setCountryInput(e.target.value)}
                                       placeholder="Add country..."
                                       className="flex-1 bg-offwhite border border-sage/10 rounded-xl px-6 h-12 font-bold text-forest text-sm" 
                                    />
                                    <Button 
                                       type="button" 
                                       onClick={() => addItem("countriesVisited", countryInput, setCountryInput)}
                                       className="bg-forest text-white h-12 px-6 rounded-xl font-bold"
                                    >Add</Button>
                                 </div>
                              </div>

                              {/* Languages */}
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Languages Spoken</label>
                                 <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.languages.map(l => (
                                      <span key={l} className="px-4 py-1.5 bg-sand text-forest rounded-xl text-xs font-bold flex items-center gap-2 border border-forest/10">
                                         {l} <button type="button" onClick={() => removeItem("languages", l)} className="hover:text-sage"><XCircle size={12} /></button>
                                      </span>
                                    ))}
                                 </div>
                                 <div className="flex gap-3">
                                    <input 
                                       value={langInput}
                                       onChange={(e) => setLangInput(e.target.value)}
                                       placeholder="Add language..."
                                       className="flex-1 bg-offwhite border border-sage/10 rounded-xl px-6 h-12 font-bold text-forest text-sm" 
                                    />
                                    <Button 
                                       type="button" 
                                       onClick={() => addItem("languages", langInput, setLangInput)}
                                       className="bg-forest text-white h-12 px-6 rounded-xl font-bold"
                                    >Add</Button>
                                 </div>
                              </div>

                              {/* Specialties */}
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialties & Hobbies</label>
                                 <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.specialties.map(s => (
                                      <span key={s} className="px-4 py-1.5 bg-sage/10 text-sage rounded-xl text-xs font-bold flex items-center gap-2 border border-sage/20">
                                         {s} <button type="button" onClick={() => removeItem("specialties", s)} className="hover:text-forest"><XCircle size={12} /></button>
                                      </span>
                                    ))}
                                 </div>
                                 <div className="flex gap-3">
                                    <input 
                                       value={specialtyInput}
                                       onChange={(e) => setSpecialtyInput(e.target.value)}
                                       placeholder="e.g. Photography, Cooking, Hiking..."
                                       className="flex-1 bg-offwhite border border-sage/10 rounded-xl px-6 h-12 font-bold text-forest text-sm" 
                                    />
                                    <Button 
                                       type="button" 
                                       onClick={() => addItem("specialties", specialtyInput, setSpecialtyInput)}
                                       className="bg-forest text-white h-12 px-6 rounded-xl font-bold"
                                    >Add</Button>
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Travel Philosophy</label>
                                 <textarea 
                                    name="travelPhilosophy"
                                    rows={3}
                                    value={formData.travelPhilosophy}
                                    onChange={handleChange}
                                    className="w-full bg-offwhite border border-sage/10 rounded-[2rem] p-6 font-serif italic text-forest focus:ring-4 focus:ring-forest/5 outline-none resize-none"
                                    placeholder="Your favorite quote or belief about travel..."
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === "account" && (
                     <div className="p-10 space-y-12 min-h-[500px]">
                        <h3 className="text-xl font-black text-forest border-b border-sage/10 pb-4 flex items-center gap-2">
                           <Shield size={20} /> Account Settings
                        </h3>
                        <div className="space-y-8">
                           <div className="flex items-center justify-between p-8 bg-offwhite rounded-3xl border border-sage/10">
                              <div>
                                 <h4 className="font-black text-forest mb-1">Deactivate Account</h4>
                                 <p className="text-xs text-gray-400 font-medium">Temporarily hide your profile and trips from everyone.</p>
                              </div>
                              <Button variant="outline" className="text-red-500 border-red-100 hover:bg-red-50 rounded-xl font-bold">Deactivate</Button>
                           </div>

                           <div className="flex items-center justify-between p-8 bg-offwhite rounded-3xl border border-sage/10">
                              <div>
                                 <h4 className="font-black text-forest mb-1">Trip Discovery</h4>
                                 <p className="text-xs text-gray-400 font-medium">Allow your profile to be recommended to new travelers.</p>
                              </div>
                              <div className="w-12 h-6 bg-forest rounded-full relative p-1 cursor-pointer">
                                 <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === "notifications" && (
                     <div className="p-10 space-y-12 min-h-[500px]">
                        <h3 className="text-xl font-black text-forest border-b border-sage/10 pb-4 flex items-center gap-2">
                           <Bell size={20} /> Notification Preferences
                        </h3>
                        <div className="space-y-6">
                           {[
                              { label: "New Booking Requests", desc: "Get notified when someone wants to join your trip." },
                              { label: "Direct Messages", desc: "Alerts for new chat messages from travelers or guides." },
                              { label: "Trip Updates", desc: "Changes to trips you are following or booked on." },
                              { label: "Marketing & News", desc: "Stay up to date with new features and travel tips." }
                           ].map((pref, i) => (
                              <div key={i} className="flex items-center justify-between p-6 bg-offwhite rounded-3xl border border-sage/10">
                                 <div>
                                    <h4 className="font-bold text-forest text-sm mb-0.5">{pref.label}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">{pref.desc}</p>
                                 </div>
                                 <div className={`w-12 h-6 ${i < 3 ? "bg-forest" : "bg-gray-200"} rounded-full relative p-1 cursor-pointer transition-colors`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm ${i < 3 ? "ml-auto" : "ml-0"} transition-all`}></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {activeTab === "security" && (
                     <div className="p-10 space-y-12 min-h-[500px]">
                        <h3 className="text-xl font-black text-forest border-b border-sage/10 pb-4 flex items-center gap-2">
                           <Lock size={20} /> Security & Password
                        </h3>
                        <div className="max-w-md space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                              <input type="password" className="w-full bg-offwhite border border-sage/10 rounded-xl px-6 h-12" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                              <input type="password" className="w-full bg-offwhite border border-sage/10 rounded-xl px-6 h-12" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                              <input type="password" className="w-full bg-offwhite border border-sage/10 rounded-xl px-6 h-12" />
                           </div>
                           <Button type="button" className="bg-forest text-white px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-xs">Update Password</Button>
                        </div>

                        <div className="pt-12 border-t border-sage/10">
                           <Button variant="outline" className="text-red-500 border-red-100 hover:bg-red-50 flex items-center gap-2 rounded-xl">
                              <Trash2 size={16} /> Delete Account Permanently
                           </Button>
                        </div>
                     </div>
                   )}

                   {/* Footer Actions */}
                   <div className="p-8 bg-offwhite border-t border-sage/10 flex justify-end gap-4">
                      <Button type="button" variant="ghost" className="rounded-xl font-bold px-8">Discard Changes</Button>
                      <Button 
                         type="submit" 
                         disabled={saving}
                         className="bg-forest text-white px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-forest/20"
                      >
                         {saving ? "Saving..." : <><Save size={18} /> Save Profile</>}
                      </Button>
                   </div>
                </form>
             </div>
          </div>
       </div>
    </div>
  );
}
