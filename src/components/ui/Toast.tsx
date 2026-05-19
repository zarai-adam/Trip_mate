import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm"
        >
          <div className={`mx-4 p-4 rounded-[2rem] shadow-2xl border flex items-center justify-between gap-4 backdrop-blur-md ${
            type === "success" 
              ? "bg-forest/90 border-forest text-white" 
              : "bg-red-500/90 border-red-600 text-white"
          }`}>
            <div className="flex items-center gap-3">
              {type === "success" ? (
                <CheckCircle2 size={24} className="shrink-0" />
              ) : (
                <AlertCircle size={24} className="shrink-0" />
              )}
              <p className="font-bold text-sm tracking-tight">{message}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
