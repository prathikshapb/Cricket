import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveScores from "@/components/LiveScores";
import MatchSetupSection from "@/components/MatchSetupSection";
import TeamsSection from "@/components/TeamsSection";
import MatchesSection from "@/components/MatchesSection";
import VideosSection from "@/components/VideosSection";
import SponsorsSection from "@/components/SponsorsSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MatchSetupSection />
      <LiveScores />
      <MatchesSection />
      <TeamsSection />
      <VideosSection />
      <SponsorsSection />
      <Footer />
    </div>
  );
};

export default Index;
