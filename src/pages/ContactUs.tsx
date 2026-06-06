import { useState } from "react";
import { motion } from "motion/react";
import { Send, Mail, MapPin, Phone, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/Toast";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/lib/api";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiFetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Failed to send message");

      setToast({
        message: "Message sent! We'll get back to you shortly.",
        type: "success",
        isVisible: true
      });
      reset();
    } catch (err: any) {
      setToast({
        message: err.message || "Something went wrong. Please try again.",
        type: "error",
        isVisible: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-offwhite min-h-screen font-sans">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
      />

      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-sage/5 rounded-full mb-8 border border-sage/10">
                 <HelpCircle size={14} className="text-forest" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-forest">Reach Out</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-forest uppercase tracking-tighter leading-[0.9] mb-8">LET'S <br/>CONNECT.</h1>
              <p className="text-gray-500 font-medium text-lg leading-relaxed italic">
                Got a question about a trip? Interested in becoming a guide? No matter the inquiry, our team is here for you.
              </p>
            </div>

            <div className="space-y-8">
               <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-forest shadow-sleek border border-gray-100 group-hover:bg-forest group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Email Support</p>
                    <p className="font-heading font-extrabold text-forest">hello@tripmate.app</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-forest shadow-sleek border border-gray-100 group-hover:bg-forest group-hover:text-white transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Our Basecamp</p>
                    <p className="font-heading font-extrabold text-forest">Marrakech, Morocco</p>
                  </div>
               </div>
               <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-forest shadow-sleek border border-gray-100 group-hover:bg-forest group-hover:text-white transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Crisis Hotline</p>
                    <p className="font-heading font-extrabold text-forest">+212 5XX-XXXXXX</p>
                  </div>
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sleek border border-gray-100"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    {...register("name", { required: true })}
                    className="w-full h-14 px-6 bg-offwhite rounded-2xl border-2 border-transparent focus:border-sage/20 focus:outline-none font-bold text-forest transition-all"
                    placeholder="Enter your name"
                  />
                  {errors.name && <span className="text-red-500 text-[10px] uppercase font-bold ml-1">Required</span>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    className="w-full h-14 px-6 bg-offwhite rounded-2xl border-2 border-transparent focus:border-sage/20 focus:outline-none font-bold text-forest transition-all"
                    placeholder="you@email.com"
                  />
                  {errors.email && <span className="text-red-500 text-[10px] uppercase font-bold ml-1">Invalid email</span>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                <input 
                  {...register("subject")}
                  className="w-full h-14 px-6 bg-offwhite rounded-2xl border-2 border-transparent focus:border-sage/20 focus:outline-none font-bold text-forest transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  {...register("message", { required: true })}
                  className="w-full h-48 p-6 bg-offwhite rounded-2xl border-2 border-transparent focus:border-sage/20 focus:outline-none font-bold text-forest transition-all resize-none"
                  placeholder="Tell us everything..."
                />
                {errors.message && <span className="text-red-500 text-[10px] uppercase font-bold ml-1">Required</span>}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-16 bg-forest text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-forest/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Message</>}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map or Decoration Section */}
      <section className="py-20 px-6">
         <div className="max-w-7xl mx-auto h-[400px] bg-sage/5 rounded-[4rem] border-4 border-white shadow-sleek flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale opacity-10 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"></div>
            <div className="relative z-10 flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-forest rounded-3xl flex items-center justify-center text-white shadow-xl animate-bounce-slow">
                 <MapPin size={32} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-forest">Marrakech HQ</span>
            </div>
         </div>
      </section>
    </div>
  );
}
