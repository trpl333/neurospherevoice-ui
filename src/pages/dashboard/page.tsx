import { useEffect, useMemo, useState } from "react";
import CoreLayout from "../../components/layout/CoreLayout";

// -----------------------------------------------------------------------------
// Backend API base (MUST be nginx/Flask, not Vercel)
// -----------------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL || "https://app.neurospherevoiceai.com/api";

type PromptBlocksLoadResponse = {
  success?: boolean;
  blocks?: Record<string, any>;
  error?: string;
};

function Card({
  title,
  icon,
  lines,
  buttonLabel,
  onClick,
  disabled,
}: {
  title: string;
  icon: string;
  lines: string[];
  buttonLabel: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(138, 43, 226, 0.15)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <i className={`${icon} text-purple-300`} style={{ fontSize: 18 }} />
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h2>
        </div>

        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{
            background: disabled ? "rgba(255,255,255,0.06)" : "linear-gradient(90deg, #8a2be2, #ff6a00)",
            opacity: disabled ? 0.6 : 1,
          }}
          onClick={onClick}
          disabled={disabled}
          title={disabled ? "Coming soon" : ""}
        >
          {buttonLabel}
        </button>
      </div>

      <div className="space-y-2">
        {lines.map((l, idx) => (
          <div key={idx} className="text-sm" style={{ color: "rgba(255,255,255,0.78)" }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

const firstLine = (s: any, fallback = "Not set") => {
  if (typeof s !== "string") return fallback;
  const t = s.trim();
  if (!t) return fallback;
  return t.split(/\r?\n/)[0].slice(0, 110);
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string>("");

  const [config, setConfig] = useState<any>(null);
  const [promptBlocks, setPromptBlocks] = useState<Record<string, any> | null>(null);

  const getCustomerId = () =>
    localStorage.getItem("customerId") || sessionStorage.getItem("customerId");

  const loadAll = async () => {
    setIsLoading(true);
    setStatusMsg("");

    try {
      const customerId = getCustomerId();
      if (!customerId) {
        setStatusMsg("❌ No customer ID found. Please log in again.");
        setIsLoading(false);
        return;
      }

      // 1) Customer config (agent/phone/greetings/sliders/transfer)
      const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        setStatusMsg("❌ Unauthorized. Please log in again.");
        setIsLoading(false);
        return;
      }

      if (res.ok) {
        const cfg = await res.json();
        setConfig(cfg);
      } else {
        const txt = await res.text().catch(() => "");
        setStatusMsg(`❌ Failed to load config: HTTP ${res.status} ${txt}`);
      }

      // 2) Prompt blocks (personality studio)
      const pr = await fetch(`${API_BASE}/prompt-blocks/load`, {
        method: "GET",
        credentials: "include",
      });

      if (pr.ok) {
        const data = (await pr.json()) as PromptBlocksLoadResponse;
        if (data?.success) {
          setPromptBlocks(data.blocks || {});
        }
      }
    } catch (e: any) {
      setStatusMsg(`❌ Load error: ${e?.message || String(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Router bootstrap in this app injects a navigate helper.
  const nav = (path: string) => {
    if (typeof (window as any).REACT_APP_NAVIGATE === "function") {
      (window as any).REACT_APP_NAVIGATE(path);
      return;
    }
    // fallback: hard nav
    window.location.href = path;
  };

  const greetingExisting =
    config?.greetings?.existing_user_greeting ??
    config?.greeting_template?.existing ??
    config?.phone?.greeting_template?.existing ??
    "";

  const greetingNew =
    config?.greetings?.new_caller_greeting ??
    config?.greeting_template?.new ??
    config?.phone?.greeting_template?.new ??
    "";

  const transferRules = Array.isArray(config?.phone?.transfer_rules)
    ? config.phone.transfer_rules
    : [];

  const slidersObj = config?.sliders && typeof config.sliders === "object" ? config.sliders : null;
  const sliderCount = slidersObj ? Object.keys(slidersObj).length : 0;

  const agentCardLines = useMemo(() => {
    const name = config?.agent?.agent_name || "AI Assistant";
    const voice = config?.agent?.openai_voice || "alloy";
    const num = config?.phone?.twilio_phone_number || "Not assigned";
    return [
      `Name: ${name}`,
      `Voice: ${voice}`,
      `Assigned # : ${num}`,
      `Returning greeting: ${firstLine(greetingExisting)}`,
      `New caller greeting: ${firstLine(greetingNew)}`,
    ];
  }, [config]);

  const personalityCardLines = useMemo(() => {
    const b = promptBlocks || {};
    return [
      `System role: ${firstLine(b.system_role)}`,
      `Emotional tone: ${firstLine(b.emotional_tone)}`,
      `Knowledge: ${firstLine(b.knowledge_context)}`,
      `Safety: ${firstLine(b.safety_boundaries)}`,
      `Style sliders saved: ${sliderCount ? "Yes" : "No"} (${sliderCount})`,
    ];
  }, [promptBlocks, sliderCount]);

  const transferCardLines = useMemo(() => {
    return [
      `Transfer rules: ${transferRules.length}`,
      transferRules.length ? "Edit rules and conditions in Phone System." : "No transfer rules set.",
    ];
  }, [transferRules.length]);

  const systemCardLines = useMemo(() => {
    const aiMem = config?.system?.ai_memory_online;
    const openaiOk = config?.system?.openai_configured;
    return [
      `AI-Memory: ${aiMem === false ? "Offline" : "Online"}`,
      `LLM configured: ${openaiOk === false ? "No" : "Yes"}`,
    ];
  }, [config]);

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
              DASHBOARD
            </h1>
            <p className="text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Settings overview. Click into a section to edit.
            </p>
          </div>

          <button
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(138, 43, 226, 0.2)",
              color: "#aaaaaa",
              opacity: isLoading ? 0.6 : 1,
            }}
            onClick={loadAll}
            disabled={isLoading}
          >
            {isLoading ? "Loading…" : "Reload"}
          </button>
        </div>

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

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Agent Setup"
            icon="ri-robot-line"
            lines={agentCardLines}
            buttonLabel="Edit Settings"
            onClick={() => nav("/ai-settings")}
            disabled={false}
          />

          <Card
            title="Personality Studio"
            icon="ri-brain-2-line"
            lines={personalityCardLines}
            buttonLabel="Edit Settings"
            onClick={() => nav("/personality-studio")}
            disabled={false}
          />

          <Card
            title="Transfer Settings"
            icon="ri-phone-line"
            lines={transferCardLines}
            buttonLabel="Edit Settings"
            onClick={() => nav("/phone-system")}
            disabled={false}
          />

          <Card
            title="Memory Management"
            icon="ri-database-2-line"
            lines={systemCardLines}
            buttonLabel="View"
            onClick={() => nav("/user-memories")}
            disabled={false}
          />

          <Card
            title="Knowledge Base"
            icon="ri-book-2-line"
            lines={[
              "Upload docs and enable retrieval (coming soon).",
              "This will live as its own page.",
            ]}
            buttonLabel="Coming soon"
            onClick={() => {}}
            disabled={true}
          />
        </div>
      </div>
    </CoreLayout>
  );
}
