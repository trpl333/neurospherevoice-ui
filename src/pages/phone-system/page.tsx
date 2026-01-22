import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Speaker = "morgan" | "cora";

type Line = {
  speaker: Speaker;
  text: string;
};

function useAutoSubtitles(lines: Line[], enabled: boolean, speedMs = 2600) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    if (lines.length <= 1) return;

    const t = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % lines.length);
    }, speedMs);

    return () => window.clearInterval(t);
  }, [enabled, lines.length, speedMs]);

  const current = lines[Math.min(idx, lines.length - 1)];
  return { current, idx, setIdx };
}

function AvatarCard({
  name,
  role,
  subtitle,
  accent = "from-purple-500 to-orange-400",
}: {
  name: string;
  role: string;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
      <div className="flex items-center gap-4">
        {/* Avatar placeholder (swap with real image/video later) */}
        <div
          className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${accent} shadow-lg`}
          aria-hidden="true"
        />
        <div className="leading-tight">
          <div className="text-lg font-bold tracking-tight">{name}</div>
          <div className="text-sm text-white/70">{role}</div>
          <div className="mt-1 text-xs text-white/50">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0a0a12] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="font-semibold">{title}</div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-white/25 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function PhoneSystemMarketingPage() {
  const navigate = useNavigate();
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [coraOpen, setCoraOpen] = useState(false);

  const morganLines: Line[] = useMemo(
    () => [
      {
        speaker: "morgan",
        text:
          "Hey — I’m Morgan, your Guide. Welcome to your Phone System.",
      },
      {
        speaker: "morgan",
        text:
          "In the next 60 seconds, I’ll show you how NeuroSphere handles inbound calls like a trained employee — without the payroll, turnover, or HR drama.",
      },
      {
        speaker: "morgan",
        text:
          "You’ll meet Cora, your Inbound Call Coordinator. And yes — you can rename any of us anytime.",
      },
      {
        speaker: "morgan",
        text:
          "Click “Meet Cora” when you’re ready.",
      },
    ],
    []
  );

  const coraLines: Line[] = useMemo(
    () => [
      {
        speaker: "cora",
        text:
          "Hi — I’m Cora, your Inbound Call Coordinator. And yep — you can rename me anytime.",
      },
      {
        speaker: "cora",
        text:
          "Phones steal your team’s time. Hiring someone to ‘just answer calls’ becomes wages, taxes, workers comp, sick days, turnover… and surprise HR headaches.",
      },
      {
        speaker: "cora",
        text:
          "I answer inbound calls instantly, detect intent, collect the right info, and keep everything organized — every time.",
      },
      {
        speaker: "cora",
        text:
          "Best part? I remember callers. When they call back, it’s continuity — not “who are you again?”",
      },
    ],
    []
  );

  const { current: morganSub } = useAutoSubtitles(morganLines, subtitlesOn, 2600);
  const { current: coraSub, setIdx: setCoraIdx } = useAutoSubtitles(
    coraLines,
    subtitlesOn,
    3000
  );

  useEffect(() => {
    // When modal opens, restart Cora subtitles at the beginning for a cleaner feel.
    if (coraOpen) setCoraIdx(0);
  }, [coraOpen, setCoraIdx]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(138,43,226,0.25), transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,106,0,0.20), transparent 45%), radial-gradient(circle at 50% 80%, rgba(138,43,226,0.18), transparent 50%)"
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage:
            "linear-gradient(30deg, rgba(138,43,226,0.05) 12%, transparent 12.5%, transparent 87%, rgba(138,43,226,0.05) 87.5%, rgba(138,43,226,0.05)), linear-gradient(150deg, rgba(138,43,226,0.05) 12%, transparent 12.5%, transparent 87%, rgba(138,43,226,0.05) 87.5%, rgba(138,43,226,0.05)), linear-gradient(60deg, rgba(255,106,0,0.03) 25%, transparent 25.5%, transparent 75%, rgba(255,106,0,0.03) 75%, rgba(255,106,0,0.03))",
          backgroundSize: "80px 140px",
          backgroundPosition: "0 0, 40px 70px, 0 0",
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#0a0a12]/70 backdrop-blur sticky top-0">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-orange-400" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">NeuroSphere</div>
              <div className="text-xs text-white/60">Phone System</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubtitlesOn((v) => !v)}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-white/25 hover:text-white"
              title="Toggle subtitles"
            >
              Subtitles: {subtitlesOn ? "On" : "Off"}
            </button>

            <Link
              to="/home"
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-white/25 hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/pricing"
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-white/25 hover:text-white"
            >
              Pricing
            </Link>

            <Link
              to="/onboarding/1"
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
            >
              Start for $1
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-white/25 hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-14">
        {/* Hero */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Your Phone System, Run by AI Employees
            </h1>

            <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
              Stop bleeding time on repetitive calls. NeuroSphere answers, qualifies, schedules,
              transfers, and follows up — and it remembers every caller so your agency feels
              instantly sharper.
            </p>

            {/* Morgan speaking panel */}
            <div className="mt-8">
              <AvatarCard
                name="Morgan"
                role="Guide"
                subtitle="(You can rename me anytime.)"
                accent="from-purple-500 to-orange-400"
              />
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
                <div className="text-xs text-white/50 mb-2">
                  Morgan says (subtitles)
                </div>
                <div className="text-sm md:text-base text-white/85 leading-relaxed">
                  {subtitlesOn ? morganSub?.text : "Subtitles are off."}
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCoraOpen(true)}
                    className="rounded-xl bg-gradient-to-r from-purple-500 to-orange-400 px-5 py-3 text-sm font-semibold text-white hover:from-purple-600 hover:to-orange-500"
                  >
                    Meet Cora (Inbound Call Coordinator)
                  </button>

                  <button
                    onClick={() => navigate("/pricing")}
                    className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
                  >
                    View Pricing
                  </button>

                  <button
                    onClick={() => navigate("/onboarding/1")}
                    className="rounded-xl bg-white/90 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white"
                  >
                    Start for $1
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right rail: Quick bullets */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="text-sm font-semibold text-white/90">What this replaces</div>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex gap-3">
                <span className="mt-[5px] h-2 w-2 rounded-full bg-white/40" />
                Front desk / inbound call handling
              </li>
              <li className="flex gap-3">
                <span className="mt-[5px] h-2 w-2 rounded-full bg-white/40" />
                Manual intake + “what was your name again?”
              </li>
              <li className="flex gap-3">
                <span className="mt-[5px] h-2 w-2 rounded-full bg-white/40" />
                Constant interruptions while your team tries to sell/service
              </li>
              <li className="flex gap-3">
                <span className="mt-[5px] h-2 w-2 rounded-full bg-white/40" />
                HR overhead: hiring, training, turnover, call-outs
              </li>
            </ul>

            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="text-sm font-semibold text-white/90">Cora can:</div>
              <ul className="mt-3 space-y-3 text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="mt-[5px] h-2 w-2 rounded-full bg-purple-400/60" />
                  Answer instantly + detect intent (quote, service, billing, claims)
                </li>
                <li className="flex gap-3">
                  <span className="mt-[5px] h-2 w-2 rounded-full bg-purple-400/60" />
                  Collect structured info and log summaries automatically
                </li>
                <li className="flex gap-3">
                  <span className="mt-[5px] h-2 w-2 rounded-full bg-purple-400/60" />
                  Transfer & screen calls (“who is calling and why?”)
                </li>
                <li className="flex gap-3">
                  <span className="mt-[5px] h-2 w-2 rounded-full bg-purple-400/60" />
                  Schedule appointments and send confirmations by text/email
                </li>
                <li className="flex gap-3">
                  <span className="mt-[5px] h-2 w-2 rounded-full bg-purple-400/60" />
                  Remember callers — continuity on repeat calls
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight">Setup is stupid simple</h2>
          <p className="mt-2 text-white/70 max-w-3xl">
            You don’t need to be technical. You configure your AI employee like you would onboard a real one.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { n: "1", t: "Name & Voice", d: "Keep defaults or rename + choose a voice." },
              { n: "2", t: "Greeting & Hours", d: "Business-hours and after-hours behavior." },
              { n: "3", t: "Knowledge Base", d: "FAQs, services, what you do and don’t do." },
              { n: "4", t: "Transfers & Booking", d: "Who gets what calls, and calendar booking rules." },
            ].map((x) => (
              <div
                key={x.n}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
              >
                <div className="text-xs text-white/50">Step {x.n}</div>
                <div className="mt-1 font-semibold">{x.t}</div>
                <div className="mt-2 text-sm text-white/70">{x.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/onboarding/1"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
            >
              Start for $1
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
            >
              View Pricing
            </Link>
          </div>
        </section>
      </main>

      {/* Cora modal */}
      <Modal
        open={coraOpen}
        title="Meet Cora — Inbound Call Coordinator"
        onClose={() => setCoraOpen(false)}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <AvatarCard
              name="Cora"
              role="Inbound Call Coordinator"
              subtitle="(You can rename me anytime.)"
              accent="from-orange-400 to-purple-500"
            />

            <div className="mt-4 rounded-2xl border border-white/10 bg-[#0a0a12]/40 p-4">
              <div className="text-xs text-white/50 mb-2">Cora says (subtitles)</div>
              <div className="text-sm text-white/85 leading-relaxed">
                {subtitlesOn ? coraSub?.text : "Subtitles are off."}
              </div>
              <div className="mt-3 text-xs text-white/50">
                Tip: later we can swap this box for a real video avatar + WebVTT captions.
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Link
                to="/onboarding/1"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-orange-400 px-5 py-3 text-sm font-semibold text-white hover:from-purple-600 hover:to-orange-500"
              >
                Start for $1
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="text-sm font-semibold">The HR pain I delete</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• Wages + payroll tax + workers comp</li>
                <li>• Call-outs, turnover, training cycles</li>
                <li>• Interruptions that kill producer productivity</li>
                <li>• Inconsistent call handling quality</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="text-sm font-semibold">What I handle on every call</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• Detect intent: quote, service, billing, claims</li>
                <li>• Gather structured info (so your team doesn’t)</li>
                <li>• Answer FAQs from your knowledge base</li>
                <li>• Transfer calls — and screen before patching through</li>
                <li>• Schedule appointments by checking availability</li>
                <li>• Send confirmations via text/email</li>
                <li>• Log a summary + next steps automatically</li>
                <li className="text-white/85 font-semibold">
                  • Remember callers and continue where you left off
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="text-sm font-semibold">Setup (minutes, not weeks)</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• Choose my name + voice (or keep defaults)</li>
                <li>• Set greeting + business hours</li>
                <li>• Add transfer targets + calendars</li>
                <li>• Drop in FAQs / knowledge base</li>
                <li>• Go live</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
