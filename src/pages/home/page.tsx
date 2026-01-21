import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Plan = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  highlights: string[];
  cta: string;
  popular?: boolean;
};

export default function MarketingHome() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Set this in your env as VITE_SALES_EMAIL="you@yourdomain.com"
  const salesEmail =
    (import.meta as any).env?.VITE_SALES_EMAIL || "sales@yourdomain.com";

  const plans: Plan[] = useMemo(
    () => [
      {
        name: "Starter",
        price: "$499",
        cadence: "/mo",
        description: "For a single location getting live fast.",
        highlights: [
          "Inbound AI receptionist",
          "Basic call routing",
          "Call summaries + transcripts",
          "Standard support",
        ],
        cta: "Start Starter",
      },
      {
        name: "Growth",
        price: "$1,499",
        cadence: "/mo",
        description: "For teams that want inbound + outbound automation.",
        highlights: [
          "Inbound + outbound campaigns",
          "Memory + lead context",
          "Appointment booking hooks",
          "Priority support",
        ],
        cta: "Choose Growth",
        popular: true,
      },
      {
        name: "Enterprise",
        price: "Let’s talk",
        cadence: "",
        description: "For multi-location, high volume, and deep integrations.",
        highlights: [
          "Multi-tenant controls",
          "Custom integrations (CRM / AMS)",
          "Dedicated routing + transfer rules",
          "SLA + white-label options",
        ],
        cta: "Book a demo",
      },
    ],
    [],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const subject = encodeURIComponent("NeuroSphere — Sign up / Demo request");
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Company: ${form.company}`,
        `Phone: ${form.phone}`,
        "",
        "Message:",
        form.message || "(none)",
      ].join("\n"),
    );

    // No backend needed — this works immediately.
    window.location.href = `mailto:${salesEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-orange-400" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">
                NeuroSphere
              </div>
              <div className="text-xs text-white/60">Voice • Brain • Memory</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a className="hover:text-white" href="#what">
              What it is
            </a>
            <a className="hover:text-white" href="#modules">
              Modules
            </a>
            <a className="hover:text-white" href="#how">
              How it works
            </a>
            <a className="hover:text-white" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-white" href="#signup">
              Sign up
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:border-white/30 hover:text-white"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <a
              href="#signup"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
            >
              Request access
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500 blur-3xl" />
          <div className="absolute -bottom-48 right-0 h-[520px] w-[520px] rounded-full bg-orange-400 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 relative">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
                MT SaaS Voice AI Platform • Built for real businesses
              </p>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
                The AI phone system that actually{" "}
                <span className="bg-gradient-to-r from-violet-400 to-orange-300 bg-clip-text text-transparent">
                  remembers
                </span>
                .
              </h1>

              <p className="mt-5 text-base text-white/70 md:text-lg">
                NeuroSphere unifies <b>voice</b>, an LLM <b>brain</b>, and
                persistent <b>memory</b> so your inbound and outbound calls feel
                human, consistent, and on-brand.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
                >
                  View pricing
                </a>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
                >
                  Open dashboard
                </button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-xs text-white/60">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-white/90 font-semibold">Realtime</div>
                  <div>Low-latency calls</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-white/90 font-semibold">Persistent</div>
                  <div>Memory & context</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-white/90 font-semibold">MT SaaS</div>
                  <div>Tenant controls</div>
                </div>
              </div>
            </div>

            {/* Right-side card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
              <div className="text-sm font-semibold text-white/90">
                What NeuroSphere is
              </div>
              <p className="mt-2 text-sm text-white/70">
                Think of it as a call center agent that never forgets, never
                panics, and follows your rules.
              </p>

              <div className="mt-6 space-y-3">
                <FeatureRow
                  title="Voice"
                  desc="Natural speech output + call handling"
                />
                <FeatureRow
                  title="Brain"
                  desc="LLM orchestration + knowledge base"
                />
                <FeatureRow
                  title="Memory"
                  desc="Customer context, preferences, history"
                />
                <FeatureRow
                  title="Rules"
                  desc="Transfer rules, routing, compliance guardrails"
                />
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-4 text-xs text-white/65">
                <div className="font-semibold text-white/85">Ideal for:</div>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>Insurance agencies (inbound + outbound)</li>
                  <li>Local service businesses</li>
                  <li>Teams that need consistency + speed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section id="what" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">What is NeuroSphere?</h2>
        <p className="mt-3 max-w-3xl text-white/70">
          NeuroSphere is a multi-tenant SaaS platform for voice agents. It’s not
          “a chatbot with a phone.” It’s a system: call flow, memory, rules,
          orchestration, admin controls — all in one place.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card
            title="Inbound AI Receptionist"
            desc="Answer, qualify, route, transfer, and capture leads — without dropping the ball."
          />
          <Card
            title="Outbound Automations"
            desc="Call leads, renewals, win-backs, claims follow-ups — with context and consistency."
          />
          <Card
            title="Memory + Guardrails"
            desc="Remember caller history and enforce transfer & compliance rules."
          />
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">Modules</h2>
        <p className="mt-3 max-w-3xl text-white/70">
          Build the stack you need. Start simple. Add power as you scale.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <ListCard
            title="Phone AI Core"
            items={[
              "Twilio call handling + routing",
              "Transfer rules + escalation paths",
              "Realtime streaming voice",
            ]}
          />
          <ListCard
            title="AI Brain"
            items={[
              "LLM orchestration",
              "Knowledge base ingestion",
              "Prompt + personality controls",
            ]}
          />
          <ListCard
            title="Memory"
            items={[
              "Caller profiles + history",
              "Lead context storage",
              "Admin settings + per-tenant overrides",
            ]}
          />
          <ListCard
            title="Admin Panel"
            items={[
              "Tenant configuration",
              "Voice settings + greetings",
              "Auditing + logs (roadmap)",
            ]}
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">How it works</h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Step
            n="01"
            title="Route the call"
            desc="Inbound/outbound calls enter your configured flow: greetings, qualification, routing."
          />
          <Step
            n="02"
            title="Think with context"
            desc="The brain pulls knowledge + memory, then generates a response aligned to your rules."
          />
          <Step
            n="03"
            title="Act + remember"
            desc="Transfers, actions, summaries, and memory updates keep the next interaction consistent."
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Pricing</h2>
            <p className="mt-2 max-w-2xl text-white/70">
              Start lean, then scale. (We’ll tune pricing to your call volume and
              feature set.)
            </p>
          </div>
          <a
            href="#signup"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
          >
            Request access
          </a>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-2xl border p-6",
                p.popular
                  ? "border-white/25 bg-white/10"
                  : "border-white/10 bg-white/5",
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
                <div className="text-sm text-white/60">{p.cadence}</div>
              </div>

              <p className="mt-3 text-sm text-white/70">{p.description}</p>

              <ul className="mt-5 space-y-2 text-sm text-white/75">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-[2px] inline-block h-4 w-4 rounded bg-white/15" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <a
                  href="#signup"
                  className={[
                    "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold",
                    p.popular
                      ? "bg-white text-slate-950 hover:bg-white/90"
                      : "border border-white/15 text-white/90 hover:border-white/30",
                  ].join(" ")}
                >
                  {p.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-white/50">
          *Prices shown are placeholders — replace with your real tiers once
          you’re ready.
        </p>
      </section>

      {/* Signup */}
      <section id="signup" className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">
                Request access / Sign up
              </h2>
              <p className="mt-3 text-white/70">
                Fill this out and it’ll open an email to your sales inbox. No
                backend required yet — we can wire a real signup API next.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-white/70">
                <div className="font-semibold text-white/85">Next step after this:</div>
                <div className="mt-1">
                  We’ll connect this form to a real signup endpoint and auto-provision a
                  tenant.
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  required
                />
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Company"
                  value={form.company}
                  onChange={(v) => setForm((f) => ({ ...f, company: v }))}
                />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white/85">
                  Message
                </label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  placeholder="What are you trying to automate (inbound, outbound, both)?"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
              >
                Send request
              </button>

              {submitted && (
                <div className="text-xs text-white/60">
                  If your email app didn’t open, set{" "}
                  <code className="rounded bg-white/10 px-1 py-[1px]">
                    VITE_SALES_EMAIL
                  </code>{" "}
                  in your env (or check your browser mail handler).
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} NeuroSphere</div>
          <div className="flex gap-5">
            <a className="hover:text-white" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-white" href="#signup">
              Sign up
            </a>
            <button
              className="hover:text-white"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureRow(props: { title: string; desc: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/30 p-3">
      <div className="text-sm font-semibold text-white/90">{props.title}</div>
      <div className="text-sm text-white/65">{props.desc}</div>
    </div>
  );
}

function Card(props: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-lg font-bold">{props.title}</div>
      <p className="mt-2 text-sm text-white/70">{props.desc}</p>
    </div>
  );
}

function ListCard(props: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-lg font-bold">{props.title}</div>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
        {props.items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function Step(props: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs font-semibold text-white/60">{props.n}</div>
      <div className="mt-2 text-lg font-bold">{props.title}</div>
      <p className="mt-2 text-sm text-white/70">{props.desc}</p>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white/85">
        {props.label}
      </label>
      <input
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={props.required}
      />
    </div>
  );
}
