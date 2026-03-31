import { loadMatchScheduleSnapshot } from "@/lib/matchScheduleStorage";
import { useNavigate } from "react-router-dom";

const TEAM_LABELS = Array.from({ length: 20 }, (_, index) => String.fromCharCode(65 + index));

const GroupsSection = () => {
  const navigate = useNavigate();
  const snapshot = loadMatchScheduleSnapshot();
  const slotToTeamName = snapshot?.slotToTeamName ?? [];

  const groups = Array.from({ length: 5 }, (_, groupIndex) => {
    const start = groupIndex * 4;
    const teams = Array.from({ length: 4 }, (_, offset) => {
      const slotIndex = start + offset;
      return slotToTeamName[slotIndex] ?? `Team ${TEAM_LABELS[slotIndex]}`;
    });
    return {
      title: `Group ${groupIndex + 1}`,
      teams,
    };
  });

  return (
    <section id="groups" className="min-h-[calc(100vh-4rem)] px-4 pt-6 pb-6">
      <div className="container mx-auto flex min-h-[calc(100vh-6rem)] flex-col">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold uppercase text-foreground md:text-4xl">Groups</h2>
        </div>

        <div className="mt-6 grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {groups.map((group) => (
            <article
              key={group.title}
              className="gold-panel flex min-h-[340px] flex-col rounded-2xl border-primary/35 bg-[linear-gradient(160deg,#DEDAD2_0%,#c6bb95_52%,#A48A43_100%)] p-5 shadow-[0_14px_30px_rgba(80,71,41,0.28)] ring-1 ring-primary/28"
            >
              <h3 className="mb-4 text-center font-heading text-xl font-bold uppercase tracking-[0.08em] text-foreground">
                {group.title}
              </h3>
              <div className="flex flex-1 flex-col justify-between gap-3">
                {group.teams.map((team) => (
                  <p
                    key={`${group.title}-${team}`}
                    className="rounded-md border border-primary/25 bg-[linear-gradient(120deg,rgba(222,218,210,0.96)_0%,rgba(208,189,141,0.5)_50%,rgba(164,138,67,0.32)_100%)] px-3 py-3 text-center font-heading text-base font-semibold uppercase tracking-[0.04em] text-foreground"
                  >
                    {team}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => navigate("/matches")}
            className="rounded-md bg-primary px-6 py-2.5 font-heading text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground shadow-[0_8px_20px_rgba(80,71,41,0.28)] transition hover:brightness-110"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default GroupsSection;
