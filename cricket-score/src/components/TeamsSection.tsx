import { useEffect, useState } from "react";
import { TEAM_COLORS, TEAM_LOGOS } from "@/lib/logos";
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

const TeamsSection = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {teams.map((team, index) => (
              <button
                key={team.short}
                type="button"
                onClick={() => setSelectedTeam(team)}
                className="group rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 animate-fade-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{
                  background: `linear-gradient(160deg, ${TEAM_COLORS[team.short]}33 0%, ${TEAM_COLORS[team.short]}1A 55%, rgba(15, 23, 42, 0.78) 100%)`,
                  border: `1px solid ${TEAM_COLORS[team.short]}66`,
                  boxShadow: `0 0 24px ${TEAM_COLORS[team.short]}20`,
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <div
                  className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-muted transition-transform group-hover:scale-110"
                  style={{
                    border: `2px solid ${TEAM_COLORS[team.short]}AA`,
                  }}
                >
                  <img
                    src={TEAM_LOGOS[team.short]}
                    alt={`${team.name} logo`}
                    className="h-14 w-14 object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-heading text-sm font-semibold leading-tight text-foreground">{team.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{team.captain}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-foreground/70">View Squad</p>
              </button>
            ))}
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
              background: `linear-gradient(170deg, ${TEAM_COLORS[selectedTeam.short]}2B 0%, rgba(15, 23, 42, 0.96) 40%, rgba(2, 6, 23, 0.96) 100%)`,
              borderColor: `${TEAM_COLORS[selectedTeam.short]}88`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={TEAM_LOGOS[selectedTeam.short]} alt={`${selectedTeam.name} logo`} className="h-14 w-14 object-contain" />
                <div>
                  <h3 className="font-heading text-2xl text-foreground">{selectedTeam.name}</h3>
                  <p className="text-sm text-muted-foreground">Captain: {selectedTeam.captain}</p>
                  <p className="text-xs text-foreground/80">Squad members: {selectedTeam.members.length}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedTeam.members.map((player, index) => (
                <div
                  key={player.name}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/65 p-4 animate-fade-up"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  <img
                    src={player.img}
                    alt={player.name}
                    className="h-16 w-16 rounded-full border border-white/20 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-heading text-foreground">{player.name}</p>
                    <p className="text-xs font-semibold text-primary">{player.role}</p>
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
