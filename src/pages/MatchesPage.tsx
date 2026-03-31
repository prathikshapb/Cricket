import MatchesSection from "@/components/MatchesSection";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MatchesPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/group");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="relative">
        <button
          onClick={goBack}
          aria-label="Go back"
          className="group fixed left-4 top-4 z-50 rounded-full border border-primary/35 bg-[radial-gradient(circle_at_30%_30%,rgba(222,218,210,0.95),rgba(164,138,67,0.6))] p-2 shadow-[0_10px_22px_rgba(80,71,41,0.26),0_0_22px_rgba(164,138,67,0.34)] transition hover:scale-105 hover:shadow-[0_14px_28px_rgba(80,71,41,0.34),0_0_32px_rgba(164,138,67,0.44)]"
        >
          <ArrowLeft className="h-5 w-5 text-primary transition group-hover:-translate-x-0.5" />
        </button>
        <MatchesSection />
      </main>
      <Footer />
    </div>
  );
};

export default MatchesPage;
