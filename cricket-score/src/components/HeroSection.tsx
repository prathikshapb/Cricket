import heroBg from "@/assets/Screenshot 2026-03-25 123126.png";
import { CalendarDays, Tv } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      className="relative mt-16 flex min-h-[90vh] items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

      <div className="relative z-10 px-4 text-center">
        <p className="mb-4 font-heading text-lg uppercase tracking-[0.3em] text-primary md:text-xl animate-fade-up">
          Indian Premier League
        </p>
        <h1 className="font-heading text-5xl font-bold leading-tight text-foreground md:text-8xl animate-fade-up" style={{ animationDelay: "100ms" }}>
          IPL <span className="text-gradient-gold">2026</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-up" style={{ animationDelay: "200ms" }}>
          The biggest cricket carnival is back! Catch every six, every wicket, every moment.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: "300ms" }}>
          <button
            onClick={() => document.getElementById("live-scores")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-heading text-lg font-semibold text-primary-foreground transition hover:brightness-110 animate-float-gentle"
          >
            <Tv className="h-5 w-5" /> Live Scores
          </button>
          <button
            onClick={() => document.getElementById("matches")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-3 font-heading text-lg font-semibold text-primary transition hover:bg-primary/10"
          >
            <CalendarDays className="h-5 w-5" /> Schedule
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


