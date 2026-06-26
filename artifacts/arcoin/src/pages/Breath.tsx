import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Heart, BarChart3, Play, Square } from "lucide-react";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "rest";
type Mood = "stressed" | "anxious" | "calm" | "focused" | "energized";

const PROGRAMS = [
  { id: "4-7-8", name: "4-7-8 Relax", inhale: 4, hold: 7, exhale: 8, rest: 1, color: "#3b82f6", desc: "Deep stress relief" },
  { id: "box",   name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, rest: 4, color: "#8b5cf6", desc: "Focus & clarity" },
  { id: "2-1-4", name: "2-1-4 Energize", inhale: 2, hold: 1, exhale: 4, rest: 1, color: "#10b981", desc: "Quick energy boost" },
];

const MOOD_LABELS: Mood[] = ["stressed", "anxious", "calm", "focused", "energized"];
const MOOD_EMOJIS: Record<Mood, string> = {
  stressed: "😤", anxious: "😰", calm: "😌", focused: "🧠", energized: "⚡"
};

export default function Breath() {
  const [selected, setSelected] = useState(PROGRAMS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [moodAfter, setMoodAfter] = useState<Mood | null>(null);
  const [report, setReport] = useState<{ mood: Mood; after: Mood; cycles: number; date: string }[]>([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseSeqRef = useRef<{ phase: Phase; duration: number }[]>([]);
  const phaseIdxRef = useRef(0);
  const phaseCountRef = useRef(0);
  const cycleCountRef = useRef(0);

  const buildSeq = (prog: typeof PROGRAMS[0]) => [
    { phase: "inhale" as Phase, duration: prog.inhale },
    { phase: "hold" as Phase, duration: prog.hold },
    { phase: "exhale" as Phase, duration: prog.exhale },
    { phase: "rest" as Phase, duration: prog.rest },
  ];

  const start = () => {
    if (!mood) return;
    setRunning(true);
    phaseSeqRef.current = buildSeq(selected);
    phaseIdxRef.current = 0;
    phaseCountRef.current = phaseSeqRef.current[0].duration;
    cycleCountRef.current = 0;
    setPhase(phaseSeqRef.current[0].phase);
    setCount(phaseSeqRef.current[0].duration);
    setCycles(0);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mood && cycleCountRef.current > 0) {
      setPhase("idle");
      setRunning(false);
    } else {
      setRunning(false);
      setPhase("idle");
    }
  };

  useEffect(() => {
    if (!running) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      phaseCountRef.current -= 1;
      setCount(phaseCountRef.current);
      if (phaseCountRef.current <= 0) {
        let nextIdx = phaseIdxRef.current + 1;
        if (nextIdx >= phaseSeqRef.current.length) {
          nextIdx = 0;
          cycleCountRef.current += 1;
          setCycles(cycleCountRef.current);
        }
        phaseIdxRef.current = nextIdx;
        const next = phaseSeqRef.current[nextIdx];
        phaseCountRef.current = next.duration;
        setPhase(next.phase);
        setCount(next.duration);
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const finish = () => {
    stop();
    if (moodAfter && mood) {
      const entry = { mood, after: moodAfter, cycles: cycleCountRef.current, date: new Date().toLocaleDateString("en-IN") };
      setReport(prev => [entry, ...prev].slice(0, 10));
    }
    setMood(null); setMoodAfter(null); setCycles(0); setPhase("idle");
  };

  const phaseLabels: Record<Phase, string> = {
    idle: "Ready", inhale: "Breathe In", hold: "Hold", exhale: "Breathe Out", rest: "Rest"
  };

  const circleSize = phase === "inhale" ? 200 : phase === "exhale" || phase === "rest" ? 120 : 160;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Wind className="w-8 h-8 text-cyan-400" /> ARCOIN Breath
        </h1>
        <p className="text-muted-foreground mt-1">Guided breathing for financial clarity & stress relief. Track your mood journey.</p>
      </div>

      {!running ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {PROGRAMS.map(p => (
              <Card
                key={p.id}
                className={`cursor-pointer transition-all border-2 ${selected.id === p.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                onClick={() => setSelected(p)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-black" style={{ color: p.color }}>{p.id}</div>
                  <div className="font-semibold text-sm mt-1">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                  <div className="text-[10px] text-muted-foreground mt-2 font-mono">
                    ↑{p.inhale}s · ⏸{p.hold}s · ↓{p.exhale}s
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" /> How are you feeling right now?</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                {MOOD_LABELS.map(m => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${mood === m ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                  >
                    {MOOD_EMOJIS[m]} {m}
                  </button>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={start} disabled={!mood}>
                <Play className="w-4 h-4 mr-2" /> Start Breathing Session
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <div className="relative flex items-center justify-center h-64">
            <motion.div
              className="rounded-full opacity-20"
              style={{ backgroundColor: selected.color }}
              animate={{ width: circleSize + 60, height: circleSize + 60 }}
              transition={{ duration: phaseSeqRef.current[phaseIdxRef.current]?.duration || 4, ease: "linear" }}
            />
            <motion.div
              className="absolute rounded-full flex flex-col items-center justify-center shadow-2xl"
              style={{ backgroundColor: selected.color }}
              animate={{ width: circleSize, height: circleSize }}
              transition={{ duration: phaseSeqRef.current[phaseIdxRef.current]?.duration || 4, ease: "easeInOut" }}
            >
              <span className="text-white text-4xl font-black">{count}</span>
              <span className="text-white/80 text-xs font-semibold">{phaseLabels[phase]}</span>
            </motion.div>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{phaseLabels[phase]}</p>
            <p className="text-muted-foreground text-sm">Cycle {cycles + 1} · {selected.name}</p>
          </div>

          {cycles >= 3 && (
            <Card className="w-full border-primary/30 bg-primary/10">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-primary mb-3">Great job! {cycles} cycles complete. How do you feel now?</p>
                <div className="flex gap-2 flex-wrap">
                  {MOOD_LABELS.map(m => (
                    <button
                      key={m}
                      onClick={() => setMoodAfter(m)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${moodAfter === m ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                    >
                      {MOOD_EMOJIS[m]} {m}
                    </button>
                  ))}
                </div>
                {moodAfter && <Button className="mt-3 w-full" size="sm" onClick={finish}>Save Mood Report & Finish</Button>}
              </CardContent>
            </Card>
          )}

          <Button variant="outline" onClick={stop} className="flex items-center gap-2">
            <Square className="w-4 h-4" /> Stop Session
          </Button>
        </div>
      )}

      {report.length > 0 && (
        <Card className="border-border">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Mood Journey Report</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{MOOD_EMOJIS[r.mood]}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-lg">{MOOD_EMOJIS[r.after]}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{r.cycles} cycles · {r.date}</div>
                  <div className={`text-xs font-bold ${MOOD_LABELS.indexOf(r.after) > MOOD_LABELS.indexOf(r.mood) ? "text-green-400" : "text-rose-400"}`}>
                    {MOOD_LABELS.indexOf(r.after) > MOOD_LABELS.indexOf(r.mood) ? "↑ Improved" : "→ Same"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
