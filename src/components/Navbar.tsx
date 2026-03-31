import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import brandImage from "../assets/Cricket_logo.png";

const navItems = ["Home", "Live Scores", "Matches", "Groups", "Teams", "Points Table", "Videos", "Sponsors"];
const LIVE_SCORES_ROUTE = "/live-scores";
const REVEAL_MATCH_ROUTE = "/reveal-match";
const POINTS_TABLE_ROUTE = "/points-table";
const MATCHES_ROUTE = "/matches";
const GROUP_ROUTE = "/group";

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
      navigate("/", { state: { scrollTarget: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  const openPointsTable = () => {
    navigate(POINTS_TABLE_ROUTE);
    setOpen(false);
  };

  const openMatches = () => {
    navigate(MATCHES_ROUTE);
    setOpen(false);
  };

  const openLiveScores = () => {
    navigate(LIVE_SCORES_ROUTE);
    setOpen(false);
  };

  const openGroup = () => {
    navigate(GROUP_ROUTE);
    setOpen(false);
  };

  const revealMatch = () => {
    navigate(REVEAL_MATCH_ROUTE);
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[linear-gradient(180deg,rgba(222,218,210,0.96),rgba(210,201,182,0.94))] shadow-[0_8px_24px_rgba(80,71,41,0.2)] backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center pt-3">
          <img
            src={brandImage}
            alt="Brand logo"
            className="h-32 w-auto object-contain mix-blend-multiply contrast-125 saturate-125 brightness-95 drop-shadow-[0_4px_10px_rgba(80,71,41,0.22)] md:h-36"
          />
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() =>
                item === "Points Table"
                  ? openPointsTable()
                  : item === "Matches"
                    ? openMatches()
                    : item === "Groups"
                      ? openGroup()
                      : item === "Live Scores"
                        ? openLiveScores()
                        : scrollTo(item.toLowerCase().replace(/\s+/g, "-"))
              }
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item}
            </button>
          ))}
          <button
            onClick={revealMatch}
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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
            className="block w-full rounded-md py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Reveal Match
          </button>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() =>
                item === "Points Table"
                  ? openPointsTable()
                  : item === "Matches"
                    ? openMatches()
                    : item === "Groups"
                      ? openGroup()
                      : item === "Live Scores"
                        ? openLiveScores()
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
