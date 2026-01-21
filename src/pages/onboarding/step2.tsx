import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./_Shell";
import { getOrCreateOnboarding, saveOnboarding } from "../../lib/onboarding";

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const ob = getOrCreateOnboarding();

  const [aiName, setAiName] = useState(ob.step2?.aiName ?? "Samantha");
  const [greeting, setGreeting] = useState(
    ob.step2?.greeting ?? "Thanks for calling! How can I help you today?"
  );
  const [tone, setTone] = useState(ob.step2?.tone ?? "friendly");
  const [customTone, setCustomTone] = useState(ob.step2?.customTone ?? "");

  function back() {
    navigate("/onboarding/1");
  }

  function next() {
    saveOnboarding({
      ...ob,
      step2: {
        aiName,
        greeting,
        tone: tone as any,
        customTone: tone === "custom" ? customTone : undefined,
      },
    });
    navigate("/onboarding/3");
  }

  return (
    <OnboardingShell
      step={2}
      title="AI Basics"
      subtitle="Name your agent and set the opening greeting. You can refine later."
    >
      <div className="grid gap-4">
        <Field label="AI name" value={aiName} onChange={setAiName} required />
        <div>
          <label className="block text-sm font-semibold text-white/85">Opening greeting *</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            rows={4}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white/85">Tone *</label>
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="bold">Bold / direct</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {tone === "custom" && (
          <div>
            <label className="block text-sm font-semibold text-white/85">Custom tone notes</label>
            <textarea
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
              rows={3}
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
              placeholder="Example: warm, confident, no-nonsense, short answers..."
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
            onClick={back}
          >
            Back
          </button>
          <button
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90 disabled:opacity-40"
            onClick={next}
            disabled={!aiName || !greeting}
          >
            Continue
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white/85">
        {props.label}{props.required ? " *" : ""}
      </label>
      <input
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
