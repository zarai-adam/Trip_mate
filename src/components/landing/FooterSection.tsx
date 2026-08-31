import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, Heart } from "lucide-react";
import Logo from "../Logo";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-soft pt-32 pb-12 border-t border-border-dim">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-24">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2 space-y-8">
            <Logo />
            <p className="text-lg text-foreground-muted font-medium italic max-w-sm leading-relaxed">
              Travel with someone who's actually been there. The community-led platform for authentic group adventures.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 bg-background rounded-2xl border border-border-dim flex items-center justify-center text-foreground-muted hover:bg-gradient-signature hover:text-white hover:scale-110 transition-all shadow-sm"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground border-b border-border-dim pb-4">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/explore" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Browse Trips</Link></li>
              <li><Link to="/guides" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Find Guides</Link></li>
              <li><Link to="/explore" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link to="/explore?price=0" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Free Trips</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground border-b border-border-dim pb-4">Guides</h4>
            <ul className="space-y-4">
              <li><Link to="/register?role=guide" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Become a Guide</Link></li>
              <li><Link to="/how-it-works" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="/guide-resources" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Guide Resources</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground border-b border-border-dim pb-4">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/about" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Our Mission</Link></li>
              <li><Link to="/contact" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="text-sm font-bold text-foreground-muted hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-forest transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-forest transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-forest transition-colors">Cookie Policy</Link>
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              © {currentYear} Roamigo. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              Made with <Heart size={12} className="text-red-500 fill-red-500" /> for backpackers
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
