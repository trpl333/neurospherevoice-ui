// ============================================================================
// PHONE SYSTEM PAGE — FIXED + BACKEND-ALIGNED
// NeuroSphere VoiceAI – Multi-Tenant Frontend
//
// Backend Alignment (from ChatStack):
//   • GET /customers/<id>/config  → returns greeting_template under phone
//   • POST /customers/<id>/config → updates MUST be nested under "agent"
//       REF: update_customer_config() L12-L19
//
//   Valid POST structure for greetings:
//     {
//       "agent": {
//         "existing_user_greeting": "...",
//         "new_caller_greeting": "..."
//       }
//     }
//
//   • "greetings" as a top-level key is NOT recognized by backend
//     (your old code used this — that’s why saving didn’t work)
//
//   • Session auth requires: credentials: "include"
//     REF: customer_config.py L33-L41
//
// ============================================================================

import { useState, useEffect } from 'react';
import CoreLayout from '../../components/layout/CoreLayout';

// Use consistent API base across all pages
const API_BASE = import.meta.env.VITE_API_URL;

export default function PhoneSystem() {
  const [twilioNumber, setTwilioNumber] = useState('');
  const [existingGreeting, setExistingGreeting] = useState('');
  const [newCallerGreeting, setNewCallerGreeting] = useState('');
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingGreetings, setIsSavingGreetings] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load customer config on mount
  useEffect(() => {
    loadCustomerConfig();
  }, []);

  const getCustomerId = () =>
    localStorage.getItem('customerId') || sessionStorage.getItem('customerId');

  const loadCustomerConfig = async () => {
    try {
      const customerId = getCustomerId();
      if (!customerId) {
        setIsLoadingConfig(false);
        return;
      }

      const res = await fetch(
        `${API_BASE}/customers/${customerId}/config`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (res.ok) {
        const config = await res.json();

        let parsedGreeting = {};

        try {
          parsedGreeting = JSON.parse(config.greeting_template || "{}");
        } catch (e) {
          parsedGreeting = {};
        }

        const existingGreetingValue = parsedGreeting.existing || "";
        const newCallerGreetingValue = parsedGreeting.new || "";


        setTwilioNumber(config.phone?.twilio_phone_number || '');
        setExistingGreeting(existingGreetingValue);
        setNewCallerGreeting(newCallerGreetingValue);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoadingConfig(false);
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

    // Make sure we always send strings
    const safeExisting = existingGreeting ?? "";
    const safeNew = newCallerGreeting ?? "";

    // 🔥 Save into greeting_template (NOT agent)
    const payload = {
      greeting_template: {
        existing: safeExisting || "",
        new: safeNew || ""
      }
    };

    const res = await fetch(`${API_BASE}/customers/${customerId}/config`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      setSaveMessage("Greetings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
      // Phone System: leave user’s text visible
    } else {
      console.error("Save failed:", result);
      setSaveMessage(`Failed to save greetings (Status: ${res.status})`);
    }
  } catch (error) {
    console.error("Failed to save greetings:", error);
    setSaveMessage(`Error saving greetings: ${error.message}`);
  } finally {
    setIsSavingGreetings(false);
  }
};

  // ========================================================================
  // UI RENDER
  // ========================================================================
  return (
    <CoreLayout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            PHONE SYSTEM
          </h1>
          <p
            className="text-gray-400"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Manage your phone number and greeting messages
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div
            className="max-w-4xl mb-4 p-4 rounded-lg text-center"
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

        {isLoadingConfig ? (
          <div className="text-center py-12 text-purple-300">
            Loading configuration...
          </div>
        ) : (
          <div className="max-w-4xl space-y-6">

            {/* Phone Number Section */}
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
                  <i className="ri-phone-line text-white text-xl" />
                </div>
                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Assigned Phone Number
                </h2>
              </div>

              <div>
                <label className="block text-sm text-purple-300 mb-2">
                  Twilio Number
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Your dedicated phone number for incoming calls
                </p>
                <input
                  type="text"
                  value={twilioNumber}
                  readOnly
                  className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-gray-400 cursor-not-allowed text-lg font-mono"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>
            </div>

            {/* Greeting Templates Section */}
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
                  <i className="ri-message-3-line text-white text-xl" />
                </div>
                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Greeting Templates
                </h2>
              </div>

              <div className="space-y-6">

                {/* Existing Caller Greeting */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">
                    Existing Caller Greeting
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Message used for returning callers.
                  </p>
                  <textarea
                    value={existingGreeting}
                    onChange={(e) => setExistingGreeting(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                    placeholder="Enter greeting for existing callers..."
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                </div>

                {/* New Caller Greeting */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">
                    New Caller Greeting
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Message used for first-time callers.
                  </p>
                  <textarea
                    value={newCallerGreeting}
                    onChange={(e) => setNewCallerGreeting(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                    placeholder="Enter greeting for new callers..."
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  />
                </div>

                <button
                  onClick={saveGreetings}
                  disabled={isSavingGreetings}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {isSavingGreetings ? 'Saving...' : 'Save Greeting Templates'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CoreLayout>
  );
}
