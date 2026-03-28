import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { loadMatchScheduleSnapshot } from "@/lib/matchScheduleStorage";

const TEAM_LABELS = Array.from({ length: 20 }, (_, index) => String.fromCharCode(65 + index));
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const MatchesSection = () => {
  const snapshot = loadMatchScheduleSnapshot();

  const matches = snapshot?.schedulePlan ?? [];
  const revealedCount = snapshot?.revealedCount ?? 0;

  const teamNameForSlot = useMemo(
    () => (slotIndex: number) => snapshot?.slotToTeamName?.[slotIndex] ?? `Team ${TEAM_LABELS[slotIndex]}`,
    [snapshot?.slotToTeamName],
  );
  const matchDateTime = useMemo(
    () => (matchIndex: number) => {
      const d = new Date(2026, 2, 28);
      d.setDate(d.getDate() + matchIndex);
      const dateText = `${MONTH_NAMES[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")} • ${DAY_NAMES[d.getDay()]}`;
      const timeText = matchIndex % 2 === 0 ? "3:30 PM" : "7:30 PM";
      return `${dateText} • ${timeText}`;
    },
    [],
  );

  return (
    <section id="matches" className="pt-6 pb-16 px-4 bg-ipl-surface">
      <div className="container mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground uppercase mb-8 text-center">
          Matches
        </h2>

        {matches.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            No reveal schedule yet. Assign teams and reveal matches from the Reveal Match section.
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match, index) => {
              const isRevealed = index < revealedCount;
              return (
                <div
                  key={match.slot}
                  className={cn(
                    "grid gap-4 rounded-xl border border-border/70 bg-[linear-gradient(145deg,#faf3e8,#f1e4d0)] p-4 md:grid-cols-[170px_1fr] md:items-center",
                    !isRevealed && "opacity-80",
                  )}
                >
                  <div className="md:pr-3 md:border-r md:border-dashed md:border-border">
                    <span className="inline-block rounded-sm border border-primary bg-primary/10 px-3 py-1 font-heading text-xs font-bold uppercase tracking-[0.08em] text-primary">
                      Match {index + 1}
                    </span>
                    <p className="mt-2 font-heading text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {matchDateTime(index)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-heading text-lg font-bold uppercase tracking-[0.03em] text-foreground">{teamNameForSlot(match.team1)}</p>
                    <p className="font-heading text-3xl font-black italic text-muted-foreground">Vs</p>
                    <p className="font-heading text-lg font-bold uppercase tracking-[0.03em] text-foreground">{teamNameForSlot(match.team2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MatchesSection;
