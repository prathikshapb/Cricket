import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { loadMatchScheduleSnapshot, saveMatchScheduleSnapshot } from "@/lib/matchScheduleStorage";

type MatchSlot = {
  slot: number;
  team1: number;
  team2: number;
};

type MatchRevealPhase = "idle" | "loading" | "team1" | "versus" | "team2" | "done";

const TEAM_LABELS = Array.from({ length: 20 }, (_, index) => String.fromCharCode(65 + index));
const SLOT_GROUP_COUNT = 5;
const TEAMS_PER_GROUP = 4;
const MATCHES_PER_GROUP = 6; // round-robin for 4 teams
const TOTAL_MATCH_SLOTS = SLOT_GROUP_COUNT * MATCHES_PER_GROUP;
const EMPTY_SLOTS = Array.from({ length: TEAM_LABELS.length }, () => null as string | null);
const SPINNER_CELL_HEIGHT = 72;
const SPINNER_LANE_LENGTH = 220;

const buildSchedulePlan = () => {
  const plan: MatchSlot[] = [];
  let matchNumber = 1;

  for (let group = 0; group < SLOT_GROUP_COUNT; group += 1) {
    const start = group * TEAMS_PER_GROUP;
    const groupTeams = [start, start + 1, start + 2, start + 3];
    for (let i = 0; i < groupTeams.length; i += 1) {
      for (let j = i + 1; j < groupTeams.length; j += 1) {
        plan.push({
          slot: matchNumber,
          team1: groupTeams[i],
          team2: groupTeams[j],
        });
        matchNumber += 1;
      }
    }
  }

  return plan;
};

const MatchSetupSection = () => {
  const storedSnapshot = loadMatchScheduleSnapshot();
  const [teamInput, setTeamInput] = useState("");
  const [slotToTeamName, setSlotToTeamName] = useState<(string | null)[]>(
    storedSnapshot?.slotToTeamName?.length === TEAM_LABELS.length ? storedSnapshot.slotToTeamName : EMPTY_SLOTS,
  );
  const [lastAssignedSlot, setLastAssignedSlot] = useState<number | null>(null);
  const [schedulePlan, setSchedulePlan] = useState<MatchSlot[]>(() => storedSnapshot?.schedulePlan ?? buildSchedulePlan() ?? []);
  const [revealedMatches, setRevealedMatches] = useState<MatchSlot[]>(() => {
    if (!storedSnapshot?.schedulePlan?.length || !storedSnapshot?.revealedCount) return [];
    return storedSnapshot.schedulePlan.slice(0, Math.max(0, storedSnapshot.revealedCount));
  });
  const [error, setError] = useState<string | null>(null);
  const [isSpinningAssignment, setIsSpinningAssignment] = useState(false);
  const [spinnerStep, setSpinnerStep] = useState(0);
  const [spinnerTransitionMs, setSpinnerTransitionMs] = useState(90);
  const [isRevealingMatch, setIsRevealingMatch] = useState(false);
  const [matchRevealPhase, setMatchRevealPhase] = useState<MatchRevealPhase>("idle");
  const [matchRevealPopup, setMatchRevealPopup] = useState<{
    matchNumber: number;
    team1Name: string;
    team2Name: string;
  } | null>(null);
  const timersRef = useRef<number[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const spinSoundRef = useRef<{
    baseOsc: OscillatorNode;
    baseGain: GainNode;
    tickTimer: number;
  } | null>(null);
  const matchSoundRef = useRef<{
    droneOsc: OscillatorNode;
    droneGain: GainNode;
    tickTimer: number;
  } | null>(null);

  const spinnerLane = useMemo(
    () => Array.from({ length: SPINNER_LANE_LENGTH }, (_, index) => TEAM_LABELS[index % TEAM_LABELS.length]),
    [],
  );

  const assignedCount = useMemo(() => slotToTeamName.filter(Boolean).length, [slotToTeamName]);
  const allTeamsAssigned = assignedCount === TEAM_LABELS.length;
  const canStartMatchPicking = assignedCount >= 1;
  const isComplete = revealedMatches.length >= TOTAL_MATCH_SLOTS;
  const lastPicked = revealedMatches[revealedMatches.length - 1] ?? null;

  const teamNameForSlot = (slotIndex: number) => slotToTeamName[slotIndex] ?? `Team ${TEAM_LABELS[slotIndex]}`;
  const assignedTeamMatchList = useMemo(() => {
    if (lastAssignedSlot === null) return [];
    return schedulePlan
      .map((match, index) => {
        if (match.team1 !== lastAssignedSlot && match.team2 !== lastAssignedSlot) return null;
        const opponentSlot = match.team1 === lastAssignedSlot ? match.team2 : match.team1;
        return {
          matchNumber: index + 1,
          opponentSlot,
        };
      })
      .filter((item): item is { matchNumber: number; opponentSlot: number } => item !== null);
  }, [lastAssignedSlot, schedulePlan]);

  const queueTimer = (timerId: number) => {
    timersRef.current.push(timerId);
  };

  const getAudioCtx = () => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const AudioCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    audioCtxRef.current = new AudioCtor();
    return audioCtxRef.current;
  };

  const startAssignmentSpinSound = () => {
    if (spinSoundRef.current) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const baseOsc = ctx.createOscillator();
    const baseGain = ctx.createGain();
    baseOsc.type = "triangle";
    baseOsc.frequency.setValueAtTime(150, ctx.currentTime);
    baseOsc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 1.3);
    baseGain.gain.setValueAtTime(0.001, ctx.currentTime);
    baseGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.14);
    baseOsc.connect(baseGain);
    baseGain.connect(ctx.destination);
    baseOsc.start();

    const playTick = () => {
      const tickOsc = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tickOsc.type = "square";
      tickOsc.frequency.setValueAtTime(900 + Math.random() * 200, ctx.currentTime);
      tickOsc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.035);
      tickGain.gain.setValueAtTime(0.001, ctx.currentTime);
      tickGain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.004);
      tickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      tickOsc.connect(tickGain);
      tickGain.connect(ctx.destination);
      tickOsc.start();
      tickOsc.stop(ctx.currentTime + 0.045);
    };

    playTick();
    const tickTimer = window.setInterval(playTick, 120);
    spinSoundRef.current = { baseOsc, baseGain, tickTimer };
  };

  const stopAssignmentSpinSound = () => {
    const active = spinSoundRef.current;
    const ctx = getAudioCtx();
    if (!active || !ctx) return;

    window.clearInterval(active.tickTimer);
    active.baseGain.gain.cancelScheduledValues(ctx.currentTime);
    active.baseGain.gain.setValueAtTime(active.baseGain.gain.value, ctx.currentTime);
    active.baseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    active.baseOsc.stop(ctx.currentTime + 0.13);
    spinSoundRef.current = null;
  };

  const startMatchRevealSound = () => {
    if (matchSoundRef.current) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const droneOsc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    droneOsc.type = "sawtooth";
    droneOsc.frequency.setValueAtTime(120, ctx.currentTime);
    droneOsc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 1.4);
    droneGain.gain.setValueAtTime(0.001, ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.1);
    droneOsc.connect(droneGain);
    droneGain.connect(ctx.destination);
    droneOsc.start();

    const playTick = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(700 + Math.random() * 260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.055);
    };

    const tickTimer = window.setInterval(playTick, 150);
    playTick();
    matchSoundRef.current = { droneOsc, droneGain, tickTimer };
  };

  const stopMatchRevealSound = () => {
    const active = matchSoundRef.current;
    const ctx = getAudioCtx();
    if (!active || !ctx) return;
    window.clearInterval(active.tickTimer);
    active.droneGain.gain.cancelScheduledValues(ctx.currentTime);
    active.droneGain.gain.setValueAtTime(active.droneGain.gain.value, ctx.currentTime);
    active.droneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    active.droneOsc.stop(ctx.currentTime + 0.14);
    matchSoundRef.current = null;
  };

  const playMatchRevealHit = () => {
    const ctx = getAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.14);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  };

  useEffect(
    () => () => {
      timersRef.current.forEach((timerId) => {
        window.clearInterval(timerId);
        window.clearTimeout(timerId);
      });
      stopAssignmentSpinSound();
      stopMatchRevealSound();
      timersRef.current = [];
    },
    [],
  );

  useEffect(() => {
    saveMatchScheduleSnapshot({
      slotToTeamName,
      schedulePlan,
      revealedCount: revealedMatches.length,
    });
  }, [slotToTeamName, schedulePlan, revealedMatches.length]);

  const spinAssignTeam = () => {
    const cleanName = teamInput.trim();
    if (!cleanName) {
      setError("Type a team name before spinning.");
      return;
    }

    if (isSpinningAssignment) return;

    if (allTeamsAssigned) {
      setError("All 20 slots are already assigned. Use Reset to start over.");
      return;
    }

    const unfilledSlots = TEAM_LABELS.map((_, index) => index).filter((index) => !slotToTeamName[index]);
    const pickedSlot = unfilledSlots[Math.floor(Math.random() * unfilledSlots.length)];
    setError(null);
    setIsSpinningAssignment(true);
    startAssignmentSpinSound();

    setSpinnerTransitionMs(90);
    setSpinnerStep((prev) => {
      if (prev > SPINNER_LANE_LENGTH - 40) {
        return (prev % TEAM_LABELS.length) + TEAM_LABELS.length * 6;
      }
      return prev;
    });

    const rollInterval = window.setInterval(() => {
      setSpinnerStep((prev) => prev + 1);
    }, 82);
    queueTimer(rollInterval);

    const stopRolling = window.setTimeout(() => {
      window.clearInterval(rollInterval);
      stopAssignmentSpinSound();

      setSpinnerStep((prev) => {
        const nowMod = prev % TEAM_LABELS.length;
        const delta = (pickedSlot - nowMod + TEAM_LABELS.length) % TEAM_LABELS.length;
        return prev + delta + TEAM_LABELS.length * 2;
      });
      setSpinnerTransitionMs(700);

      const finishAssign = window.setTimeout(() => {
        setSlotToTeamName((prev) => {
          const next = [...prev];
          next[pickedSlot] = cleanName;
          return next;
        });
        setLastAssignedSlot(pickedSlot);
        setTeamInput("");
        setSpinnerTransitionMs(120);
        setIsSpinningAssignment(false);
      }, 720);
      queueTimer(finishAssign);
    }, 1900);
    queueTimer(stopRolling);
  };

  const pickMatch = () => {
    if (!canStartMatchPicking || isComplete || isRevealingMatch) return;

    if (schedulePlan.length === 0) {
      setError("Could not generate a fair 60-match schedule. Please reset and try again.");
      return;
    }

    const nextMatch = schedulePlan[revealedMatches.length];
    if (!nextMatch) return;

    setError(null);
    setIsRevealingMatch(true);
    setMatchRevealPopup({
      matchNumber: revealedMatches.length + 1,
      team1Name: teamNameForSlot(nextMatch.team1),
      team2Name: teamNameForSlot(nextMatch.team2),
    });
    setMatchRevealPhase("loading");
    startMatchRevealSound();

    const t1 = window.setTimeout(() => setMatchRevealPhase("team1"), 500);
    const t2 = window.setTimeout(() => setMatchRevealPhase("versus"), 1100);
    const t3 = window.setTimeout(() => {
      setMatchRevealPhase("team2");
      playMatchRevealHit();
      stopMatchRevealSound();
    }, 1650);
    const t4 = window.setTimeout(() => {
      setRevealedMatches((prev) => [...prev, nextMatch]);
      setMatchRevealPhase("done");
      setIsRevealingMatch(false);
    }, 2150);

    queueTimer(t1);
    queueTimer(t2);
    queueTimer(t3);
    queueTimer(t4);
  };

  const resetAll = () => {
    timersRef.current.forEach((timerId) => {
      window.clearInterval(timerId);
      window.clearTimeout(timerId);
    });
    timersRef.current = [];
    stopAssignmentSpinSound();
    stopMatchRevealSound();
    setTeamInput("");
    setSlotToTeamName(EMPTY_SLOTS);
    setLastAssignedSlot(null);
    setSchedulePlan(buildSchedulePlan() ?? []);
    setRevealedMatches([]);
    setSpinnerStep(0);
    setSpinnerTransitionMs(90);
    setIsSpinningAssignment(false);
    setIsRevealingMatch(false);
    setMatchRevealPhase("idle");
    setMatchRevealPopup(null);
    setError(null);
  };

  return (
    <section id="match-setup" className="px-4 pt-6 pb-16">
      <div className="container mx-auto space-y-6">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold uppercase text-foreground md:text-4xl">Cricket Match Scheduler</h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Enter one team name, assign it randomly to A-T. Schedule is grouped into 5 slots with 4 teams each, and each slot has 6 matches (30 total).
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/70 p-4 md:p-6">
            <h3 className="mb-4 font-heading text-xl font-bold text-foreground">Team Assignment Spinner</h3>
            <div className="space-y-4 rounded-xl border border-border/70 bg-background/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-foreground">Assigned Slots: {assignedCount}/20</p>
                <p className="text-xs text-muted-foreground">Remaining: {TEAM_LABELS.length - assignedCount}</p>
              </div>

              <label className="block space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Team Name</span>
                <input
                  value={teamInput}
                  onChange={(event) => setTeamInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      spinAssignTeam();
                    }
                }}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                placeholder="Type team name and press Enter"
                disabled={allTeamsAssigned || isSpinningAssignment}
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={spinAssignTeam}
                disabled={allTeamsAssigned || isSpinningAssignment}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-semibold transition",
                  allTeamsAssigned || isSpinningAssignment
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:brightness-110",
                )}
              >
                {isSpinningAssignment ? "Spinning..." : "Assign Slot"}
              </button>
              <button
                onClick={resetAll}
                className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                Reset
              </button>
            </div>

            <div className="rounded-xl border border-primary/40 bg-[linear-gradient(160deg,rgba(200,155,109,0.26),rgba(181,122,69,0.12))] p-4 shadow-[0_10px_24px_rgba(138,90,43,0.2)]">
              {lastAssignedSlot !== null && (
                <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Assigned: {slotToTeamName[lastAssignedSlot]} {"->"} Team {TEAM_LABELS[lastAssignedSlot]}
                </p>
              )}
              <div className="relative h-[72px] overflow-hidden rounded-xl border border-primary/25 bg-[linear-gradient(180deg,#f8efe2,#f2e4cf)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-background to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-background to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/20" />
                <div
                  className="will-change-transform"
                  style={{
                    transform: `translateY(-${spinnerStep * SPINNER_CELL_HEIGHT}px)`,
                    transition: `transform ${spinnerTransitionMs}ms linear`,
                  }}
                >
                  {spinnerLane.map((label, index) => (
                    <div key={`${label}-${index}`} className="flex h-[72px] items-center justify-center text-2xl font-black tracking-[0.2em] text-primary">
                      Team {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {lastAssignedSlot !== null && (
              <p className="text-sm font-semibold text-primary">
                Assigned: {slotToTeamName[lastAssignedSlot]} {"->"} Team {TEAM_LABELS[lastAssignedSlot]}
              </p>
              )}

              {error && <p className="text-sm text-ipl-red">{error}</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-[linear-gradient(145deg,#faf3e8,#f1e4d0)] p-4 shadow-[0_10px_24px_rgba(138,90,43,0.16)] md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-primary">Match Picker</p>
                <p className="font-heading text-xs uppercase tracking-[0.1em] text-muted-foreground">Filled Match Slots: {revealedMatches.length}/{TOTAL_MATCH_SLOTS}</p>
              </div>
              <button
                onClick={pickMatch}
                disabled={isComplete || !canStartMatchPicking || isRevealingMatch}
                className={cn(
                  "rounded-md px-4 py-2 font-heading text-sm font-bold uppercase tracking-[0.06em] transition",
                  isComplete || !canStartMatchPicking || isRevealingMatch
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground hover:brightness-110",
                )}
              >
                {isRevealingMatch ? "Revealing..." : "Pick Match"}
              </button>
            </div>

            {!canStartMatchPicking && <p className="mt-3 text-xs text-muted-foreground">Assign at least one team to start match picking.</p>}

            {lastAssignedSlot !== null && (
              <div className="mt-4 rounded-xl border border-border/70 bg-background/50 p-3">
                <p className="font-heading text-sm font-bold uppercase tracking-[0.08em] text-foreground">
                  Match Reveal Card: {teamNameForSlot(lastAssignedSlot)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Team {TEAM_LABELS[lastAssignedSlot]} fixtures ({assignedTeamMatchList.length} matches)
                </p>
                <div className="mt-3 max-h-44 space-y-1.5 overflow-y-auto pr-1">
                  {assignedTeamMatchList.map((item) => (
                    <p key={item.matchNumber} className="text-sm text-foreground">
                      Match {item.matchNumber}: {teamNameForSlot(lastAssignedSlot)} vs {teamNameForSlot(item.opponentSlot)}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {lastPicked && (
              <div className="mt-4 rounded-xl border border-primary/40 bg-[linear-gradient(160deg,rgba(200,155,109,0.25),rgba(181,122,69,0.1))] p-3">
                <p className="font-heading text-xs uppercase tracking-[0.14em] text-primary">Latest Match</p>
                <p className="mt-1 font-heading text-sm font-bold uppercase tracking-[0.04em] text-foreground">
                  Slot {String(lastPicked.slot).padStart(2, "0")}: {TEAM_LABELS[lastPicked.team1]} ({teamNameForSlot(lastPicked.team1)}) vs {TEAM_LABELS[lastPicked.team2]} ({teamNameForSlot(lastPicked.team2)})
                </p>
              </div>
            )}

            {matchRevealPopup && (
              <div className="mt-4 rounded-xl border border-primary/40 bg-[linear-gradient(160deg,rgba(248,239,226,0.95),rgba(241,228,208,0.95))] p-4 shadow-[0_0_20px_rgba(181,122,69,0.18)]">
                <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-primary/80">Match Reveal</p>
                <p className="mt-1 font-heading text-xs uppercase tracking-[0.14em] text-muted-foreground">Match {matchRevealPopup.matchNumber}</p>
                <div className="mt-3 min-h-[120px] rounded-lg border border-primary/20 bg-[linear-gradient(180deg,#fff9f1,#f6ead7)] p-3">
                  {matchRevealPhase === "loading" && (
                    <p className="live-pulse font-heading text-center text-xl font-black uppercase tracking-[0.14em] text-primary">Drawing Teams...</p>
                  )}
                  {(matchRevealPhase === "team1" || matchRevealPhase === "versus" || matchRevealPhase === "team2" || matchRevealPhase === "done") && (
                    <p className="animate-slide-down-fade font-heading text-center text-3xl font-black uppercase tracking-[0.06em] text-foreground">
                      {matchRevealPopup.team1Name}
                    </p>
                  )}
                  {(matchRevealPhase === "versus" || matchRevealPhase === "team2" || matchRevealPhase === "done") && (
                    <p className="animate-vs-pop font-heading mt-2 text-center text-2xl font-black uppercase tracking-[0.24em] text-primary">VS</p>
                  )}
                  {(matchRevealPhase === "team2" || matchRevealPhase === "done") && (
                    <p className="animate-team-b-rise font-heading mt-2 text-center text-3xl font-black uppercase tracking-[0.06em] text-foreground">
                      {matchRevealPopup.team2Name}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default MatchSetupSection;
