import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center space-y-6"
    >
      <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600">
        <Icon size={48} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-[#1a1a2e] dark:text-gray-100 uppercase tracking-tighter">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 bg-forest text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-forest/20 hover:scale-105 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};
