import { TEAM_LOGOS } from "@/lib/logos";

const standings = [
  { pos: 1, team: "CSK", p: 10, w: 8, l: 2, nrr: "+1.245", pts: 16 },
  { pos: 2, team: "MI", p: 10, w: 7, l: 3, nrr: "+0.890", pts: 14 },
  { pos: 3, team: "RCB", p: 10, w: 6, l: 4, nrr: "+0.567", pts: 12 },
  { pos: 4, team: "KKR", p: 10, w: 6, l: 4, nrr: "+0.234", pts: 12 },
  { pos: 5, team: "RR", p: 10, w: 5, l: 5, nrr: "+0.112", pts: 10 },
  { pos: 6, team: "DC", p: 10, w: 5, l: 5, nrr: "-0.098", pts: 10 },
  { pos: 7, team: "GT", p: 10, w: 4, l: 6, nrr: "-0.345", pts: 8 },
  { pos: 8, team: "SRH", p: 10, w: 3, l: 7, nrr: "-0.567", pts: 6 },
  { pos: 9, team: "PBKS", p: 10, w: 2, l: 8, nrr: "-0.890", pts: 4 },
  { pos: 10, team: "LSG", p: 10, w: 2, l: 8, nrr: "-1.148", pts: 4 },
];

const PointsTable = () => {
  return (
    <section id="points-table" className="pt-6 pb-16 px-4">
      <div className="container mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground uppercase mb-8 text-center">
          Points Table
        </h2>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary text-secondary-foreground">
                <th className="py-3 px-4 text-left font-heading">#</th>
                <th className="py-3 px-4 text-left font-heading">Team</th>
                <th className="py-3 px-4 text-center font-heading">P</th>
                <th className="py-3 px-4 text-center font-heading">W</th>
                <th className="py-3 px-4 text-center font-heading">L</th>
                <th className="py-3 px-4 text-center font-heading">NRR</th>
                <th className="py-3 px-4 text-center font-heading">Pts</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, index) => (
                <tr
                  key={row.team}
                  className={`border-t border-border transition-colors hover:bg-muted/50 animate-fade-up ${row.pos <= 4 ? "bg-ipl-green/5" : ""}`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <td className="py-3 px-4 font-bold text-muted-foreground">{row.pos}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img src={TEAM_LOGOS[row.team]} alt={`${row.team} logo`} className="w-7 h-7 object-contain" loading="lazy" />
                      <span className="font-heading font-semibold text-foreground">{row.team}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{row.p}</td>
                  <td className="py-3 px-4 text-center text-ipl-green font-semibold">{row.w}</td>
                  <td className="py-3 px-4 text-center text-ipl-red font-semibold">{row.l}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{row.nrr}</td>
                  <td className="py-3 px-4 text-center font-heading font-bold text-primary">{row.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Top 4 teams (highlighted) qualify for the playoffs
        </p>
      </div>
    </section>
  );
};

export default PointsTable;
