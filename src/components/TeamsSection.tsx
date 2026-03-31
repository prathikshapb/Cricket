import { useEffect, useState } from "react";
import { TEAM_SQUADS } from "@/data/teamSquads";

type TeamMember = {
  name: string;
  role: string;
  info: string;
  img: string;
};

type Team = {
  name: string;
  short: string;
  captain: string;
  members: TeamMember[];
};

const teams = TEAM_SQUADS as Team[];

const CARD_COLORS = [
  "#A48A43",
  "#8F7A3B",
  "#B57A45",
  "#7E6A34",
  "#9A7F3F",
  "#6F5F31",
  "#A06E3C",
  "#8A5A2B",
];

const initialsFromName = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

const TeamsSection = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const selectedTeamIndex = selectedTeam ? teams.findIndex((team) => team.short === selectedTeam.short) : -1;
  const selectedTeamColor =
    selectedTeamIndex >= 0 ? CARD_COLORS[selectedTeamIndex % CARD_COLORS.length] : CARD_COLORS[0];

  useEffect(() => {
    if (!selectedTeam) {
      document.body.style.overflow = "";
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedTeam(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedTeam]);

  return (
    <>
      <section id="teams" className="bg-ipl-surface px-4 py-16">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center font-heading text-3xl font-bold uppercase text-foreground md:text-4xl">
            Teams
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {teams.map((team, index) => {
              const color = CARD_COLORS[index % CARD_COLORS.length];
              return (
                <button
                  key={team.short}
                  type="button"
                  onClick={() => setSelectedTeam(team)}
                  className="group rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 animate-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={{
                    background: `linear-gradient(160deg, ${color}2B 0%, ${color}17 55%, rgba(80, 71, 41, 0.72) 100%)`,
                    border: `1px solid ${color}88`,
                    boxShadow: `0 0 22px ${color}24`,
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <div
                    className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-lg font-heading font-bold text-foreground transition-transform group-hover:scale-110"
                    style={{
                      border: `2px solid ${color}AA`,
                      background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.65), ${color}33)`,
                    }}
                  >
                    {initialsFromName(team.name)}
                  </div>
                  <h3 className="font-heading text-sm font-semibold leading-tight text-foreground">{team.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{team.captain}</p>
                  <p className="mt-3">
                    <span className="inline-flex items-center rounded-full border border-[#A48A43]/80 bg-[linear-gradient(135deg,rgba(255,245,214,0.95),rgba(164,138,67,0.32))] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#504729] shadow-[0_0_14px_rgba(200,164,92,0.38)]">
                      View Squad
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedTeam && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setSelectedTeam(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedTeam.name} squad`}
        >
          <div
            className="mx-auto max-w-5xl animate-fade-up rounded-2xl border p-6 sm:p-8"
            style={{
              background:
                "linear-gradient(165deg, rgba(255,253,247,0.98) 0%, rgba(248,242,226,0.96) 48%, rgba(238,226,190,0.92) 100%)",
              borderColor: "rgba(164, 138, 67, 0.5)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/60 bg-primary/15 font-heading text-sm font-bold text-foreground">
                  {initialsFromName(selectedTeam.name)}
                </div>
                <div>
                  <h3 className="font-heading text-2xl text-foreground">{selectedTeam.name}</h3>
                  <p className="text-sm text-muted-foreground">Captain: {selectedTeam.captain}</p>
                  <p className="text-xs text-foreground/80">Squad members: {selectedTeam.members.length}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="rounded-md border border-[#A48A43]/55 bg-white/70 px-3 py-1.5 text-sm text-foreground hover:bg-white/90"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedTeam.members.map((player, index) => (
                <div
                  key={player.name}
                  className="flex items-center gap-3 rounded-xl border p-4 animate-fade-up transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(160deg, ${selectedTeamColor}2B 0%, ${selectedTeamColor}17 55%, rgba(80, 71, 41, 0.72) 100%)`,
                    borderColor: `${selectedTeamColor}88`,
                    boxShadow: `0 0 18px ${selectedTeamColor}24`,
                    animationDelay: `${index * 35}ms`,
                  }}
                >
                  {player.img ? (
                    <img
                      src={player.img}
                      alt={player.name}
                      className="h-16 w-16 rounded-full object-cover"
                      style={{
                        border: `2px solid ${selectedTeamColor}AA`,
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full font-heading text-sm font-bold text-foreground"
                      style={{
                        border: `2px solid ${selectedTeamColor}AA`,
                        background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.65), ${selectedTeamColor}33)`,
                      }}
                    >
                      {initialsFromName(player.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-heading text-foreground">{player.name}</p>
                    <p className="text-xs font-semibold text-[#504729]">{player.role}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{player.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamsSection;
