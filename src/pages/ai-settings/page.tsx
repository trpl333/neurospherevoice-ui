import { useState, useEffect } from 'react';
import CoreLayout from '../../components/layout/CoreLayout';
import api from '../../lib/api';

// Clean American-friendly voice names (values stay the same)
const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alex' },
  { value: 'echo', label: 'Jordan' },
  { value: 'shimmer', label: 'Megan' },

  { value: 'ash', label: 'Michael' },
  { value: 'ballad', label: 'Emily' },
  { value: 'coral', label: 'Rachel' },
  { value: 'sage', label: 'Daniel' },
  { value: 'verse', label: 'Olivia' },

  { value: 'cedar', label: 'Kevin' },
  { value: 'marin', label: 'Samantha' },  // as requested
  { value: 'sol', label: 'Grace' }
];

export default function AISettings() {
  const [agentName, setAgentName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [isSavingVoice, setIsSavingVoice] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // On mount — load customer config
  useEffect(() => {
    loadCustomerConfig();
  }, []);

  const getCustomerId = () => {
    return (
      localStorage.getItem('customerId') || 
      sessionStorage.getItem('customerId')
    );
  };

  const loadCustomerConfig = async () => {
    try {
      const customerId = getCustomerId();
      if (!customerId) {
        console.warn('No customer ID found');
        setIsLoadingConfig(false);
        return;
      }

      const config = await api.get(`/customers/${customerId}/config`);
      setAgentName(config.agent?.agent_name || '');
      setSelectedVoice(config.agent?.openai_voice || 'alloy');
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const saveAgentName = async () => {
    try {
      setIsSavingAgent(true);
      setSaveMessage('');

      const customerId = getCustomerId();
      if (!customerId) {
        setSaveMessage('Error: No customer ID found. Please log in again.');
        return;
      }

      await api.post(`/customers/${customerId}/config`, {
        agent: { agent_name: agentName }
      });
      setSaveMessage('Agent name saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save agent name:', error);
      setSaveMessage(
        `Error saving agent name: ${
          error instanceof Error ? error.message : 'Network error'
        }`
      );
    } finally {
      setIsSavingAgent(false);
    }
  };

  const saveVoiceSelection = async () => {
    try {
      setIsSavingVoice(true);
      setSaveMessage('');

      const customerId = getCustomerId();
      if (!customerId) {
        setSaveMessage('Error: No customer ID found. Please log in again.');
        return;
      }

      await api.post(`/customers/${customerId}/config`, {
        agent: { openai_voice: selectedVoice }
      });
      setSaveMessage('Voice selection saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save voice selection:', error);
      setSaveMessage(
        `Error saving voice selection: ${
          error instanceof Error ? error.message : 'Network error'
        }`
      );
    } finally {
      setIsSavingVoice(false);
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
              background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            AI SETTINGS
          </h1>

          <p className="text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Configure your AI agent’s identity and voice
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
            {/* Agent Name Section */}
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
                  <i className="ri-robot-line text-white text-xl" />
                </div>

                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Agent Identity
                </h2>
              </div>

              <label className="block text-sm text-purple-300 mb-2">Agent Name</label>
              <p className="text-xs text-gray-400 mb-3">
                This is the name your AI agent uses when introducing itself
              </p>

              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                placeholder="Enter agent name..."
              />

              <button
                onClick={saveAgentName}
                disabled={isSavingAgent}
                className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingAgent ? 'Saving...' : 'Save Agent Name'}
              </button>
            </div>

            {/* Voice Selection Section */}
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
                  <i className="ri-mic-line text-white text-xl" />
                </div>

                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Voice Selection
                </h2>
              </div>

              <label className="block text-sm text-purple-300 mb-2">AI Voice</label>
              <p className="text-xs text-gray-400 mb-3">
                Choose the voice your AI agent will use during calls
              </p>

              <div className="relative">
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white appearance-none"
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
                className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingVoice ? 'Saving...' : 'Save Voice Selection'}
              </button>
            </div>
          </div>
        )}
      </div>
    </CoreLayout>
  );
}

