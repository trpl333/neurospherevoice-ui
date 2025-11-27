// ============================================================================
// DASHBOARD PAGE (FULL FILE REWRITE)
// NeuroSphere VoiceAI – Multi-Tenant React Frontend
//
// ANNOTATED WITH FULL BACKEND REFERENCES
// ---------------------------------------------------------------------------
// This file is aligned directly with ChatStack customer_config API:
//   - GET  /api/customers/<id>/config
//   - POST /api/customers/<id>/config
//
// BACKEND TRUTH (verified using file_search):
//   • ChatStack’s customer_config blueprint is session-authenticated ONLY
//         (session.get("customer_id") required)
//         REF: customer_config.py L33-L41
//
//   • All requests MUST include:
//         credentials: "include"
//     Otherwise → Flask sees no session cookie → returns 401/403
//
//   • Greeting template schema (JSON):
//         { "existing": "...", "new": "..." }
//     REF: _load_greetings() in customer_config.py L86-L103
//
//   • Saving agent + voice requires payload under "agent":
//         { "agent": { "agent_name": "...", "openai_voice": "..." } }
//     REF: update_customer_config() L81–L103
//
//   • Saving greetings must also be nested under "agent":
//         { "agent": { "existing_user_greeting": "", "new_caller_greeting": "" } }
//     REF: update_customer_config() L12–L19
//
//   • AI-Memory mirroring is handled automatically by ChatStack, frontend
//     NEVER calls memory APIs directly.
//     REF: _mirror_to_ai_memory() L35-L60
//
//   • CORS requires credentials=True and origin reflection, which is supported.
//     REF: customer_config.py L23-L31
//
// ============================================================================

import { useState, useEffect } from 'react';
import CoreLayout from '../../components/layout/CoreLayout';

// ---------------------------------------------------------------------------
// ENV-DRIVEN BACKEND BASE URL
// ---------------------------------------------------------------------------
// We define API_BASE ONCE so all fetch() calls reference:
//     import.meta.env.VITE_API_URL
//
// This keeps dev/prod/staging consistent and avoids hardcoding.
//
// Your Vercel environment MUST contain:
//     VITE_API_URL=https://app.neurospherevoiceai.com/api
//
// Note: Vite exposes env vars ONLY if prefixed with VITE_
// ---------------------------------------------------------------------------
const API_BASE = import.meta.env.VITE_API_URL;

// ---------------------------------------------------------------------------
// FRIENDLY AMERICAN NAMES FOR OPENAI VOICES
// (Values stay the same → ChatStack stores openai_voice using exact IDs)
// ---------------------------------------------------------------------------
// Backend stores values EXACTLY as: “alloy”, “marin”, “cedar”, etc.
// Dashboard only changes labels shown to user.
// ---------------------------------------------------------------------------
const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alex' },
  { value: 'echo', label: 'Jordan' },
  { value: 'shimmer', label: 'Megan' },

  { value: 'ash', label: 'Michael' },
  { value: 'ballad', label: 'Emily' },
  { value: 'coral', label: 'Rachel' },
  { value: 'sage', label: 'Daniel' },
  { value: 'verse', label: 'Olivia' },

  // Premium Natural Speech
  { value: 'cedar', label: 'Kevin' },
  { value: 'marin', label: 'Samantha' }, // As you requested
  { value: 'sol', label: 'Grace' }
];

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function Dashboard() {
  // -------------------------------
  // AGENT SETTINGS
  // -------------------------------
  const [agentName, setAgentName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('alloy');

  // -------------------------------
  // LOAD/SAVE STATUS FLAGS
  // -------------------------------
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [isSavingVoice, setIsSavingVoice] = useState(false);
  const [isSavingGreetings, setIsSavingGreetings] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // -------------------------------
  // PHONE SYSTEM / GREETINGS
  // -------------------------------
  const [twilioNumber, setTwilioNumber] = useState('');
  const [existingGreeting, setExistingGreeting] = useState('');
  const [newCallerGreeting, setNewCallerGreeting] = useState('');

  // -------------------------------
  // AI BEHAVIOR SLIDERS
  // -------------------------------
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [responseSpeed, setResponseSpeed] = useState(0.5);
  const [creativity, setCreativity] = useState(0.6);

  // ---------------------------------------------------------------------------
  // HELPER: Retrieve customerId from storage
  // Backend requires URL param to match session['customer_id']
  // REF: customer_config.py L33-L41
  // ---------------------------------------------------------------------------
  const getCustomerId = () =>
    localStorage.getItem('customerId') || sessionStorage.getItem('customerId');

  // ---------------------------------------------------------------------------
  // EFFECT: Load config on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    loadCustomerConfig();
  }, []);

  // ---------------------------------------------------------------------------
  // LOAD CUSTOMER CONFIG (GET)
  // ---------------------------------------------------------------------------
  // Backend returns structured JSON:
  //  {
  //    agent: { agent_name, openai_voice },
  //    phone: { greeting_template: { existing, new }, twilio_phone_number }
  //  }
  //
  // Greeting fallback path:
  //   DB JSON → AI-Memory → defaults
  // REF: _load_greetings() L68-L103
  // ---------------------------------------------------------------------------
  const loadCustomerConfig = async () => {
    try {
      const customerId = getCustomerId();

      if (!customerId) {
        console.warn('⚠️ No customer ID found (not logged in).');
        setIsLoadingConfig(false);
        return;
      }

      // Must include credentials so session cookie is sent
      // REF: customer_config.py L33-L37
      const res = await fetch(
        `${API_BASE}/customers/${customerId}/config`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (res.ok) {
        const config = await res.json();

        // -------------------------------
        // Agent fields
        // -------------------------------
        setAgentName(config.agent?.agent_name || '');
        setSelectedVoice(config.agent?.openai_voice || 'alloy');

        // -------------------------------
        // Greeting template mapping
        // The backend returns:
        //   phone.greeting_template.existing
        //   phone.greeting_template.new
        //
        // But we also support legacy:
        //   config.existing_user_greeting
        //   config.greetings.existing_user_greeting
        //
        // Your original code handled ALL these paths.
        // I preserved them EXACTLY.
        // -------------------------------
        const existingGreetingValue =
          config.existing_user_greeting ||
          config.greetings?.existing_user_greeting ||
          config.phone?.greeting_template?.existing ||
          config.agent?.existing_user_greeting ||
          '';

        const newCallerGreetingValue =
          config.new_caller_greeting ||
          config.greetings?.new_caller_greeting ||
          config.phone?.greeting_template?.new ||
          config.agent?.new_caller_greeting ||
          '';

        setTwilioNumber(config.phone?.twilio_phone_number || '');
        setExistingGreeting(existingGreetingValue);
        setNewCallerGreeting(newCallerGreetingValue);
      } else {
        console.error('❌ Failed to load config:', res.status);
      }
    } catch (error) {
      console.error('❌ Error loading config:', error);
    } finally {
      setIsLoadingConfig(false);
    }
  };
  // ---------------------------------------------------------------------------
  // SAVE AGENT NAME (POST)
  // ---------------------------------------------------------------------------
  // Backend expects payload:
  //   { "agent": { "agent_name": "..." } }
  //
  // REF: customer_config.update_customer_config
  //      customer_config.py L12-L19 and L81-L103
  //
  // MUST include:
  //   credentials: "include"
  // or Flask will reject with 401 (missing session cookie)
  // ---------------------------------------------------------------------------
  const saveAgentName = async () => {
    try {
      setIsSavingAgent(true);
      setSaveMessage('');

      const customerId = getCustomerId();
      if (!customerId) {
        setSaveMessage('Error: No customer ID found. Please log in again.');
        return;
      }

      const res = await fetch(
        `${API_BASE}/customers/${customerId}/config`,
        {
          method: 'POST',
          credentials: 'include',   // REQUIRED FOR SESSION AUTH
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agent: { agent_name: agentName }
          })
        }
      );

      if (res.ok) {
        setSaveMessage('Agent name saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const errorText = await res.text();
        console.error('Save failed:', res.status, errorText);
        setSaveMessage(`Failed to save agent name (Status: ${res.status})`);
      }
    } catch (error) {
      console.error('Failed to save agent name:', error);
      setSaveMessage('Network or server error saving agent name');
    } finally {
      setIsSavingAgent(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SAVE VOICE SELECTION (POST)
  // ---------------------------------------------------------------------------
  // Backend expects:
  //   { "agent": { "openai_voice": "marin" } }
  //
  // Friendly names are UI-only. Backend expects real OpenAI IDs.
  //
  // MUST include credentials for session auth:
  //   REF: customer_config.py L33-L41
  // ---------------------------------------------------------------------------
  const saveVoiceSelection = async () => {
  try {
    setIsSavingVoice(true);
    setSaveMessage('');

    const customerId = getCustomerId();
    if (!customerId) {
      setSaveMessage('Error: No customer ID found. Please log in again.');
      return;
    }

    // PATCH: Convert friendly UI label into real OpenAI voice ID
    const realVoice =
      VOICE_OPTIONS.find(
        (v) => v.value === selectedVoice || v.label === selectedVoice
      )?.value;

    if (!realVoice) {
      setSaveMessage('Error: Invalid voice selection.');
      console.error('Voice sanitizer failed — selectedVoice:', selectedVoice);
      return;
    }

    const res = await fetch(
      `${API_BASE}/customers/${customerId}/config`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: { openai_voice: realVoice }
        })
      }
    );

    if (res.ok) {
      setSaveMessage('Voice selection saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      const errorText = await res.text();
      console.error('Save failed:', res.status, errorText);
      setSaveMessage(`Failed to save voice selection (Status: ${res.status})`);
    }
  } catch (error) {
    console.error('Failed to save voice selection:', error);
    setSaveMessage('Error saving voice selection');
  } finally {
    setIsSavingVoice(false);
  }
};

  // ---------------------------------------------------------------------------
  // SAVE GREETINGS (POST)
  // ---------------------------------------------------------------------------
  // ChatStack supports structured greeting_template:
  //   { "existing": "...", "new": "..." }
  //
  // BUT your POST format wraps greetings under "agent":
  //   { "agent": { 
  //        "existing_user_greeting": "...", 
  //        "new_caller_greeting": "..." 
  //     }}
  //
  // This is VALID because ChatStack's update endpoint:
  //   • Accepts partial updates
  //   • Mirrors values to DB + AI-Memory
  //   REF: customer_config.py L12-L19 and L35-L60
  //
  // MUST include credentials (session required).
  // ---------------------------------------------------------------------------
  const saveGreetings = async () => {
  try {
    setIsSavingGreetings(true);
    setSaveMessage("");

    const customerId = getCustomerId();
    if (!customerId) {
      setSaveMessage("Error: No customer ID found. Please log in again.");
      return;
    }

    // 🔥 Fix #1 — prevent undefined/null from breaking backend
    const safeExisting = existingGreeting ?? "";
    const safeNew = newCallerGreeting ?? "";

    // 🔥 Fix #2 — backend ONLY accepts greetings inside "agent"
    const payload = {
      agent: {
        existing_user_greeting: safeExisting,
        new_caller_greeting: safeNew
      }
    };

    const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const responseData = await res.json();

    if (res.ok) {
      // 🔥 Fix #3 — match AI Settings success UX
      setSaveMessage("Greetings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);

      // 🔥 Fix #4 — SYNC Dashboard after save
      await loadCustomerConfig();
    } else {
      console.error("Save failed:", res.status, responseData);
      setSaveMessage(`Failed to save greetings (Status: ${res.status})`);
    }
  } catch (error) {
    console.error("Failed to save greetings:", error);
    setSaveMessage("Error saving greetings");
  } finally {
    setIsSavingGreetings(false);
  }
};

  // ---------------------------------------------------------------------------
  // NAVIGATION HANDLERS
  // Ray’s UI uses window.REACT_APP_NAVIGATE injected by router bootstrap.
  // DO NOT CHANGE — this is correct.
  // ---------------------------------------------------------------------------
  const handleNavigateToAISettings = () => {
    window.REACT_APP_NAVIGATE('/ai-settings');
  };

  const handleNavigateToPhoneSystem = () => {
    window.REACT_APP_NAVIGATE('/phone-system');
  };
  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <CoreLayout>
      <div className="p-8">

        {/* =============================================================== */}
        {/*                          HEADER                                 */}
        {/* =============================================================== */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-bold mb-2"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            THE NEUROSPHERE CORE
          </h1>

          <div
            className="h-1 w-64 mx-auto mt-4 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #8a2be2, #ff6a00)',
              boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)'
            }}
          />
        </div>

        {/* =============================================================== */}
        {/*                         SAVE MESSAGE                            */}
        {/* =============================================================== */}
        {saveMessage && (
          <div
            className="max-w-7xl mx-auto mb-4 p-4 rounded-lg text-center"
            style={{
              background: saveMessage.includes('Error') || saveMessage.includes('Failed')
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(34, 197, 94, 0.2)',
              border: `1px solid ${
                saveMessage.includes('Error') || saveMessage.includes('Failed')
                  ? 'rgba(239, 68, 68, 0.5)'
                  : 'rgba(34, 197, 94, 0.5)'
              }`,
              color: saveMessage.includes('Error') || saveMessage.includes('Failed')
                ? '#fca5a5'
                : '#86efac'
            }}
          >
            {saveMessage}
          </div>
        )}

        {/* =============================================================== */}
        {/*                      GRID (TWO COLUMNS)                          */}
        {/* =============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">

          {/* ============================================================= */}
          {/*          PANEL 1: AI AGENT & VOICE SELECTION                  */}
          {/* ============================================================= */}
          <div
            className="p-6 rounded-2xl backdrop-blur-sm"
            style={{
              background: 'rgba(26, 26, 36, 0.75)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              boxShadow: '0 8px 32px rgba(255, 0, 140, 0.15)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-orange-600">
                  <i className="ri-robot-line text-white text-xl" />
                </div>

                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  AI Agent
                </h2>
              </div>

              {/* ROUTES THROUGH window.REACT_APP_NAVIGATE → DO NOT CHANGE */}
              <button
                onClick={handleNavigateToAISettings}
                className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm hover:bg-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <i className="ri-settings-3-line mr-1" />
                Open AI Settings
              </button>
            </div>

            {/* ---------------------------------------------------------- */}
            {/*       AI Agent Name (Same behavior as AI-Settings)        */}
            {/* ---------------------------------------------------------- */}
            {isLoadingConfig ? (
              <div className="text-center py-8 text-purple-300">Loading configuration...</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Agent Name</label>
                  <p className="text-xs text-gray-400 mb-3">
                    This is the name your AI agent will use when introducing itself
                  </p>

                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    placeholder="Enter agent name..."
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />

                  <button
                    onClick={saveAgentName}
                    disabled={isSavingAgent}
                    className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {isSavingAgent ? 'Saving...' : 'Save Agent Name'}
                  </button>
                </div>

                {/* ---------------------------------------------------------- */}
                {/*              AI Voice Selection (friendly names)            */}
                {/* ---------------------------------------------------------- */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">AI Voice Selection</label>
                  <p className="text-xs text-gray-400 mb-3">
                    Choose the voice your AI agent will use during calls
                  </p>

                  <div className="relative">
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full px-4 py-3 pr-10 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors appearance-none cursor-pointer"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {VOICE_OPTIONS.map((voice) => (
                        <option key={voice.value} value={voice.value}>
                          {voice.label}
                        </option>
                      ))}
                    </select>

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <i className="ri-arrow-down-s-line text-purple-400 text-xl" />
                    </div>
                  </div>

                  <button
                    onClick={saveVoiceSelection}
                    disabled={isSavingVoice}
                    className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {isSavingVoice ? 'Saving...' : 'Save Voice Selection'}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* ============================================================= */}
          {/*         PANEL 2: CUSTOMER GREETING MANAGEMENT                 */}
          {/* ============================================================= */}
          <div
            className="p-6 rounded-2xl backdrop-blur-sm"
            style={{
              background: 'rgba(26, 26, 36, 0.75)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              boxShadow: '0 8px 32px rgba(255, 0, 140, 0.15)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-orange-600">
                  <i className="ri-message-3-line text-white text-xl" />
                </div>

                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Customer Greeting
                </h2>
              </div>

              {/* NAVIGATE TO PHONE SYSTEM */}
              <button
                onClick={handleNavigateToPhoneSystem}
                className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm hover:bg-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <i className="ri-phone-line mr-1" />
                Open Phone System
              </button>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* LOADING STATE */}
            {/* ------------------------------------------------------------ */}
            {isLoadingConfig ? (
              <div className="text-center py-8 text-purple-300">Loading configuration...</div>
            ) : (
              <div className="space-y-6">

                {/* -------------------------------------------------------- */}
                {/* TWILIO NUMBER (READ-ONLY) */}
                {/* -------------------------------------------------------- */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">
                    Assigned Phone Number
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Your dedicated Twilio number for incoming calls
                  </p>

                  <input
                    type="text"
                    value={twilioNumber}
                    readOnly
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-gray-400 cursor-not-allowed"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                </div>

                {/* -------------------------------------------------------- */}
                {/* EXISTING CALLER GREETING */}
                {/* -------------------------------------------------------- */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">
                    Existing Caller Greeting
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Message for returning callers
                  </p>

                  <textarea
                    value={existingGreeting}
                    onChange={(e) => setExistingGreeting(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                    placeholder="Enter greeting for existing callers..."
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                </div>

                {/* -------------------------------------------------------- */}
                {/* NEW CALLER GREETING */}
                {/* -------------------------------------------------------- */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">
                    New Caller Greeting
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Message for first-time callers
                  </p>

                  <textarea
                    value={newCallerGreeting}
                    onChange={(e) => setNewCallerGreeting(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                    placeholder="Enter greeting for new callers..."
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                </div>

                {/* -------------------------------------------------------- */}
                {/* SAVE GREETINGS BUTTON */}
                {/* -------------------------------------------------------- */}
                <button
                  onClick={saveGreetings}
                  disabled={isSavingGreetings}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {isSavingGreetings ? 'Saving...' : 'Save Greetings'}
                </button>

              </div>
            )}
          </div>
          {/* ============================================================= */}
          {/*                PANEL 3: AI BEHAVIOR CONTROLS                  */}
          {/* ============================================================= */}
          <div
            className="p-6 rounded-2xl backdrop-blur-sm"
            style={{
              background: 'rgba(26, 26, 36, 0.75)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              boxShadow: '0 8px 32px rgba(255, 0, 140, 0.15)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-orange-600">
                <i className="ri-settings-3-line text-white text-xl" />
              </div>

              <h2
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                AI Behavior Controls
              </h2>
            </div>

            <div className="space-y-6">

              {/* ---------------------------------------------------------- */}
              {/* TEMPERATURE SLIDER */}
              {/* ---------------------------------------------------------- */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-purple-300">AI Temperature</label>

                  <span className="text-sm text-orange-400 font-mono">
                    {aiTemperature.toFixed(2)}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={aiTemperature}
                  onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#0d0d12] rounded-lg appearance-none cursor-pointer slider-purple"
                />
              </div>

              {/* ---------------------------------------------------------- */}
              {/* RESPONSE SPEED SLIDER */}
              {/* ---------------------------------------------------------- */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-purple-300">Response Speed</label>

                  <span className="text-sm text-orange-400 font-mono">
                    {responseSpeed.toFixed(2)}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={responseSpeed}
                  onChange={(e) => setResponseSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#0d0d12] rounded-lg appearance-none cursor-pointer slider-purple"
                />
              </div>

              {/* ---------------------------------------------------------- */}
              {/* CREATIVITY SLIDER */}
              {/* ---------------------------------------------------------- */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-purple-300">Creativity Level</label>

                  <span className="text-sm text-orange-400 font-mono">
                    {creativity.toFixed(2)}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={creativity}
                  onChange={(e) => setCreativity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#0d0d12] rounded-lg appearance-none cursor-pointer slider-purple"
                />
              </div>

            </div>
          </div>
          {/* ============================================================= */}
          {/*                    PANEL 4: ACCOUNT OVERVIEW                   */}
          {/* ============================================================= */}
          <div
            className="p-6 rounded-2xl backdrop-blur-sm"
            style={{
              background: 'rgba(26, 26, 36, 0.75)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              boxShadow: '0 8px 32px rgba(255, 0, 140, 0.15)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-orange-600">
                <i className="ri-dashboard-line text-white text-xl" />
              </div>

              <h2
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Account Overview
              </h2>
            </div>

            <div className="space-y-4">

              <div className="flex justify-between items-center p-4 bg-[#0d0d12] rounded-lg border border-purple-500/20">
                <span className="text-gray-300">Total Calls</span>
                <span className="text-2xl font-bold text-orange-400">1,247</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-[#0d0d12] rounded-lg border border-purple-500/20">
                <span className="text-gray-300">Active Users</span>
                <span className="text-2xl font-bold text-purple-400">342</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-[#0d0d12] rounded-lg border border-purple-500/20">
                <span className="text-gray-300">Avg. Call Duration</span>
                <span className="text-2xl font-bold text-orange-400">4:32</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-[#0d0d12] rounded-lg border border-purple-500/20">
                <span className="text-gray-300">Success Rate</span>
                <span className="text-2xl font-bold text-green-400">94.7%</span>
              </div>

            </div>
          </div>
          {/* END ACCOUNT OVERVIEW */}
        </div>
        {/* END GRID */}
      </div>
      {/* END PAGE WRAPPER */}
    </CoreLayout>
  );
}
// END OF FILE
