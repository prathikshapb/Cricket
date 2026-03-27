import { useState } from "react";
import { Menu, X, Trophy } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = ["Home", "Live Scores", "Matches", "Teams", "Points Table", "Videos", "Sponsors"];
const REVEAL_SECTION_ID = "match-setup";
const POINTS_TABLE_ROUTE = "/points-table";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    if (id === "home") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setOpen(false);
      return;
    }

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  const openPointsTable = () => {
    navigate(POINTS_TABLE_ROUTE);
    setOpen(false);
  };

  const revealMatch = () => {
    if (location.pathname !== "/") {
      navigate(`/#${REVEAL_SECTION_ID}`);
    } else {
      scrollTo(REVEAL_SECTION_ID);
    }
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-7 h-7 text-primary" />
          <span className="font-heading text-2xl font-bold text-gradient-gold">IPL 2026</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() =>
                item === "Points Table"
                  ? openPointsTable()
                  : scrollTo(item.toLowerCase().replace(/\s+/g, "-"))
              }
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item}
            </button>
          ))}
          <button
            onClick={revealMatch}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Reveal Match
          </button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3">
          <button
            onClick={revealMatch}
            className="block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Reveal Match
          </button>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() =>
                item === "Points Table"
                  ? openPointsTable()
                  : scrollTo(item.toLowerCase().replace(/\s+/g, "-"))
              }
              className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
