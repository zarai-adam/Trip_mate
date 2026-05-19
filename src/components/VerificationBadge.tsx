import { ShieldCheck, ShieldAlert, BadgeCheck, Star } from "lucide-react";

interface VerificationBadgeProps {
  user: {
    emailVerified?: boolean;
    role?: string;
    guideProfileStatus?: string;
    tripCount?: number;
    ratingAverage?: number;
  };
  size?: number;
  showText?: boolean;
}

export default function VerificationBadge({ user, size = 16, showText = false }: VerificationBadgeProps) {
  // Logic for Tiers:
  // Basic: email verified
  // Verified Guide: role === GUIDE && (we'll assume status ACTIVE for now as proxy for application approved)
  // Pro Guide: 10+ trips, 4.5+ rating
  // Top Guide: 25+ trips, 4.8+ rating
  
  const tripCount = user.tripCount || 0;
  const rating = user.ratingAverage || 0;
  const isGuide = user.role === "GUIDE";

  if (isGuide && tripCount >= 25 && rating >= 4.8) {
    return (
      <div className="flex items-center gap-1.5" title="Top Guide: Expert with exceptional reviews">
        <Star size={size} className="text-yellow-500 fill-yellow-500" />
        {showText && <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600">Top Guide</span>}
      </div>
    );
  }

  if (isGuide && tripCount >= 10 && rating >= 4.5) {
    return (
      <div className="flex items-center gap-1.5" title="Pro Guide: Experienced with great reviews">
        <BadgeCheck size={size} className="text-forest" />
        {showText && <span className="text-[10px] font-black uppercase tracking-widest text-forest">Pro Guide</span>}
      </div>
    );
  }

  if (isGuide) {
    return (
      <div className="flex items-center gap-1.5" title="Verified Guide: Application approved">
        <ShieldCheck size={size} className="text-sage" />
        {showText && <span className="text-[10px] font-black uppercase tracking-widest text-sage">Verified Guide</span>}
      </div>
    );
  }

  if (user.emailVerified) {
    return (
      <div className="flex items-center gap-1.5" title="Email Verified">
        <ShieldCheck size={size} className="text-gray-400" />
        {showText && <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Basic</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 opacity-50" title="Unverified Account">
      <ShieldAlert size={size} className="text-gray-300" />
      {showText && <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Unverified</span>}
    </div>
  );
}
