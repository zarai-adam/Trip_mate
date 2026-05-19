import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  Lock, 
  User, 
  Shield, 
  Trash2, 
  Save, 
  Loader2,
  Eye,
  MessageSquare,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/Toast";

interface UserSettings {
  notifications: {
    emails: boolean;
    push: boolean;
    marketing: boolean;
    chat: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showLocation: boolean;
    whoCanMessage: 'ANYONE' | 'GUIDES_ONLY' | 'NO_ONE';
  };
}

export default function UserSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: { emails: true, push: true, marketing: false, chat: true },
    privacy: { profilePublic: true, showLocation: true, whoCanMessage: 'ANYONE' }
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  useEffect(() => {
    // Simulate fetching settings or fetch from actual endpoint
    // Fallback to defaults if fetch fails
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Logic for saving to a new specific endpoint or profile endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating
      setToast({ message: "Settings updated successfully!", type: "success", isVisible: true });
    } catch (err) {
      setToast({ message: "Failed to update settings.", type: "error", isVisible: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center p-20">
         <Loader2 className="animate-spin text-forest" size={32} />
       </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-sage/10 shadow-sleek relative overflow-hidden">
        <div>
          <h1 className="text-3xl font-heading font-black text-forest uppercase tracking-tighter">Command Center</h1>
          <p className="text-gray-400 text-sm font-medium italic">Customize your territory and communication flows.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-forest text-white h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-forest/20 flex items-center gap-3"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Notification Settings */}
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="bg-white p-10 rounded-[3rem] border border-sage/10 shadow-sm space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center text-forest">
              <Bell size={20} />
            </div>
            <h3 className="text-xl font-heading font-black text-forest uppercase tracking-tight">Notifications</h3>
          </div>

          <div className="space-y-6">
            <ToggleItem 
              title="Email Notifications" 
              desc="Daily updates, booking confirmations, and summaries." 
              enabled={settings.notifications.emails}
              onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, emails: v}})}
            />
            <ToggleItem 
              title="Push Notifications" 
              desc="Real-time alerts for messages and trip updates." 
              enabled={settings.notifications.push}
              onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, push: v}})}
            />
            <ToggleItem 
              title="New Messages" 
              desc="Notify when someone sends a direct or group message." 
              enabled={settings.notifications.chat}
              onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, chat: v}})}
            />
            <ToggleItem 
              title="Marketing & Tips" 
              desc="Periodic backpacker insights and special offers." 
              enabled={settings.notifications.marketing}
              onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, marketing: v}})}
            />
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="bg-white p-10 rounded-[3rem] border border-sage/10 shadow-sm space-y-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-forest/5 rounded-2xl flex items-center justify-center text-forest">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-heading font-black text-forest uppercase tracking-tight">Privacy</h3>
          </div>

          <div className="space-y-6">
            <ToggleItem 
              title="Public Profile" 
              desc="Allow others to see your travel history and bio." 
              enabled={settings.privacy.profilePublic}
              onChange={(v) => setSettings({...settings, privacy: {...settings.privacy, profilePublic: v}})}
            />
            <ToggleItem 
              title="Current Location" 
              desc="Show your approximate territory to potential tribe mates." 
              enabled={settings.privacy.showLocation}
              onChange={(v) => setSettings({...settings, privacy: {...settings.privacy, showLocation: v}})}
            />
            
            <div className="pt-4 border-t border-gray-100">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-4 block">Who can message me?</label>
               <select 
                value={settings.privacy.whoCanMessage}
                onChange={(e) => setSettings({...settings, privacy: {...settings.privacy, whoCanMessage: e.target.value as any}})}
                className="w-full h-12 px-4 rounded-xl bg-offwhite border-2 border-transparent focus:border-sage/20 font-bold text-forest transition-all"
               >
                 <option value="ANYONE">Anyone</option>
                 <option value="GUIDES_ONLY">Verified Guides Only</option>
                 <option value="NO_ONE">Nobody</option>
               </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Account Management */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-red-50 p-10 rounded-[3rem] border border-red-100 space-y-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
            <Lock size={20} />
          </div>
          <h3 className="text-xl font-heading font-black text-red-600 uppercase tracking-tight">Account Safety</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
           <button className="flex-1 h-14 bg-white border border-red-200 text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition-all">Change Password</button>
           <button className="flex-1 h-14 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-600/20 hover:scale-[1.02] flex items-center justify-center gap-2">
              <Trash2 size={16} /> Delete My Data
           </button>
        </div>
      </motion.div>
    </div>
  );
}

function ToggleItem({ title, desc, enabled, onChange }: { title: string; desc: string, enabled: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-6 group">
      <div>
        <h4 className="font-bold text-forest group-hover:text-sage transition-colors">{title}</h4>
        <p className="text-gray-400 text-[10px] font-medium italic">{desc}</p>
      </div>
      <button 
        onClick={() => onChange(!enabled)}
        className={`w-14 h-8 rounded-full relative transition-colors duration-300 flex-shrink-0 ${enabled ? 'bg-forest' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${enabled ? 'left-7' : 'left-1'}`}></div>
      </button>
    </div>
  );
}
