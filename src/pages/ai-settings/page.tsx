import { useState, useEffect } from 'react';
import CoreLayout from '../../components/layout/CoreLayout';

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy (Original)' },
  { value: 'echo', label: 'Echo (Original)' },
  { value: 'shimmer', label: 'Shimmer (Original)' },
  { value: 'ash', label: 'Ash (Enhanced)' },
  { value: 'ballad', label: 'Ballad (Enhanced)' },
  { value: 'coral', label: 'Coral (Enhanced)' },
  { value: 'sage', label: 'Sage (Enhanced)' },
  { value: 'verse', label: 'Verse (Enhanced)' },
  { value: 'cedar', label: 'Cedar (Premium Natural Speech)' },
  { value: 'marin', label: 'Marin (Premium Natural Speech)' },
  { value: 'sol', label: 'Sol (Premium Natural Speech)' }
];

export default function AISettings() {
  const [agentName, setAgentName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [isSavingVoice, setIsSavingVoice] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load customer config on mount
  useEffect(() => {
    loadCustomerConfig();
  }, []);

  const loadCustomerConfig = async () => {
    try {
      const customerId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
      
      if (!customerId) {
        console.warn('No customer ID found');
        setIsLoadingConfig(false);
        return;
      }

      const res = await fetch(
        `https://app.neurospherevoiceai.com/api/customers/${customerId}/config`,
        {
          method: 'GET',
          credentials: 'include',
          mode: 'cors'
        }
      );

      if (res.ok) {
        const config = await res.json();
        setAgentName(config.agent?.agent_name || '');
        setSelectedVoice(config.agent?.openai_voice || 'alloy');
      }
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
      
      const customerId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
      
      if (!customerId) {
        setSaveMessage('Error: No customer ID found. Please log in again.');
        return;
      }

      const res = await fetch(
        `https://app.neurospherevoiceai.com/api/customers/${customerId}/config`,
        {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
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
        console.error('Save failed with status:', res.status, errorText);
        setSaveMessage(`Failed to save agent name (Status: ${res.status})`);
      }
    } catch (error) {
      console.error('Failed to save agent name:', error);
      setSaveMessage(`Error saving agent name: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setIsSavingAgent(false);
    }
  };

  const saveVoiceSelection = async () => {
    try {
      setIsSavingVoice(true);
      setSaveMessage('');
      
      const customerId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
      
      if (!customerId) {
        setSaveMessage('Error: No customer ID found. Please log in again.');
        return;
      }

      const res = await fetch(
        `https://app.neurospherevoiceai.com/api/customers/${customerId}/config`,
        {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agent: { openai_voice: selectedVoice }
          })
        }
      );

      if (res.ok) {
        setSaveMessage('Voice selection saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const errorText = await res.text();
        console.error('Save failed with status:', res.status, errorText);
        setSaveMessage(`Failed to save voice selection (Status: ${res.status})`);
      }
    } catch (error) {
      console.error('Failed to save voice selection:', error);
      setSaveMessage(`Error saving voice selection: ${error instanceof Error ? error.message : 'Network error'}`);
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
            Configure your AI agent's identity and voice
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
              border: `1px solid ${saveMessage.includes('Error') || saveMessage.includes('Failed') 
                ? 'rgba(239, 68, 68, 0.5)' 
                : 'rgba(34, 197, 94, 0.5)'}`,
              color: saveMessage.includes('Error') || saveMessage.includes('Failed') 
                ? '#fca5a5' 
                : '#86efac'
            }}
          >
            {saveMessage}
          </div>
        )}

        {isLoadingConfig ? (
          <div className="text-center py-12 text-purple-300">Loading configuration...</div>
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
              
              <div>
                <label className="block text-sm text-purple-300 mb-2">Agent Name</label>
                <p className="text-xs text-gray-400 mb-3">
                  This is the name your AI agent will use when introducing itself to callers
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
              
              <div>
                <label className="block text-sm text-purple-300 mb-2">AI Voice</label>
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
          </div>
        )}
      </div>
    </CoreLayout>
  );
}
