import { useNavigate } from "react-router-dom";
import { getOrCreateOnboarding, type PlanId } from "../../lib/onboarding";
import { PLANS, TRIAL, ADDONS, ENTERPRISE } from "../../lib/pricing";

export default function PricingPage() {
  const navigate = useNavigate();

  function start(plan: PlanId) {
    getOrCreateOnboarding(plan);
    navigate("/onboarding/1");
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-orange-400" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">NeuroSphere</div>
              <div className="text-xs text-white/60">Voice • Brain • Memory</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30 hover:text-white"
              onClick={() => navigate("/home")}
            >
              Home
            </button>
            <button
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30 hover:text-white"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
              onClick={() => start("growth")}
            >
              Start for ${TRIAL.activationFee}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Pricing
        </h1>
        <p className="mt-3 max-w-3xl text-white/70">
          {TRIAL.copy}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={[
                "rounded-2xl border p-6",
                p.key === "growth"
                  ? "border-white/25 bg-white/10"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              {p.key === "growth" && (
                <div className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">
                  Most popular
                </div>
              )}

              <div className="text-lg font-bold">{p.name}</div>

              <div className="mt-2 flex items-end gap-2">
                <div className="text-3xl font-extrabold">
                  ${p.priceMonthly.toLocaleString()}
                </div>
                <div className="text-sm text-white/60">/mo</div>
              </div>

              <p className="mt-3 text-sm text-white/70">{p.tagline}</p>

              <div className="mt-4 text-sm text-white/70 space-y-1">
                <div>
                  <span className="text-white/85 font-semibold">
                    Minutes:
                  </span>{" "}
                  {p.minutesIncluded.toLocaleString()}/mo
                </div>
                <div>
                  <span className="text-white/85 font-semibold">
                    Seats:
                  </span>{" "}
                  {p.seatsIncluded === "unlimited"
                    ? "Unlimited"
                    : p.seatsIncluded}
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-white/75">
                {p.includes.slice(0, 6).map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-[2px] inline-block h-4 w-4 rounded bg-white/15" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  className={[
                    "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold",
                    p.key === "growth"
                      ? "bg-white text-slate-950 hover:bg-white/90"
                      : "border border-white/15 text-white/90 hover:border-white/30",
                  ].join(" ")}
                  onClick={() => start(p.key)}
                >
                  Start for ${TRIAL.activationFee}
                </button>
                <div className="mt-2 text-xs text-white/55">
                  14-day trial • {TRIAL.includedCompletedCalls} completed calls included
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-sm text-white/70">
          <div className="font-semibold text-white/85">
            Enterprise / Carrier
          </div>
          <div className="mt-1">{ENTERPRISE.priceRange}</div>
          <ul className="mt-4 space-y-2">
            {ENTERPRISE.includes.slice(0, 6).map((x) => (
              <li key={x} className="flex gap-2">
                <span className="mt-[2px] inline-block h-4 w-4 rounded bg-white/15" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <a
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
              href="mailto:admin@neurospherevoiceai.com?subject=NeuroSphere%20Enterprise%20Demo"
            >
              Book a demo
            </a>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-sm text-white/70">
          <div className="font-semibold text-white/85">Optional Add-ons</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ADDONS.map((a) => (
              <div key={a.key} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white/85">{a.name}</div>
                  <div className="text-white/70">{a.price}</div>
                </div>
                <div className="mt-1 text-sm text-white/65">{a.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
