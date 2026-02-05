import { useEffect, useMemo, useState } from "react";
import CoreLayout from "../../components/layout/CoreLayout";

// ✅ Keep same voice options you already use elsewhere (values match backend IDs)
const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "shimmer", label: "Shimmer" },
  { value: "ash", label: "Ash" },
  { value: "ballad", label: "Ballad" },
  { value: "coral", label: "Coral" },
  { value: "sage", label: "Sage" },
  { value: "verse", label: "Verse" },
  { value: "cedar", label: "Cedar" },
  { value: "marin", label: "Marin" },
  { value: "sol", label: "Sol" },
] as const;

type PromptKey = "main" | "mood" | "knowledge" | "safety";
type PromptMode = "v1" | "v2";
type SliderKey =
  | "warmth" | "formality" | "humor" | "directness"
  | "empathy" | "confidence" | "curiosity" | "patience"
  | "creativity" | "analytical" | "storytelling" | "detail"
  | "assertiveness" | "humility" | "optimism" | "sarcasm"
  | "formalityShift" | "inclusive" | "memory" | "risk"
  | "selfReference" | "topicFocus" | "repetition" | "polish"
  | "intensity" | "caution" | "jargon" | "humorSensitivity"
  | "consistency" | "metaAwareness";

type CustomerConfigResponse = {
  success?: boolean;
  prompt_version?: PromptMode;
  system_prompts?: Record<PromptKey, string>;
  // other keys exist but we don't need them here yet
};

const SLIDER_KEYS: SliderKey[] = [
  "warmth","formality","humor","directness",
  "empathy","confidence","curiosity","patience",
  "creativity","analytical","storytelling","detail",
  "assertiveness","humility","optimism","sarcasm",
  "formalityShift","inclusive","memory","risk",
  "selfReference","topicFocus","repetition","polish",
  "intensity","caution","jargon","humorSensitivity",
  "consistency","metaAwareness",
];

const DEFAULT_50: Record<SliderKey, number> = SLIDER_KEYS.reduce((acc, k) => {
  acc[k] = 50;
  return acc;
}, {} as Record<SliderKey, number>);

// ✅ Your 6 presets + 2 expansions (we’ll refine numbers later)
const PRESETS: Record<string, Record<SliderKey, number>> = {
  professional: {
    ...DEFAULT_50,
    warmth: 60, formality: 80, humor: 20, directness: 70,
    empathy: 65, confidence: 85, patience: 80, analytical: 80,
    assertiveness: 70, polish: 90, caution: 70, topicFocus: 80,
    inclusive: 85, memory: 85,
  },
  friendly: {
    ...DEFAULT_50,
    warmth: 90, formality: 40, humor: 70, directness: 60,
    empathy: 85, confidence: 70, curiosity: 70, patience: 85,
    storytelling: 70, optimism: 85, jargon: 30, polish: 65,
  },
  assertive: {
    ...DEFAULT_50,
    directness: 90, confidence: 95, assertiveness: 95,
    warmth: 50, empathy: 50, patience: 50, risk: 70, topicFocus: 85,
  },
  empathetic: {
    ...DEFAULT_50,
    warmth: 90, empathy: 95, patience: 95, inclusive: 95,
    humor: 50, confidence: 65, optimism: 80, humorSensitivity: 85,
  },
  flirtatious: {
    ...DEFAULT_50,
    warmth: 95, humor: 85, optimism: 90, intensity: 75,
    formality: 15, directness: 45, risk: 65, caution: 30,
  },
  balanced: { ...DEFAULT_50 },

  // Added:
  concierge: {
    ...DEFAULT_50,
    warmth: 85, formality: 60, empathy: 80, patience: 85,
    polish: 80, topicFocus: 70, confidence: 75, humor: 45,
  },
  highEnergySales: {
    ...DEFAULT_50,
    warmth: 75, confidence: 90, assertiveness: 90, directness: 80,
    optimism: 90, intensity: 85, humor: 55, caution: 45,
  },
};

const STARTERS: Record<PromptKey, { label: string; value: string }[]> = {
  main: [
    { label: "Front Desk Receptionist", value: "You are a warm, confident front-desk receptionist. You sound human, calm, and capable." },
    { label: "Insurance Concierge", value: "You are a friendly insurance concierge. You guide callers, clarify needs, and hand off to licensed staff when required." },
    { label: "Professional Assistant", value: "You are a professional phone assistant. Clear, efficient, and helpful without sounding robotic." },
    { label: "Friendly Human Helper", value: "You sound like a real person: warm, relaxed, conversational, and approachable." },
    { label: "Sales-Oriented Agent", value: "You are upbeat and persuasive while staying honest and compliant. You guide callers toward next steps." },
    { label: "Calm Support Agent", value: "You are calm and reassuring, especially when the caller is stressed. You de-escalate and help." },
    { label: "Blank", value: "" },
  ],
  mood: [
    { label: "Calm & Reassuring", value: "Stay calm, steady, and reassuring. Avoid long awkward pauses." },
    { label: "Friendly & Upbeat", value: "Sound upbeat, friendly, and energized. Keep it human and easy." },
    { label: "Confident & Direct", value: "Sound confident and direct. Short sentences. No rambling." },
    { label: "Empathetic & Supportive", value: "Lead with empathy. Reflect feelings briefly, then help." },
    { label: "Playful & Light", value: "Light humor is welcome. Keep it tasteful and natural." },
    { label: "Neutral", value: "Neutral, clear, and helpful. No strong emotional tone." },
    { label: "Blank", value: "" },
  ],
  knowledge: [
    { label: "Insurance Agency (Auto/Home/Umbrella)", value: "You represent an insurance agency. You understand auto, home, and umbrella insurance at a high level." },
    { label: "Customer Service Generalist", value: "You handle general questions, collect details, and route to the right team." },
    { label: "Sales & Quoting Assistant", value: "You qualify leads, collect quote details, and book appointments." },
    { label: "Scheduling / Front Desk", value: "Your focus is scheduling, routing, and capturing accurate caller info." },
    { label: "Claims Support (Non-Legal)", value: "You help with claims intake steps and routing, without giving legal advice." },
    { label: "Blank", value: "" },
  ],
  safety: [
    { label: "Standard Customer Service Safety", value: "Do not provide legal/medical advice. If unsure, escalate. Do not invent facts." },
    { label: "Insurance Compliance", value: "Do not promise coverage, price, or binding. Route to licensed agent for coverage decisions." },
    { label: "Sales Compliance", value: "Be honest. No guarantees. Always confirm details before committing." },
    { label: "Minimal Guardrails", value: "Keep it safe and accurate. Escalate if unsure." },
    { label: "Custom", value: "" },
  ],
};

function getCustomerId(): string | null {
  // ✅ Works with your earlier patterns; adjust if you store it elsewhere
  return localStorage.getItem("customerId") || sessionStorage.getItem("customerId");
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-6 rounded-2xl backdrop-blur-sm"
      style={{
        background: "rgba(26, 26, 36, 0.75)",
        border: "1px solid rgba(138, 43, 226, 0.3)",
        boxShadow: "0 8px 32px rgba(255, 0, 140, 0.15)",
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-orange-600">
          <i className={`${icon} text-white text-xl`} />
        </div>
        <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Slider({
  k,
  label,
  value,
  onChange,
}: {
  k: SliderKey;
  label: string;
  value: number;
  onChange: (k: SliderKey, v: number) => void;
}) {
  return (
    <div className="col-md-6">
      <label className="block text-sm text-purple-300 mb-2">
        {label}: <span className="text-orange-300">{value}</span>/100
      </label>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(k, Number(e.target.value))}
        className="w-full accent-orange-500"
      />
    </div>
  );
}

export default function PersonalityStudioPage() {
  const [promptMode, setPromptMode] = useState<PromptMode>("v1");
  const [voice, setVoice] = useState<(typeof VOICE_OPTIONS)[number]["value"]>("sol");

  const [prompts, setPrompts] = useState<Record<PromptKey, string>>({
    main: "",
    mood: "",
    knowledge: "",
    safety: "",
  });

  const [preset, setPreset] = useState<string>("balanced");
  const [sliders, setSliders] = useState<Record<SliderKey, number>>({ ...DEFAULT_50 });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [memPolicy, setMemPolicy] = useState({
    useName: true,
    referenceNaturally: true,
    neverListMemory: true,
    avoidRepeats: true,
  });

  const [statusMsg, setStatusMsg] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  const applyStarter = (key: PromptKey, value: string) => {
    setPrompts((p) => ({ ...p, [key]: value }));
  };

  const applyPreset = (name: string) => {
    const next = PRESETS[name] || PRESETS.balanced;
    setPreset(name);
    setSliders({ ...next });
  };

  const setSlider = (k: SliderKey, v: number) => {
    setSliders((s) => ({ ...s, [k]: v }));
    if (preset !== "custom") setPreset("custom");
  };

  const assembledPreview = useMemo(() => {
    const sliderSummary = `Preset: ${preset}\nSliders (sample): warmth=${sliders.warmth}, formality=${sliders.formality}, humor=${sliders.humor}, directness=${sliders.directness}`;
    return [
      "=== MAIN SYSTEM PROMPT ===",
      prompts.main || "(empty)",
      "",
      "=== MOOD ===",
      prompts.mood || "(empty)",
      "",
      "=== KNOWLEDGE ===",
      prompts.knowledge || "(empty)",
      "",
      "=== SAFETY ===",
      prompts.safety || "(empty)",
      "",
      "=== PERSONALITY MODULATION ===",
      sliderSummary,
      "",
      "=== MEMORY BEHAVIOR ===",
      JSON.stringify(memPolicy, null, 2),
    ].join("\n");
  }, [prompts, sliders, preset, memPolicy]);

  const loadConfig = async () => {
    setIsLoadingConfig(true);
    setStatusMsg("");

    const customerId = getCustomerId();
    if (!customerId) {
      setStatusMsg("❌ No customerId found (local/session storage). Log in again.");
      setIsLoadingConfig(false);
      return;
    }

    try {
      const res = await fetch(`/api/customers/${customerId}/config`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setStatusMsg(`❌ Failed to load config: HTTP ${res.status} ${txt}`);
        setIsLoadingConfig(false);
        return;
      }

      const data = (await res.json()) as CustomerConfigResponse;

      const pv = (data.prompt_version || "v1") as PromptMode;
      setPromptMode(pv);

      const sp = data.system_prompts || {};
      setPrompts({
        main: sp.main || "",
        mood: sp.mood || "",
        knowledge: sp.knowledge || "",
        safety: sp.safety || "",
      });

      setStatusMsg("✅ Loaded saved prompts.");
    } catch (e: any) {
      setStatusMsg(`❌ Load error: ${e?.message || String(e)}`);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    setStatusMsg("");

    const customerId = getCustomerId();
    if (!customerId) {
      setStatusMsg("❌ No customerId found. Log in again.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/customers/${customerId}/config`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_prompts: {
            main: prompts.main,
            mood: prompts.mood,
            knowledge: prompts.knowledge,
            safety: prompts.safety,
          },
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setStatusMsg(`❌ Save Draft failed: HTTP ${res.status} ${txt}`);
        return;
      }

      setStatusMsg("✅ Draft saved. (Legacy stays until you Publish.)");
      await loadConfig();
    } catch (e: any) {
      setStatusMsg(`❌ Save error: ${e?.message || String(e)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const publish = async () => {
    setIsSaving(true);
    setStatusMsg("");

    const customerId = getCustomerId();
    if (!customerId) {
      setStatusMsg("❌ No customerId found. Log in again.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/customers/${customerId}/config`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt_version: "v2",
          system_prompts: {
            main: prompts.main,
            mood: prompts.mood,
            knowledge: prompts.knowledge,
            safety: prompts.safety,
          },
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setStatusMsg(`❌ Publish failed: HTTP ${res.status} ${txt}`);
        return;
      }

      setStatusMsg("🔥 Published. New calls will use Personality Studio (v2).");
      await loadConfig();
    } catch (e: any) {
      setStatusMsg(`❌ Publish error: ${e?.message || String(e)}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Load saved data when page opens
    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusBg =
    statusMsg.startsWith("❌") ? "rgba(239,68,68,0.2)" :
    statusMsg.startsWith("🔥") ? "rgba(249,115,22,0.2)" :
    statusMsg.startsWith("✅") ? "rgba(34,197,94,0.2)" :
    "rgba(255,255,255,0.03)";

  const statusColor =
    statusMsg.startsWith("❌") ? "#fca5a5" :
    statusMsg.startsWith("🔥") ? "#fdba74" :
    statusMsg.startsWith("✅") ? "#86efac" :
    "#d1d5db";

  return (
    <CoreLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                background: "linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PERSONALITY STUDIO
            </h1>
            <p className="text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              System prompts are now editable and saveable. Sliders wiring comes next.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                border: "1px solid rgba(138, 43, 226, 0.3)",
                background: "rgba(255,255,255,0.03)",
                color: promptMode === "v1" ? "#fbbf24" : "#86efac",
              }}
            >
              Mode: {promptMode === "v1" ? "Legacy (v1)" : "Studio (v2)"}
            </div>

            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(138, 43, 226, 0.2)",
                color: "#aaaaaa",
                opacity: isLoadingConfig ? 0.6 : 1,
              }}
              onClick={loadConfig}
              disabled={isLoadingConfig}
              title="Reload from server"
            >
              {isLoadingConfig ? "Loading…" : "Reload"}
            </button>

            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(138, 43, 226, 0.2)",
                color: "#aaaaaa",
                opacity: isSaving ? 0.6 : 1,
              }}
              onClick={saveDraft}
              disabled={isSaving}
              title="Save prompts without switching to v2"
            >
              {isSaving ? "Saving…" : "Save Draft"}
            </button>

            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(90deg, #8a2be2, #ff6a00)",
                opacity: isSaving ? 0.6 : 1,
              }}
              onClick={publish}
              disabled={isSaving}
              title="Save and activate v2 for calls"
            >
              {isSaving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>

        {/* Status */}
        {statusMsg && (
          <div
            className="max-w-6xl mx-auto mb-6 p-4 rounded-lg"
            style={{
              background: statusBg,
              border: "1px solid rgba(138,43,226,0.15)",
              color: statusColor,
            }}
          >
            {statusMsg}
          </div>
        )}

        {/* System Prompts */}
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main */}
            <Card title="Main System Prompt" icon="ri-file-text-line">
              <label className="block text-sm text-purple-300 mb-2">Starter</label>
              <select
                className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                onChange={(e) => applyStarter("main", STARTERS.main[Number(e.target.value)]?.value || "")}
              >
                <option value="">Choose starter…</option>
                {STARTERS.main.map((s, idx) => (
                  <option key={s.label} value={idx}>
                    {s.label}
                  </option>
                ))}
              </select>

              <label className="block text-sm text-purple-300 mt-4 mb-2">Text</label>
              <textarea
                className="w-full min-h-[160px] px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                value={prompts.main}
                onChange={(e) => setPrompts((p) => ({ ...p, main: e.target.value }))}
              />

              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(138, 43, 226, 0.25)", border: "1px solid rgba(138, 43, 226, 0.35)" }}
                  onClick={() => alert("AI Generate will be wired next (4o-mini).")}
                >
                  ✨ AI Generate
                </button>
                <button
                  className="px-4 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(138, 43, 226, 0.15)", color: "#aaaaaa" }}
                  onClick={() => setPrompts((p) => ({ ...p, main: "" }))}
                >
                  Reset
                </button>
              </div>
            </Card>

            {/* Mood */}
            <Card title="Mood Prompt" icon="ri-emotion-happy-line">
              <label className="block text-sm text-purple-300 mb-2">Starter</label>
              <select
                className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                onChange={(e) => applyStarter("mood", STARTERS.mood[Number(e.target.value)]?.value || "")}
              >
                <option value="">Choose starter…</option>
                {STARTERS.mood.map((s, idx) => (
                  <option key={s.label} value={idx}>
                    {s.label}
                  </option>
                ))}
              </select>

              <label className="block text-sm text-purple-300 mt-4 mb-2">Text</label>
              <textarea
                className="w-full min-h-[160px] px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                value={prompts.mood}
                onChange={(e) => setPrompts((p) => ({ ...p, mood: e.target.value }))}
              />

              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(138, 43, 226, 0.25)", border: "1px solid rgba(138, 43, 226, 0.35)" }}
                  onClick={() => alert("AI Generate will be wired next (4o-mini).")}
                >
                  ✨ AI Generate
                </button>
                <button
                  className="px-4 py-2 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(138, 43, 226, 0.15)", color: "#aaaaaa" }}
                  onClick={() => setPrompts((p) => ({ ...p, mood: "" }))}
                >
                  Reset
                </button>
              </div>
            </Card>

            {/* Knowledge */}
            <Card title="Knowledge Prompt" icon="ri-book-open-line">
              <label className="block text-sm text-purple-300 mb-2">Starter</label>
              <select
                className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                onChange={(e) => applyStarter("knowledge", STARTERS.knowledge[Number(e.target.value)]?.value || "")}
              >
                <option value="">Choose starter…</option>
                {STARTERS.knowledge.map((s, idx) => (
                  <option key={s.label} value={idx}>
                    {s.label}
                  </option>
                ))}
              </select>

              <label className="block text-sm text-purple-300 mt-4 mb-2">Text</label>
              <textarea
                className="w-full min-h-[160px] px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                value={prompts.knowledge}
                onChange={(e) => setPrompts((p) => ({ ...p, knowledge: e.target.value }))}
              />
            </Card>

            {/* Safety */}
            <Card title="Safety Prompt" icon="ri-shield-check-line">
              <div className="text-xs mb-2" style={{ color: "#fbbf24" }}>
                Guardrails only — do not describe tone here.
              </div>

              <label className="block text-sm text-purple-300 mb-2">Starter</label>
              <select
                className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                onChange={(e) => applyStarter("safety", STARTERS.safety[Number(e.target.value)]?.value || "")}
              >
                <option value="">Choose starter…</option>
                {STARTERS.safety.map((s, idx) => (
                  <option key={s.label} value={idx}>
                    {s.label}
                  </option>
                ))}
              </select>

              <label className="block text-sm text-purple-300 mt-4 mb-2">Text</label>
              <textarea
                className="w-full min-h-[160px] px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                value={prompts.safety}
                onChange={(e) => setPrompts((p) => ({ ...p, safety: e.target.value }))}
              />
            </Card>
          </div>

          {/* Personality (still UI-only for now) */}
          <Card title="Personality Presets & Sliders (UI-only for now)" icon="ri-sliders-line">
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                ["professional", "👔 Professional"],
                ["friendly", "😊 Friendly"],
                ["assertive", "💪 Assertive"],
                ["empathetic", "❤️ Empathetic"],
                ["flirtatious", "💋 Flirtatious"],
                ["balanced", "⚖️ Balanced"],
                ["concierge", "🛎️ Concierge"],
                ["highEnergySales", "⚡ High Energy"],
              ].map(([k, label]) => (
                <button
                  key={k}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{
                    border: "1px solid rgba(138, 43, 226, 0.25)",
                    background: preset === k ? "rgba(138, 43, 226, 0.2)" : "rgba(255,255,255,0.03)",
                    color: preset === k ? "#ff6a00" : "#aaaaaa",
                  }}
                  onClick={() => applyPreset(k)}
                >
                  {label}
                </button>
              ))}
              {preset === "custom" && (
                <div className="px-3 py-2 text-sm rounded-lg" style={{ color: "#fbbf24", border: "1px dashed rgba(251,191,36,0.5)" }}>
                  Custom
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Slider k="warmth" label="Warmth / Friendliness" value={sliders.warmth} onChange={setSlider} />
              <Slider k="formality" label="Formality / Politeness" value={sliders.formality} onChange={setSlider} />
              <Slider k="humor" label="Humor / Wit" value={sliders.humor} onChange={setSlider} />
              <Slider k="directness" label="Directness / Brevity" value={sliders.directness} onChange={setSlider} />

              <Slider k="empathy" label="Empathy" value={sliders.empathy} onChange={setSlider} />
              <Slider k="confidence" label="Confidence" value={sliders.confidence} onChange={setSlider} />
              <Slider k="curiosity" label="Curiosity" value={sliders.curiosity} onChange={setSlider} />
              <Slider k="patience" label="Patience" value={sliders.patience} onChange={setSlider} />
            </div>

            <button
              className="mt-5 w-full px-4 py-3 rounded-lg text-white font-semibold"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(138, 43, 226, 0.2)",
              }}
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? "Hide Advanced Sliders" : "Show Advanced Sliders"}
            </button>

            {showAdvanced && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Slider k="polish" label="Polish / Fluency" value={sliders.polish} onChange={setSlider} />
                <Slider k="intensity" label="Emotional Intensity" value={sliders.intensity} onChange={setSlider} />
                <Slider k="caution" label="Caution / Guardrails" value={sliders.caution} onChange={setSlider} />
                <Slider k="jargon" label="Jargon / Technicality" value={sliders.jargon} onChange={setSlider} />
                <Slider k="metaAwareness" label="Meta Awareness" value={sliders.metaAwareness} onChange={setSlider} />
                <Slider k="memory" label="Memory Emphasis" value={sliders.memory} onChange={setSlider} />
                <Slider k="risk" label="Risk Taking" value={sliders.risk} onChange={setSlider} />
                <Slider k="sarcasm" label="Sarcasm" value={sliders.sarcasm} onChange={setSlider} />
              </div>
            )}
          </Card>

          {/* Voice + Memory + Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Voice Selection (UI-only for now)" icon="ri-mic-line">
              <label className="block text-sm text-purple-300 mb-2">OpenAI Voice</label>
              <select
                className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                value={voice}
                onChange={(e) => setVoice(e.target.value as any)}
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label} ({v.value})
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-400 mt-2">(We’ll wire voice saving next.)</div>
            </Card>

            <Card title="Memory Behavior (UI-only for now)" icon="ri-brain-2-line">
              <label className="flex items-center gap-2 text-sm text-gray-200">
                <input
                  type="checkbox"
                  checked={memPolicy.useName}
                  onChange={(e) => setMemPolicy((m) => ({ ...m, useName: e.target.checked }))}
                />
                Use caller name when confident
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-200 mt-2">
                <input
                  type="checkbox"
                  checked={memPolicy.referenceNaturally}
                  onChange={(e) => setMemPolicy((m) => ({ ...m, referenceNaturally: e.target.checked }))}
                />
                Reference past conversations naturally
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-200 mt-2">
                <input
                  type="checkbox"
                  checked={memPolicy.neverListMemory}
                  onChange={(e) => setMemPolicy((m) => ({ ...m, neverListMemory: e.target.checked }))}
                />
                Never list memories explicitly
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-200 mt-2">
                <input
                  type="checkbox"
                  checked={memPolicy.avoidRepeats}
                  onChange={(e) => setMemPolicy((m) => ({ ...m, avoidRepeats: e.target.checked }))}
                />
                Avoid repeating known facts
              </label>
            </Card>
          </div>

          <Card title="Preview" icon="ri-eye-line">
            <pre
              className="w-full p-4 rounded-lg text-xs overflow-auto"
              style={{
                background: "#0d0d12",
                border: "1px solid rgba(138, 43, 226, 0.2)",
                color: "#d1d5db",
                maxHeight: 340,
              }}
            >
              {assembledPreview}
            </pre>
          </Card>
        </div>
      </div>
    </CoreLayout>
  );
}
