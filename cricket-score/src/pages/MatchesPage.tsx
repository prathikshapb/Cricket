import Navbar from "@/components/Navbar";
import MatchesSection from "@/components/MatchesSection";
import Footer from "@/components/Footer";

const MatchesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <MatchesSection />
      </main>
      <Footer />
    </div>
  );
};

export default MatchesPage;
