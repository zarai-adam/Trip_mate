import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/landing/HeroSection";
import TrustBar from "../components/landing/TrustBar";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import FeaturedTripsSection from "../components/landing/FeaturedTripsSection";
import WhyTripMateSection from "../components/landing/WhyTripMateSection";
import TopGuidesCarousel from "../components/landing/TopGuidesCarousel";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import DestinationsGrid from "../components/landing/DestinationsGrid";
import BecomeGuideCTA from "../components/landing/BecomeGuideCTA";
import NewsletterSection from "../components/landing/NewsletterSection";
import FooterSection from "../components/landing/FooterSection";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect Admin
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      }
    }
    
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-transparent font-sans overflow-x-hidden">
      <HeroSection />
      <TrustBar />
      <HowItWorksSection />
      <FeaturedTripsSection />
      <WhyTripMateSection />
      <TopGuidesCarousel />
      <TestimonialsSection />
      <DestinationsGrid />
      <BecomeGuideCTA />
      <NewsletterSection />
    </div>
  );
}
