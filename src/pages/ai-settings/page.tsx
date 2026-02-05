import { useState, useEffect } from "react";
import CoreLayout from "../../components/layout/CoreLayout";

// -----------------------------------------------------------------------------
// Backend API base (MUST be nginx/Flask, not Vercel)
// -----------------------------------------------------------------------------
const API_BASE =
  import.meta.env.VITE_API_URL || "https://app.neurospherevoiceai.com/api";

// Clean American-friendly voice names (values stay the same)
const VOICE_OPTIONS = [
  { value: "alloy", label: "Alexa" },
  { value: "echo", label: "Jordan" },
  { value: "shimmer", label: "Megan" },

  { value: "ash", label: "Michael" },
  { value: "ballad", label: "Emily" },
  { value: "coral", label: "Rachel" },
  { value: "sage", label: "Daniel" },
  { value: "verse", label: "Olivia" },

  { value: "cedar", label: "Kevin" },
  { value: "marin", label: "Samantha" }, // as requested
  { value: "sol", label: "Grace" },
];

export default function AgentSetup() {
  const [agentName, setAgentName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("alloy");

  const [twilioNumber, setTwilioNumber] = useState("");
  const [existingGreeting, setExistingGreeting] = useState("");
  const [newCallerGreeting, setNewCallerGreeting] = useState("");

  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [isSavingVoice, setIsSavingVoice] = useState(false);
  const [isSavingGreetings, setIsSavingGreetings] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    loadCustomerConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCustomerId = () =>
    localStorage.getItem("customerId") || sessionStorage.getItem("customerId");

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

      if (res.ok) {
        const config = await res.json();

        setAgentName(config.agent?.agent_name || "");
        setSelectedVoice(config.agent?.openai_voice || "alloy");

        // Greetings mapping (support multiple backend shapes)
        const existingGreetingValue =
          config.greetings?.existing_user_greeting ??
          config.greeting_template?.existing ??
          config.phone?.greeting_template?.existing ??
          "";

        const newCallerGreetingValue =
          config.greetings?.new_caller_greeting ??
          config.greeting_template?.new ??
          config.phone?.greeting_template?.new ??
          "";

        setTwilioNumber(config.phone?.twilio_phone_number || "");
        setExistingGreeting(existingGreetingValue);
        setNewCallerGreeting(newCallerGreetingValue);
      } else {
        const errorText = await res.text().catch(() => "");
        console.error("Failed to load config:", res.status, errorText);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const flash = (msg: string) => {
    setSaveMessage(msg);
    window.setTimeout(() => setSaveMessage(""), 3000);
  };

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
        const errorText = await res.text();
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
        const errorText = await res.text();
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

  const saveGreetings = async () => {
    try {
      setIsSavingGreetings(true);
      setSaveMessage("");

      const customerId = getCustomerId();
      if (!customerId) {
        setSaveMessage("Error: No customer ID found. Please log in again.");
        return;
      }

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
        flash("✅ Greetings saved!");
        await loadCustomerConfig();
      } else {
        const errorText = await res.text().catch(() => "");
        console.error("Save failed:", res.status, errorText);
        setSaveMessage(`Failed to save greetings (Status: ${res.status})`);
      }
    } catch (error) {
      console.error("Failed to save greetings:", error);
      setSaveMessage(
        `Error saving greetings: ${
          error instanceof Error ? error.message : "Network error"
        }`
      );
    } finally {
      setIsSavingGreetings(false);
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
            className="max-w-4xl mb-4 p-4 rounded-lg text-center"
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
          <div className="max-w-4xl space-y-6">
            {/* Agent Name */}
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
                  <i className="ri-robot-line text-white text-xl" />
                </div>

                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Agent Name
                </h2>
              </div>

              <div className="space-y-4">
                <input
                  className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g. Samantha"
                />

                <button
                  className="w-full px-4 py-3 rounded-lg text-white font-semibold"
                  style={{ background: "linear-gradient(90deg, #8a2be2, #ff6a00)", opacity: isSavingAgent ? 0.6 : 1 }}
                  onClick={saveAgentName}
                  disabled={isSavingAgent}
                >
                  {isSavingAgent ? "Saving…" : "💾 Save Agent Name"}
                </button>
              </div>
            </div>

            {/* Voice */}
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
                  <i className="ri-mic-line text-white text-xl" />
                </div>

                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Voice
                </h2>
              </div>

              <div className="space-y-4">
                <select
                  className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                >
                  {VOICE_OPTIONS.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label} ({v.value})
                    </option>
                  ))}
                </select>

                <button
                  className="w-full px-4 py-3 rounded-lg text-white font-semibold"
                  style={{ background: "linear-gradient(90deg, #8a2be2, #ff6a00)", opacity: isSavingVoice ? 0.6 : 1 }}
                  onClick={saveVoiceSelection}
                  disabled={isSavingVoice}
                >
                  {isSavingVoice ? "Saving…" : "💾 Save Voice"}
                </button>
              </div>
            </div>

            {/* Assigned Phone Number */}
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
                  <i className="ri-phone-line text-white text-xl" />
                </div>

                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Assigned Phone Number
                </h2>
              </div>

              <input
                className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                value={twilioNumber || "Not assigned"}
                disabled
              />

              <div className="text-xs text-gray-400 mt-2">
                (Read-only for now — assignment happens in Twilio / backend.)
              </div>
            </div>

            {/* Greetings */}
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
                  <i className="ri-chat-3-line text-white text-xl" />
                </div>

                <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Initial Greetings
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Returning Caller Greeting</label>
                  <textarea
                    className="w-full min-h-[110px] px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                    value={existingGreeting}
                    onChange={(e) => setExistingGreeting(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm text-purple-300 mb-2">New Caller Greeting</label>
                  <textarea
                    className="w-full min-h-[110px] px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white"
                    value={newCallerGreeting}
                    onChange={(e) => setNewCallerGreeting(e.target.value)}
                  />
                </div>

                <button
                  className="w-full px-4 py-3 rounded-lg text-white font-semibold"
                  style={{ background: "linear-gradient(90deg, #8a2be2, #ff6a00)", opacity: isSavingGreetings ? 0.6 : 1 }}
                  onClick={saveGreetings}
                  disabled={isSavingGreetings}
                >
                  {isSavingGreetings ? "Saving…" : "💾 Save Greetings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CoreLayout>
  );
}
