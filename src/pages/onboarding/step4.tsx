import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./_Shell";
import { getOrCreateOnboarding, saveOnboarding } from "../../lib/onboarding";

export default function OnboardingStep4() {
  const navigate = useNavigate();
  const ob = getOrCreateOnboarding();

  const [voicePreset, setVoicePreset] = useState(ob.step4?.voicePreset ?? "warm");
  const [customVoiceId, setCustomVoiceId] = useState(ob.step4?.customVoiceId ?? "");
  const [knowledgeNotes, setKnowledgeNotes] = useState(ob.step4?.knowledgeNotes ?? "");

  function back() {
    navigate("/onboarding/3");
  }

  function next() {
    saveOnboarding({
      ...ob,
      step4: {
        voicePreset: voicePreset as any,
        customVoiceId: voicePreset === "custom" ? customVoiceId : undefined,
        knowledgeNotes: knowledgeNotes || undefined,
      },
    });
    navigate("/onboarding/checkout");
  }

  return (
    <OnboardingShell
      step={4}
      title="Voice + Knowledge"
      subtitle="Pick a starting voice preset. You can upload documents and refine your knowledge base in the dashboard."
    >
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-semibold text-white/85">Voice preset *</label>
          <select
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            value={voicePreset}
            onChange={(e) => setVoicePreset(e.target.value)}
          >
            <option value="warm">Warm</option>
            <option value="crisp">Crisp</option>
            <option value="deep">Deep</option>
            <option value="custom">Custom (voice ID)</option>
          </select>
        </div>

        {voicePreset === "custom" && (
          <div>
            <label className="block text-sm font-semibold text-white/85">Custom voice ID</label>
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
              value={customVoiceId}
              onChange={(e) => setCustomVoiceId(e.target.value)}
              placeholder="Example: ElevenLabs voice_id"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-white/85">Knowledge base notes (optional)</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            rows={4}
            value={knowledgeNotes}
            onChange={(e) => setKnowledgeNotes(e.target.value)}
            placeholder="What do you want your agent to know? Example: Services, coverage rules, FAQs, hours, appointment booking..."
          />
        </div>

        <div className="flex gap-3">
          <button
            className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
            onClick={back}
          >
            Back
          </button>
          <button
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
            onClick={next}
          >
            Continue to payment
          </button>
        </div>
      </div>
    </OnboardingShell>
  );
}
