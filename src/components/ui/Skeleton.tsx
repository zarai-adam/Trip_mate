import React from "react";
import { motion } from "motion/react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  width, 
  height, 
  borderRadius = "0.5rem" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ 
        repeat: Infinity, 
        repeatType: "mirror", 
        duration: 1, 
        ease: "easeInOut" 
      }}
      className={`bg-gray-200 dark:bg-gray-700 ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export const TripCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
    <Skeleton height="200px" borderRadius="0" />
    <div className="p-6 space-y-4">
      <Skeleton width="80%" height="24px" />
      <div className="flex gap-2">
        <Skeleton width="40px" height="20px" borderRadius="10px" />
        <Skeleton width="40px" height="20px" borderRadius="10px" />
      </div>
      <div className="pt-4 flex justify-between items-center">
        <Skeleton width="60px" height="24px" />
        <Skeleton width="100px" height="40px" borderRadius="1rem" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-8 py-6 flex items-center gap-4">
      <Skeleton width="40px" height="40px" borderRadius="12px" />
      <div className="space-y-2">
        <Skeleton width="120px" height="16px" />
        <Skeleton width="80px" height="12px" />
      </div>
    </td>
    <td className="px-8 py-6"><Skeleton width="100px" height="16px" /></td>
    <td className="px-8 py-6"><Skeleton width="80px" height="16px" /></td>
    <td className="px-8 py-6"><Skeleton width="100px" height="24px" borderRadius="12px" /></td>
    <td className="px-8 py-6 text-right"><Skeleton width="40px" height="40px" borderRadius="12px" className="ml-auto" /></td>
  </tr>
);

export const DashboardStatSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
    <Skeleton width="48px" height="48px" borderRadius="12px" className="mb-6" />
    <Skeleton width="100px" height="12px" className="mb-2" />
    <Skeleton width="80px" height="32px" className="mb-2" />
    <Skeleton width="60px" height="12px" />
  </div>
);
