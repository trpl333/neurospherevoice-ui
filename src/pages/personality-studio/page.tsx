import { useEffect, useMemo, useState } from "react";
import CoreLayout from "../../components/layout/CoreLayout";

// -----------------------------------------------------------------------------
// Backend API base (MUST be nginx/Flask, not Vercel)
// -----------------------------------------------------------------------------
// In prod, set:
//   VITE_API_URL=https://app.neurospherevoiceai.com/api
// -----------------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL || "https://app.neurospherevoiceai.com/api";

type PromptBlocksLoadResponse = {
  success?: boolean;
  blocks?: Record<string, any>;
  error?: string;
};

type PromptBlocksSaveResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

type PromptBlocksPresetsResponse = {
  success?: boolean;
  categories?: Record<string, any>;
  error?: string;
};

type PromptKey = "main" | "mood" | "knowledge" | "safety";
type BlockKey =
  | "system_role"
  | "emotional_tone"
  | "knowledge_context"
  | "safety_boundaries"
  | "conversational_style";

type SliderKey =
  | "warmth" | "formality" | "humor" | "directness"
  | "empathy" | "confidence" | "curiosity" | "patience"
  | "creativity" | "analytical" | "storytelling" | "detail"
  | "assertiveness" | "humility" | "optimism" | "sarcasm"
  | "formalityShift" | "inclusive" | "memory" | "risk"
  | "selfReference" | "topicFocus" | "repetition" | "polish"
  | "intensity" | "caution" | "jargon" | "humorSensitivity"
  | "consistency" | "metaAwareness";

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

// ✅ Presets are UI-only; sliders are saved server-side (customer config)
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
    { label: "Blank", value: "" },
  ],
  safety: [
    { label: "Standard Customer Service Safety", value: "Do not provide legal/medical advice. If unsure, escalate. Do not invent facts." },
    { label: "Strict Compliance", value: "Follow compliance: no guarantees, no legal advice, no policy binding. Escalate for coverage decisions." },
    { label: "Blank", value: "" },
  ],
};

function Card({ title, icon, children }: any) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(138, 43, 226, 0.15)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <i className={`${icon} text-purple-300`} style={{ fontSize: 18 }} />
        <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
    <div
      className="p-4 rounded-lg"
      style={{
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(138, 43, 226, 0.12)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-200">{label}</div>
        <div className="text-sm" style={{ color: "#fbbf24" }}>
          {value}
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(k, Number(e.target.value))}
        className="w-full mt-3"
      />
    </div>
  );
}

export default function PersonalityStudioPage() {
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Prompt blocks (server)
  const [serverBlocks, setServerBlocks] = useState<Record<string, any>>({});
  const [isSavingField, setIsSavingField] = useState<BlockKey | null>(null);

  // Customer config (server) — sliders
  const [isSavingSliders, setIsSavingSliders] = useState(false);

  const [prompts, setPrompts] = useState<Record<PromptKey, string>>({
    main: "",
    mood: "",
    knowledge: "",
    safety: "",
  });

  const [preset, setPreset] = useState<string>("balanced");
  const [sliders, setSliders] = useState<Record<SliderKey, number>>({ ...DEFAULT_50 });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getCustomerId = () =>
    localStorage.getItem("customerId") || sessionStorage.getItem("customerId");

  const parseJsonOrThrow = async <T,>(res: Response): Promise<T> => {
    const ct = (res.headers.get("content-type") || "").toLowerCase();

    if (ct.includes("application/json")) {
      return (await res.json()) as T;
    }

    // If we hit Vercel / SPA, we'll usually get text/html → index.html
    const txt = await res.text().catch(() => "");
    const preview = txt.slice(0, 240).replace(/\s+/g, " ").trim();

    throw new Error(
      `Expected JSON but got "${ct || "unknown"}". Preview: ${preview || "(empty)"}`
    );
  };

  const blocksToPrompts = (blocks: Record<string, any>) => {
    const systemRole = blocks.system_role ?? "";
    const emotionalTone = blocks.emotional_tone ?? "";
    const knowledgeContext = blocks.knowledge_context ?? "";
    const safetyBoundaries = blocks.safety_boundaries ?? "";

    setPrompts({
      main: typeof systemRole === "string" ? systemRole : "",
      mood: typeof emotionalTone === "string" ? emotionalTone : "",
      knowledge: typeof knowledgeContext === "string" ? knowledgeContext : "",
      safety: typeof safetyBoundaries === "string" ? safetyBoundaries : "",
    });
  };

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

  const loadPromptBlocks = async () => {
    setIsLoading(true);
    setStatusMsg("");

    try {
      const res = await fetch(`${API_BASE}/prompt-blocks/load`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        setStatusMsg("❌ Unauthorized. Please log in again.");
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setStatusMsg(`❌ Failed to load prompts: HTTP ${res.status} ${txt}`);
        return;
      }

      const data = await parseJsonOrThrow<PromptBlocksLoadResponse>(res);

      if (!data?.success) {
        setStatusMsg(`❌ Failed to load prompts: ${data?.error || "unknown error"}`);
        return;
      }

      // Blocks can be stored as preset keys; resolve to prompt text for display.
      let displayBlocks: Record<string, any> = { ...(data.blocks || {}) };

      try {
        const presRes = await fetch(`${API_BASE}/prompt-blocks/presets`, {
          method: "GET",
          credentials: "include",
        });

        if (presRes.ok) {
          const pres = await parseJsonOrThrow<PromptBlocksPresetsResponse>(presRes);
          const cats = pres?.categories || {};

          const resolvePreset = (categoryKey: string, value: any) => {
            if (typeof value !== "string") return value;
            const presets = cats?.[categoryKey]?.presets || {};
            const hit = presets?.[value];
            return hit?.prompt || value;
          };

          displayBlocks = {
            ...displayBlocks,
            system_role: resolvePreset("system_role", displayBlocks.system_role),
            emotional_tone: resolvePreset("emotional_tone", displayBlocks.emotional_tone),
            conversational_style: resolvePreset("conversational_style", displayBlocks.conversational_style),
            knowledge_context: resolvePreset("knowledge_context", displayBlocks.knowledge_context),
            safety_boundaries: resolvePreset("safety_boundaries", displayBlocks.safety_boundaries),
          };
        }
      } catch {
        // non-fatal
      }

      setServerBlocks(displayBlocks);
      blocksToPrompts(displayBlocks);
      setStatusMsg("✅ Loaded prompt settings.");
    } catch (e: any) {
      setStatusMsg(`❌ Load error: ${e?.message || String(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSliders = async () => {
    try {
      const customerId = getCustomerId();
      if (!customerId) return;

      const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) return;

      const cfg = await parseJsonOrThrow<any>(res);
      const saved = cfg?.sliders;

      if (saved && typeof saved === "object") {
        // Only apply known numeric keys to avoid weirdness.
        const next: Record<SliderKey, number> = { ...DEFAULT_50 };
        let hasAny = false;

        for (const k of SLIDER_KEYS) {
          const v = saved[k];
          if (typeof v === "number" && Number.isFinite(v)) {
            next[k] = Math.min(100, Math.max(0, v));
            hasAny = true;
          }
        }

        if (hasAny) {
          setSliders(next);
          setPreset("custom");
        }
      }
    } catch {
      // non-fatal
    }
  };

  const saveBlocks = async (nextBlocks: Record<string, any>, savedLabel: string) => {
    const res = await fetch(`${API_BASE}/prompt-blocks/save`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocks: nextBlocks }),
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized. Please log in again.");
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${txt}`);
    }

    const data = await parseJsonOrThrow<PromptBlocksSaveResponse>(res);

    if (!data?.success) {
      throw new Error(data?.error || "Unknown error saving prompt blocks");
    }

    setServerBlocks(nextBlocks);
    setStatusMsg(`✅ Saved ${savedLabel}.`);
  };

  const savePromptField = async (field: BlockKey, value: string, label: string) => {
    setIsSavingField(field);
    setStatusMsg("");

    try {
      // Merge so we never wipe other categories.
      const nextBlocks = { ...serverBlocks, [field]: value };
      await saveBlocks(nextBlocks, label);
    } catch (e: any) {
      setStatusMsg(`❌ Save failed: ${e?.message || String(e)}`);
    } finally {
      setIsSavingField(null);
    }
  };

  const saveSlidersToServer = async () => {
    setIsSavingSliders(true);
    setStatusMsg("");

    try {
      const customerId = getCustomerId();
      if (!customerId) {
        setStatusMsg("❌ No customer ID found. Please log in again.");
        return;
      }

      // Backend accepts "sliders" as a dict and mirrors to AI-Memory.
      const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sliders }),
      });

      if (res.status === 401 || res.status === 403) {
        setStatusMsg("❌ Unauthorized. Please log in again.");
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        setStatusMsg(`❌ Save failed: HTTP ${res.status} ${txt}`);
        return;
      }

      setStatusMsg("✅ Saved sliders.");
      // Pull back what backend actually stored (optional, but keeps us honest)
      await loadSliders();
    } catch (e: any) {
      setStatusMsg(`❌ Save failed: ${e?.message || String(e)}`);
    } finally {
      setIsSavingSliders(false);
    }
  };

  useEffect(() => {
    // Load both prompt blocks + sliders on open
    loadPromptBlocks();
    loadSliders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      "=== STYLE (SLIDERS) ===",
      sliderSummary,
    ].join("\n");
  }, [prompts, sliders, preset]);

  const statusBg =
    statusMsg.startsWith("❌") ? "rgba(239,68,68,0.2)" :
    statusMsg.startsWith("✅") ? "rgba(34,197,94,0.2)" :
    "rgba(255,255,255,0.03)";

  const statusColor =
    statusMsg.startsWith("❌") ? "#fca5a5" :
    statusMsg.startsWith("✅") ? "#86efac" :
    "#d1d5db";

  return (
    <CoreLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-6">
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
              Prompt + style controls. Every Save writes to the server immediately.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(138, 43, 226, 0.2)",
                color: "#aaaaaa",
                opacity: isLoading ? 0.6 : 1,
              }}
              onClick={() => { loadPromptBlocks(); loadSliders(); }}
              disabled={isLoading || !!isSavingField || isSavingSliders}
              title="Reload from server"
            >
              {isLoading ? "Loading…" : "Reload"}
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

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Prompts */}
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

              {/* Buttons: AI Generate | Save */}
              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(138, 43, 226, 0.25)", border: "1px solid rgba(138, 43, 226, 0.35)" }}
                  onClick={() => alert("AI Generate will be wired later (4o-mini).")}
                >
                  ✨ AI Generate
                </button>

                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(138, 43, 226, 0.25)" }}
                  onClick={() => savePromptField("system_role", prompts.main, "Main prompt")}
                  disabled={isSavingField === "system_role"}
                  title="Save to server immediately"
                >
                  {isSavingField === "system_role" ? "Saving…" : "💾 Save"}
                </button>
              </div>

              <button
                className="mt-3 text-sm"
                style={{ color: "#aaaaaa" }}
                onClick={() => setPrompts((p) => ({ ...p, main: "" }))}
              >
                Reset
              </button>
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
                  onClick={() => alert("AI Generate will be wired later (4o-mini).")}
                >
                  ✨ AI Generate
                </button>

                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(138, 43, 226, 0.25)" }}
                  onClick={() => savePromptField("emotional_tone", prompts.mood, "Mood prompt")}
                  disabled={isSavingField === "emotional_tone"}
                  title="Save to server immediately"
                >
                  {isSavingField === "emotional_tone" ? "Saving…" : "💾 Save"}
                </button>
              </div>

              <button
                className="mt-3 text-sm"
                style={{ color: "#aaaaaa" }}
                onClick={() => setPrompts((p) => ({ ...p, mood: "" }))}
              >
                Reset
              </button>
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

              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(138, 43, 226, 0.25)", border: "1px solid rgba(138, 43, 226, 0.35)" }}
                  onClick={() => alert("AI Generate will be wired later (4o-mini).")}
                >
                  ✨ AI Generate
                </button>

                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(138, 43, 226, 0.25)" }}
                  onClick={() => savePromptField("knowledge_context", prompts.knowledge, "Knowledge prompt")}
                  disabled={isSavingField === "knowledge_context"}
                  title="Save to server immediately"
                >
                  {isSavingField === "knowledge_context" ? "Saving…" : "💾 Save"}
                </button>
              </div>

              <button
                className="mt-3 text-sm"
                style={{ color: "#aaaaaa" }}
                onClick={() => setPrompts((p) => ({ ...p, knowledge: "" }))}
              >
                Reset
              </button>
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

              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(138, 43, 226, 0.25)", border: "1px solid rgba(138, 43, 226, 0.35)" }}
                  onClick={() => alert("AI Generate will be wired later (4o-mini).")}
                >
                  ✨ AI Generate
                </button>

                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white font-semibold"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(138, 43, 226, 0.25)" }}
                  onClick={() => savePromptField("safety_boundaries", prompts.safety, "Safety prompt")}
                  disabled={isSavingField === "safety_boundaries"}
                  title="Save to server immediately"
                >
                  {isSavingField === "safety_boundaries" ? "Saving…" : "💾 Save"}
                </button>
              </div>

              <button
                className="mt-3 text-sm"
                style={{ color: "#aaaaaa" }}
                onClick={() => setPrompts((p) => ({ ...p, safety: "" }))}
              >
                Reset
              </button>
            </Card>
          </div>

          {/* Sliders */}
          <Card title="Style Sliders" icon="ri-sliders-4-line">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {Object.keys(PRESETS).map((name) => (
                  <button
                    key={name}
                    className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{
                      background: preset === name ? "rgba(138, 43, 226, 0.28)" : "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(138, 43, 226, 0.2)",
                      color: preset === name ? "#ffffff" : "#aaaaaa",
                    }}
                    onClick={() => applyPreset(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(90deg, #8a2be2, #ff6a00)",
                  opacity: isSavingSliders ? 0.6 : 1,
                }}
                onClick={saveSlidersToServer}
                disabled={isSavingSliders || !!isSavingField}
                title="Save sliders to server immediately"
              >
                {isSavingSliders ? "Saving…" : "💾 Save Sliders"}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Slider k="warmth" label="Warmth" value={sliders.warmth} onChange={setSlider} />
              <Slider k="formality" label="Formality" value={sliders.formality} onChange={setSlider} />
              <Slider k="humor" label="Humor" value={sliders.humor} onChange={setSlider} />
              <Slider k="directness" label="Directness" value={sliders.directness} onChange={setSlider} />
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

          <Card title="Preview (UI-only)" icon="ri-eye-line">
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
