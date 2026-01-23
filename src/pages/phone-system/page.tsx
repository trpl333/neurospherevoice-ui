import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Phone System page
 * - Cora modal CTAs are in the header (always visible)
 * - Cora video cues "Start for $1" glow + bounce at a timestamp
 * - Modal supports internal scrolling
 */

function Modal({
  open,
  title,
  children,
  onClose,
  headerActions,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  headerActions?: React.ReactNode;
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-6 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-5xl max-h-[calc(100vh-3rem)] rounded-2xl border border-white/10 bg-[#0a0a12] shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
          <div className="font-semibold">{title}</div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {headerActions}

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-white/25 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>

        {/* Scroll container */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function MorganGuidePanel({
  onCueMeetCora,
  onMeetCora,
}: {
  onCueMeetCora: () => void;
  onMeetCora: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const vidRef = useRef<HTMLVideoElement | null>(null);
  const hasCuedRef = useRef(false);

  const MORGAN_VIDEO_URL =
    "https://personal-sam-artifacts.sfo3.cdn.digitaloceanspaces.com/Neurosphere%20Folder/Videos/Avatars/morgan_phone_system_intro_v1.mp4.mp4";

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;

    // attempt autoplay with sound; fallback to muted if blocked
    v.muted = false;
    setMuted(false);

    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    }
  }, []);

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-orange-400" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white/90">Morgan</div>
            <div className="text-xs text-white/60">
              NeuroSphere Guide • (Name editable anytime)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const v = vidRef.current;
              if (!v) return;
              if (v.paused) {
                v.play();
                setPaused(false);
              } else {
                v.pause();
                setPaused(true);
              }
            }}
            className="text-[11px] px-2 py-1 rounded-full border border-white/10 text-white/70 hover:border-white/25"
            title={paused ? "Play" : "Pause"}
          >
            {paused ? "Play" : "Pause"}
          </button>

          <button
            onClick={() => setMuted((v) => !v)}
            className="text-[11px] px-2 py-1 rounded-full border border-white/10 text-white/70 hover:border-white/25"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "Sound: Off" : "Sound: On"}
          </button>
        </div>
      </div>

      {/* Video */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
        <div className="relative aspect-[9/16]">
          <video
            ref={vidRef}
            src={MORGAN_VIDEO_URL}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            autoPlay
            muted={muted}
            preload="metadata"
            onClick={() => setMuted((v) => !v)}
            onEnded={() => setPaused(true)}
            onTimeUpdate={(e) => {
              const t = e.currentTarget.currentTime;
              if (!hasCuedRef.current && t >= 32) {
                hasCuedRef.current = true;
                onCueMeetCora();
              }
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-3 left-3 right-3">
            <div className="rounded-xl border border-white/10 bg-black/35 backdrop-blur px-3 py-2 text-sm text-white/90">
              Tap video to toggle sound
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            const v = vidRef.current;
            if (v && !v.paused) {
              v.pause();
              setPaused(true);
            }
            onMeetCora();
          }}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white hover:from-purple-600 hover:to-orange-500"
        >
          Meet Cora
        </button>

        <Link
          to="/pricing?trial=1"
          className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90 text-center"
        >
          Click Start
        </Link>

        <Link
          to="/pricing"
          className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 hover:border-white/30 text-center col-span-2"
        >
          View Pricing
        </Link>
      </div>
    </aside>
  );
}

export default function PhoneSystemMarketingPage() {
  const navigate = useNavigate();

  const [coraOpen, setCoraOpen] = useState(false);
  const [highlightMeetCora, setHighlightMeetCora] = useState(false);

  const [coraMuted, setCoraMuted] = useState(false);
  const [coraPaused, setCoraPaused] = useState(false);
  const coraVidRef = useRef<HTMLVideoElement | null>(null);

  // NEW: highlight "Start for $1" in the modal header when Cora says it
  const [highlightStart, setHighlightStart] = useState(false);
  const hasCuedStartRef = useRef(false);

  // Adjust this to the exact moment in your Cora video when she says "click start"
  const CORA_START_CUE_SECONDS = 50;

  const CORA_VIDEO_URL =
    "https://personal-sam-artifacts.sfo3.cdn.digitaloceanspaces.com/Neurosphere%20Folder/Videos/Avatars/Meet%20Cora%20(1).mp4";

  useEffect(() => {
    if (!coraOpen) return;

    // reset cue + highlight each open
    hasCuedStartRef.current = false;
    setHighlightStart(false);

    const v = coraVidRef.current;
    if (!v) return;

    v.currentTime = 0;

    // attempt autoplay with sound; fallback to muted
    v.muted = false;
    setCoraMuted(false);
    setCoraPaused(false);

    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        v.muted = true;
        setCoraMuted(true);
        v.play().catch(() => {});
      });
    }
  }, [coraOpen]);

  useEffect(() => {
    if (!highlightMeetCora) return;
    const t = window.setTimeout(() => setHighlightMeetCora(false), 12000);
    return () => window.clearTimeout(t);
  }, [highlightMeetCora]);

  useEffect(() => {
    if (!highlightStart) return;
    const t = window.setTimeout(() => setHighlightStart(false), 12000);
    return () => window.clearTimeout(t);
  }, [highlightStart]);

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(138,43,226,0.25), transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,106,0,0.20), transparent 45%), radial-gradient(circle at 50% 80%, rgba(138,43,226,0.18), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(30deg, rgba(138,43,226,0.05) 12%, transparent 12.5%, transparent 87%, rgba(138,43,226,0.05) 87.5%, rgba(138,43,226,0.05)), linear-gradient(150deg, rgba(138,43,226,0.05) 12%, transparent 12.5%, transparent 87%, rgba(138,43,226,0.05) 87.5%, rgba(138,43,226,0.05)), linear-gradient(60deg, rgba(255,106,0,0.03) 25%, transparent 25.5%, transparent 75%, rgba(255,106,0,0.03) 75%, rgba(255,106,0,0.03))",
            backgroundSize: "80px 140px",
            backgroundPosition: "0 0, 40px 70px, 0 0",
          }}
        />
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
              to="/pricing?trial=1"
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
            >
              Click Start
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
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
          {/* Left */}
          <div>
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Your Phone System, Run by AI Employees
            </h1>

            <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
              Stop bleeding time on repetitive calls. NeuroSphere answers,
              qualifies, schedules, transfers, and follows up — and it remembers
              every caller so your agency feels instantly sharper.
            </p>

            {/* Primary CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3 items-start">
              <div className="relative">
                {highlightMeetCora && (
                  <div className="absolute -top-12 left-0 flex items-center gap-2 animate-bounce">
                    <div className="rounded-xl border border-orange-300/40 bg-black/55 backdrop-blur px-3 py-2 text-xs font-semibold text-white">
                      Click Meet Cora ↓
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setCoraOpen(true);
                    setCoraMuted(true);
                    setCoraPaused(false);
                    setHighlightMeetCora(false);
                  }}
                  className={[
                    "rounded-xl bg-gradient-to-r from-purple-500 to-orange-400 px-5 py-3 text-sm font-semibold text-white hover:from-purple-600 hover:to-orange-500 transition-all duration-300",
                    highlightMeetCora
                      ? "ring-8 ring-orange-300/70 shadow-[0_0_80px_rgba(255,106,0,0.65)] animate-[pulse_1.2s_ease-in-out_infinite]"
                      : "",
                  ].join(" ")}
                >
                  Meet Cora (Inbound Call Coordinator)
                </button>
              </div>

              <button
                onClick={() => navigate("/pricing")}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
              >
                View Pricing
              </button>

              <button
                onClick={() => navigate("/pricing?trial=1")}
                className="rounded-xl bg-white/90 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white"
              >
                Click Start
              </button>
            </div>

            {/* Value blocks */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <div className="text-sm font-semibold text-white/90">
                  What this replaces
                </div>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li>• Front desk / inbound call handling</li>
                  <li>• Manual intake + “what was your name again?”</li>
                  <li>• Constant interruptions while your team sells/services</li>
                  <li>• HR overhead: hiring, training, turnover, call-outs</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <div className="text-sm font-semibold text-white/90">
                  Cora can:
                </div>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li>
                    • Answer instantly + detect intent (quote, service, billing,
                    claims)
                  </li>
                  <li>• Gather structured info + log summaries automatically</li>
                  <li>• Transfer & screen calls (“who is calling and why?”)</li>
                  <li>• Schedule appointments + send confirmations</li>
                  <li className="text-white/85 font-semibold">
                    • Remember callers (continuity on repeat calls)
                  </li>
                </ul>
              </div>
            </div>

            {/* How it works */}
            <section className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight">
                Setup is stupid simple
              </h2>
              <p className="mt-2 text-white/70 max-w-3xl">
                You don’t need to be technical. You configure your AI employee
                like you would onboard a real one.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                  {
                    n: "1",
                    t: "Name & Voice",
                    d: "Keep defaults or rename + choose a voice.",
                  },
                  {
                    n: "2",
                    t: "Greeting & Hours",
                    d: "Business-hours and after-hours behavior.",
                  },
                  {
                    n: "3",
                    t: "Knowledge Base",
                    d: "FAQs, services, what you do and don’t do.",
                  },
                  {
                    n: "4",
                    t: "Transfers & Booking",
                    d: "Who gets what calls, and calendar booking rules.",
                  },
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
                  to="/pricing?trial=1"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
                >
                  Click Start
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
                >
                  View Pricing
                </Link>
              </div>
            </section>
          </div>

          {/* Right rail */}
          <div className="lg:sticky lg:top-24">
            <MorganGuidePanel
              onCueMeetCora={() => setHighlightMeetCora(true)}
              onMeetCora={() => {
                setCoraOpen(true);
                setCoraMuted(true);
                setCoraPaused(false);
                setHighlightMeetCora(false);
              }}
            />
          </div>
        </div>
      </main>

      {/* Cora modal */}
      <Modal
        open={coraOpen}
        title="Meet Cora — Inbound Call Coordinator"
        onClose={() => setCoraOpen(false)}
        headerActions={
          <>
            <div className="relative">
              {highlightStart && (
                <div className="absolute -bottom-8 right-0 animate-bounce">
                  <div className="rounded-xl border border-orange-300/40 bg-black/55 backdrop-blur px-3 py-2 text-xs font-semibold text-white whitespace-nowrap">
                    Click Start ↓
                  </div>
                </div>
              )}

              <Link
                to="/pricing?trial=1"
                className={[
                  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white hover:from-purple-600 hover:to-orange-500 transition-all duration-300",
                  highlightStart
                    ? "ring-8 ring-orange-300/70 shadow-[0_0_80px_rgba(255,106,0,0.65)] animate-[pulse_1.2s_ease-in-out_infinite]"
                    : "",
                ].join(" ")}
              >
                Start for $1
              </Link>
            </div>

            <Link
              to="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              View Pricing
            </Link>
          </>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Cora video card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-400 to-purple-500" />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white/90">Cora</div>
                <div className="text-xs text-white/60">
                  Inbound Call Coordinator • (Name editable anytime)
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <div className="relative aspect-[9/16]">
                <video
                  ref={coraVidRef}
                  src={CORA_VIDEO_URL}
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                  playsInline
                  autoPlay
                  muted={coraMuted}
                  preload="metadata"
                  onClick={() => setCoraMuted((v) => !v)}
                  onEnded={() => setCoraPaused(true)}
                  onTimeUpdate={(e) => {
                    const t = e.currentTarget.currentTime;
                    if (!hasCuedStartRef.current && t >= CORA_START_CUE_SECONDS) {
                      hasCuedStartRef.current = true;
                      setHighlightStart(true);
                    }
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                {/* custom controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const v = coraVidRef.current;
                      if (!v) return;
                      if (v.paused) {
                        v.play();
                        setCoraPaused(false);
                      } else {
                        v.pause();
                        setCoraPaused(true);
                      }
                    }}
                    className="text-[11px] px-2 py-1 rounded-full border border-white/10 text-white/80 bg-black/40 backdrop-blur hover:border-white/25"
                    title={coraPaused ? "Play" : "Pause"}
                  >
                    {coraPaused ? "Play" : "Pause"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoraMuted((v) => !v);
                    }}
                    className="text-[11px] px-2 py-1 rounded-full border border-white/10 text-white/80 bg-black/40 backdrop-blur hover:border-white/25"
                    title={coraMuted ? "Unmute" : "Mute"}
                  >
                    {coraMuted ? "Sound: Off" : "Sound: On"}
                  </button>
                </div>

                <div className="pointer-events-none absolute bottom-3 left-3 right-3">
                  <div className="rounded-xl border border-white/10 bg-black/35 backdrop-blur px-3 py-2 text-sm text-white/90">
                    Tap video to toggle sound
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: info cards */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="text-sm font-semibold">The HR pain Cora deletes</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• Wages + payroll tax + workers comp</li>
                <li>• Call-outs, turnover, training cycles</li>
                <li>• Interruptions that kill producer productivity</li>
                <li>• Inconsistent call handling quality</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="text-sm font-semibold">What Cora handles</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• Detect intent: quote, service, billing, claims</li>
                <li>• Gather structured info + log summaries</li>
                <li>• Answer FAQs from your knowledge base</li>
                <li>• Screen + transfer calls</li>
                <li>• Book appointments + confirmations</li>
                <li className="text-white/85 font-semibold">
                  • Remember callers and continue where you left off
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="text-sm font-semibold">Setup (minutes, not weeks)</div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>• Name + voice</li>
                <li>• Greeting + business hours</li>
                <li>• Transfer targets + calendars</li>
                <li>• Knowledge base</li>
                <li>• Go live</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
