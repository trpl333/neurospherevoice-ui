import { useEffect, useState } from "react";
import CoreLayout from "../../components/layout/CoreLayout";

// -----------------------------------------------------------------------------
// Backend API base (MUST be nginx/Flask, not Vercel)
// -----------------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL || "https://app.neurospherevoiceai.com/api";

// Clean American-friendly voice names (values stay the same)
const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "shimmer", label: "Shimmer" },
  { value: "ash", label: "Michael (ash)" },
  { value: "ballad", label: "Ballad" },
  { value: "coral", label: "Coral" },
  { value: "sage", label: "Sage" },
  { value: "verse", label: "Verse" },
  { value: "cedar", label: "Cedar" },
  { value: "marin", label: "Marin" },
  { value: "sol", label: "Sol" },
] as const;

type VoiceValue = (typeof VOICE_OPTIONS)[number]["value"];

function CardShell({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-orange-600">
          <i className={`${icon} text-white text-xl`} />
        </div>

        <h2
          className="text-xl font-semibold text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

export default function AgentSetupPage() {
  const [agentName, setAgentName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<VoiceValue>("alloy");
  const [twilioNumber, setTwilioNumber] = useState("");

  const [existingGreeting, setExistingGreeting] = useState("");
  const [newCallerGreeting, setNewCallerGreeting] = useState("");

  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [isSavingVoice, setIsSavingVoice] = useState(false);
  const [isSavingNewGreeting, setIsSavingNewGreeting] = useState(false);
  const [isSavingExistingGreeting, setIsSavingExistingGreeting] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  const getCustomerId = () =>
    localStorage.getItem("customerId") || sessionStorage.getItem("customerId");

  const flash = (msg: string) => {
    setSaveMessage(msg);
    window.setTimeout(() => setSaveMessage(""), 3000);
  };

  const loadCustomerConfig = async () => {
    try {
      const customerId = getCustomerId();
      if (!customerId) {
        console.warn("No customer ID found");
        setIsLoadingConfig(false);
        return;
      }

      const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error("Failed to load config:", res.status, errorText);
        setIsLoadingConfig(false);
        return;
      }

      const config = await res.json();

      setAgentName(config.agent?.agent_name || "");
      setSelectedVoice((config.agent?.openai_voice || "alloy") as VoiceValue);

      // Greetings mapping (support multiple backend shapes)
      const existingGreetingValue =
        config.agent?.existing_user_greeting ??
        config.greetings?.existing_user_greeting ??
        config.greeting_template?.existing ??
        config.phone?.greeting_template?.existing ??
        "";

      const newCallerGreetingValue =
        config.agent?.new_caller_greeting ??
        config.greetings?.new_caller_greeting ??
        config.greeting_template?.new ??
        config.phone?.greeting_template?.new ??
        "";

      setTwilioNumber(config.phone?.twilio_phone_number || "");
      setExistingGreeting(existingGreetingValue);
      setNewCallerGreeting(newCallerGreetingValue);
    } catch (error) {
      console.error("Failed to load customer config:", error);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    loadCustomerConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAgentName = async () => {
    try {
      setIsSavingAgent(true);
      setSaveMessage("");

      const customerId = getCustomerId();
      if (!customerId) {
        setSaveMessage("Error: No customer ID found. Please log in again.");
        return;
      }

      const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: { agent_name: agentName },
        }),
      });

      if (res.ok) {
        flash("✅ Agent name saved!");
        await loadCustomerConfig();
      } else {
        const errorText = await res.text().catch(() => "");
        console.error("Save failed:", res.status, errorText);
        setSaveMessage(`Failed to save agent name (Status: ${res.status})`);
      }
    } catch (error) {
      console.error("Failed to save agent name:", error);
      setSaveMessage(
        `Error saving agent name: ${
          error instanceof Error ? error.message : "Network error"
        }`
      );
    } finally {
      setIsSavingAgent(false);
    }
  };

  const saveVoiceSelection = async () => {
    try {
      setIsSavingVoice(true);
      setSaveMessage("");

      const customerId = getCustomerId();
      if (!customerId) {
        setSaveMessage("Error: No customer ID found. Please log in again.");
        return;
      }

      const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: { openai_voice: selectedVoice },
        }),
      });

      if (res.ok) {
        flash("✅ Voice saved!");
        await loadCustomerConfig();
      } else {
        const errorText = await res.text().catch(() => "");
        console.error("Save failed:", res.status, errorText);
        setSaveMessage(`Failed to save voice (Status: ${res.status})`);
      }
    } catch (error) {
      console.error("Failed to save voice:", error);
      setSaveMessage(
        `Error saving voice: ${
          error instanceof Error ? error.message : "Network error"
        }`
      );
    } finally {
      setIsSavingVoice(false);
    }
  };

  const saveGreetings = async (which: "new" | "existing") => {
    try {
      if (which === "new") setIsSavingNewGreeting(true);
      else setIsSavingExistingGreeting(true);

      setSaveMessage("");

      const customerId = getCustomerId();
      if (!customerId) {
        setSaveMessage("Error: No customer ID found. Please log in again.");
        return;
      }

      // Save both fields to keep server state consistent, but the UX is “Save this box”.
      const payload = {
        agent: {
          existing_user_greeting: existingGreeting ?? "",
          new_caller_greeting: newCallerGreeting ?? "",
        },
      };

      const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        flash(which === "new" ? "✅ New greeting saved!" : "✅ Returning greeting saved!");
        await loadCustomerConfig();
      } else {
        const errorText = await res.text().catch(() => "");
        console.error("Save failed:", res.status, errorText);
        setSaveMessage(`Failed to save greeting (Status: ${res.status})`);
      }
    } catch (error) {
      console.error("Failed to save greetings:", error);
      setSaveMessage(
        `Error saving greeting: ${
          error instanceof Error ? error.message : "Network error"
        }`
      );
    } finally {
      if (which === "new") setIsSavingNewGreeting(false);
      else setIsSavingExistingGreeting(false);
    }
  };

  return (
    <CoreLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: "linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AGENT SETUP
          </h1>

          <p className="text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Name, voice, phone number, and initial greetings.
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div
            className="max-w-7xl mb-4 p-4 rounded-lg text-center"
            style={{
              background:
                saveMessage.includes("Error") || saveMessage.includes("Failed")
                  ? "rgba(239, 68, 68, 0.2)"
                  : "rgba(34, 197, 94, 0.2)",
              border: `1px solid ${
                saveMessage.includes("Error") || saveMessage.includes("Failed")
                  ? "rgba(239, 68, 68, 0.5)"
                  : "rgba(34, 197, 94, 0.5)"
              }`,
              color:
                saveMessage.includes("Error") || saveMessage.includes("Failed")
                  ? "#fca5a5"
                  : "#86efac",
            }}
          >
            {saveMessage}
          </div>
        )}

        {isLoadingConfig ? (
          <div className="text-center py-12 text-purple-300">Loading configuration...</div>
        ) : (
          <div className="max-w-7xl space-y-6">
            {/* TOP ROW: Agent Name / Voice / Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Name */}
              <CardShell icon="ri-robot-line" title="Agent Name">
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Enter agent name"
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
                />

                <button
                  onClick={saveAgentName}
                  disabled={isSavingAgent}
                  className="mt-4 w-full py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: isSavingAgent
                      ? "rgba(138, 43, 226, 0.4)"
                      : "linear-gradient(90deg, #8a2be2, #ff6a00)",
                    color: "white",
                    cursor: isSavingAgent ? "not-allowed" : "pointer",
                  }}
                >
                  {isSavingAgent ? "Saving..." : "💾 Save Agent Name"}
                </button>
              </CardShell>

              {/* Voice */}
              <CardShell icon="ri-mic-line" title="Voice">
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value as VoiceValue)}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={saveVoiceSelection}
                  disabled={isSavingVoice}
                  className="mt-4 w-full py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: isSavingVoice
                      ? "rgba(138, 43, 226, 0.4)"
                      : "linear-gradient(90deg, #8a2be2, #ff6a00)",
                    color: "white",
                    cursor: isSavingVoice ? "not-allowed" : "pointer",
                  }}
                >
                  {isSavingVoice ? "Saving..." : "💾 Save Voice"}
                </button>
              </CardShell>

              {/* Assigned Phone Number */}
              <CardShell icon="ri-phone-line" title="Assigned Phone Number">
                <input
                  type="text"
                  value={twilioNumber || "—"}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-purple-500/20 text-white/80"
                />

                <div className="mt-3 text-xs text-gray-400">
                  (Read-only for now — assignment happens in Twilio / backend.)
                </div>
              </CardShell>
            </div>

            {/* SECOND ROW: Greetings (two cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CardShell icon="ri-chat-smile-2-line" title="New Caller Greeting">
                <textarea
                  value={newCallerGreeting}
                  onChange={(e) => setNewCallerGreeting(e.target.value)}
                  placeholder="Greeting for brand new callers…"
                  className="w-full min-h-[180px] px-4 py-3 rounded-lg bg-black/40 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
                />

                <button
                  onClick={() => saveGreetings("new")}
                  disabled={isSavingNewGreeting}
                  className="mt-4 w-full py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: isSavingNewGreeting
                      ? "rgba(138, 43, 226, 0.4)"
                      : "linear-gradient(90deg, #8a2be2, #ff6a00)",
                    color: "white",
                    cursor: isSavingNewGreeting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSavingNewGreeting ? "Saving..." : "💾 Save New Greeting"}
                </button>
              </CardShell>

              <CardShell icon="ri-chat-voice-line" title="Returning Caller Greeting">
                <textarea
                  value={existingGreeting}
                  onChange={(e) => setExistingGreeting(e.target.value)}
                  placeholder="Greeting for returning callers…"
                  className="w-full min-h-[180px] px-4 py-3 rounded-lg bg-black/40 border border-purple-500/30 text-white focus:outline-none focus:border-purple-500"
                />

                <button
                  onClick={() => saveGreetings("existing")}
                  disabled={isSavingExistingGreeting}
                  className="mt-4 w-full py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: isSavingExistingGreeting
                      ? "rgba(138, 43, 226, 0.4)"
                      : "linear-gradient(90deg, #8a2be2, #ff6a00)",
                    color: "white",
                    cursor: isSavingExistingGreeting ? "not-allowed" : "pointer",
                  }}
                >
                  {isSavingExistingGreeting ? "Saving..." : "💾 Save Returning Greeting"}
                </button>
              </CardShell>
            </div>
          </div>
        )}
      </div>
    </CoreLayout>
  );
}
