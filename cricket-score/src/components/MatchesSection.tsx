import { CalendarDays, MapPin } from "lucide-react";
import { TEAM_LOGOS } from "@/lib/logos";

const upcomingMatches = [
  { id: 1, team1: "CSK", team2: "RCB", date: "Mar 28, 2026", time: "7:30 PM IST", venue: "M.A. Chidambaram Stadium", link: "https://www.iplt20.com/matches/fixtures" },
  { id: 2, team1: "MI", team2: "DC", date: "Mar 29, 2026", time: "3:30 PM IST", venue: "Wankhede Stadium", link: "https://www.iplt20.com/matches/fixtures" },
  { id: 3, team1: "KKR", team2: "SRH", date: "Mar 29, 2026", time: "7:30 PM IST", venue: "Eden Gardens", link: "https://www.iplt20.com/matches/fixtures" },
  { id: 4, team1: "RR", team2: "GT", date: "Mar 30, 2026", time: "7:30 PM IST", venue: "Sawai Mansingh Stadium", link: "https://www.iplt20.com/matches/fixtures" },
  { id: 5, team1: "PBKS", team2: "LSG", date: "Mar 31, 2026", time: "7:30 PM IST", venue: "PCA Stadium, Mohali", link: "https://www.iplt20.com/matches/fixtures" },
  { id: 6, team1: "RCB", team2: "MI", date: "Apr 1, 2026", time: "7:30 PM IST", venue: "M. Chinnaswamy Stadium", link: "https://www.iplt20.com/matches/fixtures" },
];

const MatchesSection = () => {
  return (
    <section id="matches" className="py-16 px-4 bg-ipl-surface">
      <div className="container mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground uppercase mb-8 text-center">
          Upcoming Matches
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingMatches.map((match, index) => (
            <div
              key={match.id}
              className="bg-card rounded-xl border border-border p-5 hover:glow-gold transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <img src={TEAM_LOGOS[match.team1]} alt={`${match.team1} logo`} className="w-9 h-9 object-contain" loading="lazy" />
                  <span className="font-heading text-2xl font-bold text-foreground">{match.team1}</span>
                </div>
                <span className="font-heading text-sm text-primary font-bold">VS</span>
                <div className="flex items-center gap-2">
                  <img src={TEAM_LOGOS[match.team2]} alt={`${match.team2} logo`} className="w-9 h-9 object-contain" loading="lazy" />
                  <span className="font-heading text-2xl font-bold text-foreground">{match.team2}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center">
                  <CalendarDays className="w-4 h-4" />
                  <span>{match.date} • {match.time}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <MapPin className="w-4 h-4" />
                  <span>{match.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MatchesSection;
