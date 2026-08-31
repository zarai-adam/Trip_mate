import React from "react";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showTagline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", iconSize = 22, showTagline = true }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 md:gap-3 group ${className}`}>
      <div className="w-10 h-10 bg-gradient-signature rounded-xl flex items-center justify-center text-white shadow-lg shadow-forest/10 transform group-hover:rotate-[20deg] transition-transform duration-500">
        <Compass size={iconSize} className="drop-shadow-md" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-black text-foreground tracking-tighter uppercase leading-none">
          Roamigo
        </span>
        {showTagline && (
          <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] leading-none mt-1">
            Explore Local
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
