import { motion } from "motion/react";
import { WifiOff, Home, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite dark:bg-gray-900 px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-[2rem] flex items-center justify-center mx-auto text-red-500"
        >
          <WifiOff size={48} />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-forest dark:text-gray-100 tracking-tighter italic uppercase">You&apos;re Offline</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
            Adventure doesn&apos;t always have Wi-Fi, but your connection does. Some features may not work until you&apos;re back online.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button 
            onClick={() => window.location.reload()}
            className="w-full h-16 bg-forest text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-forest/20 flex items-center justify-center gap-3"
          >
            <RefreshCw size={16} /> Retry Connection
          </Button>
          
          <Link to="/">
            <Button 
              variant="outline" 
              className="w-full h-16 rounded-2xl border-2 border-forest/10 dark:border-gray-800 text-forest dark:text-gray-100 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3"
            >
              <Home size={16} /> Back to Home
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          Check your network settings and try again
        </p>
      </div>
    </div>
  );
}
