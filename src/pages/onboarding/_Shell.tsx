import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingShell(props: {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const steps = [
    "Company",
    "AI Basics",
    "Phone Rules",
    "Voice + KB",
    "Payment",
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-orange-400" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">NeuroSphere</div>
              <div className="text-xs text-white/60">Onboarding</div>
            </div>
          </div>
          <button
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30 hover:text-white"
            onClick={() => navigate("/pricing")}
          >
            Back to pricing
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <div className="text-xs text-white/60">Step {props.step} of 5</div>
          <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">{props.title}</h1>
          {props.subtitle && <p className="mt-2 text-white/70">{props.subtitle}</p>}
        </div>

        <div className="mb-8 grid grid-cols-5 gap-2">
          {steps.map((label, idx) => {
            const n = idx + 1;
            const active = n === props.step;
            const done = n < props.step;
            return (
              <div key={label} className="text-center">
                <div
                  className={[
                    "mx-auto h-2 w-full rounded-full",
                    done ? "bg-white/60" : active ? "bg-white" : "bg-white/15",
                  ].join(" ")}
                  title={label}
                />
                <div className="mt-2 hidden text-[10px] text-white/50 md:block">{label}</div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          {props.children}
        </div>

        <div className="mt-6 text-xs text-white/50">
          Tip: keep it simple. You can fine-tune voices, transfers, and knowledge base after you’re in the dashboard.
        </div>
      </main>
    </div>
  );
}
