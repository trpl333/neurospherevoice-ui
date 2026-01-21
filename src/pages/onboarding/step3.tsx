import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./_Shell";
import { getOrCreateOnboarding, saveOnboarding } from "../../lib/onboarding";

export default function OnboardingStep3() {
  const navigate = useNavigate();
  const ob = getOrCreateOnboarding();

  const [businessHours, setBusinessHours] = useState(ob.step3?.businessHours ?? "Mon–Fri 9am–5pm");
  const [transferEnabled, setTransferEnabled] = useState(ob.step3?.transferEnabled ?? true);
  const [transferPhone, setTransferPhone] = useState(ob.step3?.transferPhone ?? "");
  const [transferWhen, setTransferWhen] = useState(ob.step3?.transferWhen ?? "on_request");
  const [transferNotes, setTransferNotes] = useState(ob.step3?.transferNotes ?? "");

  function back() {
    navigate("/onboarding/2");
  }

  function next() {
    saveOnboarding({
      ...ob,
      step3: {
        businessHours,
        transferEnabled,
        transferPhone: transferEnabled ? transferPhone : undefined,
        transferWhen: transferWhen as any,
        transferNotes: transferNotes || undefined,
      },
    });
    navigate("/onboarding/4");
  }

  return (
    <OnboardingShell
      step={3}
      title="Phone Rules"
      subtitle="Basic transfer behavior. We’ll expand into full routing rules later."
    >
      <div className="grid gap-4">
        <Field label="Business hours" value={businessHours} onChange={setBusinessHours} required />

        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white/85">Enable call transfer</div>
              <div className="text-xs text-white/55">Send calls to a human when needed.</div>
            </div>
            <input
              type="checkbox"
              checked={transferEnabled}
              onChange={(e) => setTransferEnabled(e.target.checked)}
            />
          </div>

          {transferEnabled && (
            <div className="mt-4 grid gap-4">
              <Field
                label="Transfer phone number"
                value={transferPhone}
                onChange={setTransferPhone}
                required
              />

              <div>
                <label className="block text-sm font-semibold text-white/85">Transfer timing</label>
                <select
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                  value={transferWhen}
                  onChange={(e) => setTransferWhen(e.target.value)}
                >
                  <option value="on_request">Only when caller asks</option>
                  <option value="after_hours">After-hours only</option>
                  <option value="always">Always offer human option</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/85">Notes (optional)</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                  rows={3}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Example: Transfer only if caller is upset, asks for licensed agent, or needs claims."
                />
              </div>
            </div>
          )}
        </div>

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
            disabled={!businessHours || (transferEnabled && !transferPhone)}
          >
            Continue
          </button>
        </div>
      </div>
    </OnboardingShell>
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
