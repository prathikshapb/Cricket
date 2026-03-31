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

  const matchMeta = useMemo(
    () => (matchIndex: number) => {
      const d = new Date(2026, 2, 28);
      d.setDate(d.getDate() + matchIndex);
      const date = `${MONTH_NAMES[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
      const day = DAY_NAMES[d.getDay()];
      const time = matchIndex % 2 === 0 ? "3:30 PM" : "7:30 PM";
      return { date, day, time };
    },
    [],
  );

  return (
    <section id="matches" className="bg-ipl-surface px-3 pt-4 pb-4 min-h-screen">
      <div className="container mx-auto flex h-[calc(100vh-2rem)] flex-col">
        <h2 className="mb-3 text-center font-heading text-2xl font-bold uppercase text-foreground md:text-3xl">
          Matches
        </h2>

        {matches.length === 0 ? (
          <div className="gold-panel flex flex-1 items-center justify-center rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            No reveal schedule yet. Assign teams and reveal matches from the Reveal Match section.
          </div>
        ) : (
          <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {matches.map((match, index) => {
              const isRevealed = index < revealedCount;
              const meta = matchMeta(index);
              const team1 = teamNameForSlot(match.team1);
              const team2 = teamNameForSlot(match.team2);

              return (
                <div
                  key={match.slot}
                  className={cn(
                    "flex min-h-0 flex-col justify-between rounded-lg border border-[#A48A43]/55 bg-card p-2 shadow-[0_0_0_1px_rgba(164,138,67,0.2),0_8px_18px_rgba(80,71,41,0.14)]",
                    !isRevealed && "opacity-75 saturate-75",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block rounded-sm border border-[#A48A43]/50 bg-[linear-gradient(135deg,rgba(251,244,225,0.98),rgba(224,212,180,0.88))] px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-[0.08em] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_8px_rgba(164,138,67,0.2)]">
                      Match {index + 1}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                      {meta.time}
                    </span>
                  </div>

                  <div className="my-1 flex items-center justify-center gap-1.5">
                    <p className="max-w-[44%] truncate font-premium text-[16px] font-semibold uppercase tracking-[0.035em] text-[#4B4226]">
                      {team1}
                    </p>
                    <p className="font-premium text-[17px] font-medium italic leading-none text-[#4B4226]">Vs</p>
                    <p className="max-w-[44%] truncate font-premium text-[16px] font-semibold uppercase tracking-[0.035em] text-[#4B4226]">
                      {team2}
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-[#A48A43]/45 bg-[linear-gradient(90deg,rgba(251,244,225,0.96),rgba(227,214,180,0.82))] px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_8px_rgba(164,138,67,0.16)]">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-foreground">{meta.date}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">{meta.day}</p>
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
