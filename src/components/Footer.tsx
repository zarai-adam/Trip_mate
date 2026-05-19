import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, Globe } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const links = {
    explore: [
      { name: "Browse adventures", href: "/explore" },
      { name: "Map explorer", href: "/map" },
      { name: "Global destinations", href: "/destinations" },
      { name: "Discover local experts", href: "/guides" },
      { name: "How it works", href: "/how-it-works" },
    ],
    community: [
      { name: "About our story", href: "/about" },
      { name: "Backpacker journal", href: "/blog" },
      { name: "Safety guidelines", href: "/safety" },
      { name: "Success stories", href: "/stories" },
      { name: "Partner with us", href: "/partner" },
    ],
    support: [
      { name: "Help center", href: "/help" },
      { name: "Contact support", href: "/contact" },
      { name: "Privacy policy", href: "/privacy" },
      { name: "Terms of service", href: "/terms" },
    ]
  };

  return (
    <footer id="footer" className="bg-white border-t border-gray-100 pt-16 md:pt-24 pb-8 md:pb-12 font-sans overflow-hidden">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 md:gap-16 mb-16 md:mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <Logo />
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-sm">
              Connecting travelers with verified local experts for authentic, life-changing group adventures across the globe.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-11 h-11 bg-gray-50 hover:bg-forest hover:text-white text-gray-400 rounded-xl flex items-center justify-center transition-all shadow-sm border border-transparent hover:shadow-md"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-dark dark:text-white">Adventure</h4>
            <ul className="space-y-4">
              {links.explore.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-gray-500 hover:text-forest transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-dark dark:text-white">Community</h4>
            <ul className="space-y-4">
              {links.community.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-gray-500 hover:text-forest transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-dark dark:text-white">Support</h4>
            <ul className="space-y-4">
              {links.support.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-gray-500 hover:text-forest transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-dark dark:text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Mail size={16} className="text-sage" />
                <span>hello@tripmate.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Globe size={16} className="text-sage" />
                <span>Explore worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 md:pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            © {currentYear} TripMate Adventures Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <Link to="/terms" className="text-xs text-gray-400 hover:text-forest transition-colors font-medium">Terms of Service</Link>
            <Link to="/privacy" className="text-xs text-gray-400 hover:text-forest transition-colors font-medium">Privacy Policy</Link>
            <Link to="/cookies" className="text-xs text-gray-400 hover:text-forest transition-colors font-medium">Cookie preference</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
