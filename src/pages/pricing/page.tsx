import { useNavigate } from "react-router-dom";
import { getOrCreateOnboarding, type PlanId } from "../../lib/onboarding";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  cadence?: string;
  tagline: string;
  bullets: string[];
  cta: string;
  popular?: boolean;
};

export default function PricingPage() {
  const navigate = useNavigate();

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: "$499",
      cadence: "/mo",
      tagline: "For a single location getting live fast.",
      bullets: [
        "Inbound AI receptionist",
        "Basic routing + transfers",
        "Transcripts + summaries",
        "Standard support",
      ],
      cta: "Start Starter",
    },
    {
      id: "growth",
      name: "Growth",
      price: "$1,499",
      cadence: "/mo",
      tagline: "Inbound + outbound automations for teams.",
      bullets: [
        "Inbound + outbound campaigns",
        "Memory + lead context",
        "Transfer rules + guardrails",
        "Priority support",
      ],
      cta: "Start Growth",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Let’s talk",
      tagline: "High volume, multi-location, custom integrations.",
      bullets: [
        "Multi-tenant controls",
        "Custom integrations (CRM/AMS)",
        "SLA + dedicated routing",
        "White-label options",
      ],
      cta: "Book a demo",
    },
  ];

  function start(plan: PlanId) {
    getOrCreateOnboarding(plan);
    navigate("/onboarding/1");
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-orange-400" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">NeuroSphere</div>
              <div className="text-xs text-white/60">Voice • Brain • Memory</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30 hover:text-white"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
              onClick={() => start("growth")}
            >
              Start
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Pricing</h1>
        <p className="mt-3 max-w-3xl text-white/70">
          Simple tiers now. We’ll refine pricing by call volume and features as we scale. Pick a plan and onboard in minutes.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={[
                "rounded-2xl border p-6",
                p.popular ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              {p.popular && (
                <div className="mb-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">
                  Most popular
                </div>
              )}

              <div className="text-lg font-bold">{p.name}</div>
              <div className="mt-2 flex items-end gap-2">
                <div className="text-3xl font-extrabold">{p.price}</div>
                {p.cadence && <div className="text-sm text-white/60">{p.cadence}</div>}
              </div>

              <p className="mt-3 text-sm text-white/70">{p.tagline}</p>

              <ul className="mt-5 space-y-2 text-sm text-white/75">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-[2px] inline-block h-4 w-4 rounded bg-white/15" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {p.id === "enterprise" ? (
                  <a
                    className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
                    href="mailto:admin@neurospherevoiceai.com?subject=NeuroSphere%20Enterprise%20Demo"
                  >
                    {p.cta}
                  </a>
                ) : (
                  <button
                    className={[
                      "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold",
                      p.popular ? "bg-white text-slate-950 hover:bg-white/90" : "border border-white/15 text-white/90 hover:border-white/30",
                    ].join(" ")}
                    onClick={() => start(p.id)}
                  >
                    {p.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-sm text-white/70">
          <div className="font-semibold text-white/85">What happens after you click Start?</div>
          <ol className="mt-3 list-decimal space-y-1 pl-5">
            <li>We collect your business + AI setup basics.</li>
            <li>You pay via Stripe Checkout.</li>
            <li>We generate your account number + provision your tenant.</li>
            <li>You land in your dashboard, ready to configure.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
