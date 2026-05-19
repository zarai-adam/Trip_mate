import { useState } from "react";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiFetch } from "@/lib/api";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "TRIP" | "USER";
  targetId: string;
  targetName: string;
}

export default function ReportModal({ isOpen, onClose, targetType, targetId, targetName }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reasons = [
    "Misleading info",
    "Safety concern",
    "Inappropriate content",
    "Spam",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    
    setIsSubmitting(true);
    try {
      const res = await apiFetch("/api/reports", {
        method: "POST",
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          description
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setReason("");
          setDescription("");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to submit report", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
          >
            {isSuccess ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-sage/20 rounded-full flex items-center justify-center mx-auto text-sage">
                  <ShieldAlert size={40} />
                </div>
                <h2 className="text-3xl font-black text-forest">Report Submitted</h2>
                <p className="text-gray-500 font-medium italic">Our moderation team will review this {targetType.toLowerCase()} within 24 hours. Thank you for keeping us safe!</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={onClose}
                  className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-forest">Report this {targetType.toLowerCase()}</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{targetName}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Reason for Reporting</label>
                    <div className="grid grid-cols-2 gap-3">
                      {reasons.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReason(r)}
                          className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            reason === r 
                              ? "bg-red-50 border-red-200 text-red-500" 
                              : "bg-offwhite border-gray-100 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Additional Context (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please provide more details about your concern..."
                      className="w-full bg-offwhite border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-red-100 min-h-[120px] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !reason}
                    className="w-full bg-red-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </button>

                  <p className="text-center text-[10px] text-gray-400 font-bold leading-relaxed px-10">
                    False reporting is a violation of our community standards and may lead to account suspension.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
