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

export default function Dashboard() {
  const [agentName, setAgentName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isSavingAgent, setIsSavingAgent] = useState(false);
  const [isSavingVoice, setIsSavingVoice] = useState(false);
  const [isSavingGreetings, setIsSavingGreetings] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Phone System / Greeting fields
  const [twilioNumber, setTwilioNumber] = useState('');
  const [existingGreeting, setExistingGreeting] = useState('');
  const [newCallerGreeting, setNewCallerGreeting] = useState('');

  const [greetingMessage, setGreetingMessage] = useState('Welcome to Neurosphere AI');
  const [transferNumber, setTransferNumber] = useState('');
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [responseSpeed, setResponseSpeed] = useState(0.5);
  const [creativity, setCreativity] = useState(0.6);

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
        console.log('Full config received:', JSON.stringify(config, null, 2));
        
        setAgentName(config.agent?.agent_name || '');
        setSelectedVoice(config.agent?.openai_voice || 'alloy');
        
        // Try multiple possible locations for greetings
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
        
        console.log('Loaded existing greeting:', existingGreetingValue);
        console.log('Loaded new caller greeting:', newCallerGreetingValue);
        
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

  const saveGreetings = async () => {
    try {
      setIsSavingGreetings(true);
      setSaveMessage('');
      
      const customerId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
      
      if (!customerId) {
        setSaveMessage('Error: No customer ID found. Please log in again.');
        return;
      }

      // Save greetings in the same format as agent_name - nested under "agent"
      const payload = {
        agent: {
          existing_user_greeting: existingGreeting,
          new_caller_greeting: newCallerGreeting
        }
      };

      console.log('Sending greeting payload:', JSON.stringify(payload, null, 2));

      const res = await fetch(
        `https://app.neurospherevoiceai.com/api/customers/${customerId}/config`,
        {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const responseData = await res.json();
      console.log('Save response:', responseData);

      if (res.ok) {
        setSaveMessage('Greetings saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
        // Reload config to show updated values
        await loadCustomerConfig();
      } else {
        console.error('Save failed with status:', res.status, responseData);
        setSaveMessage(`Failed to save greetings (Status: ${res.status})`);
      }
    } catch (error) {
      console.error('Failed to save greetings:', error);
      setSaveMessage(`Error saving greetings: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setIsSavingGreetings(false);
    }
  };

  const handleNavigateToAISettings = () => {
    window.REACT_APP_NAVIGATE('/ai-settings');
  };

  const handleNavigateToPhoneSystem = () => {
    window.REACT_APP_NAVIGATE('/phone-system');
  };

  return (
    <CoreLayout>
      <div className="p-8">
        {/* Header */}
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

        {/* Save Message */}
        {saveMessage && (
          <div 
            className="max-w-7xl mx-auto mb-4 p-4 rounded-lg text-center"
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

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          
          {/* Panel 1: AI Agent & Voice Selection */}
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
              <button
                onClick={handleNavigateToAISettings}
                className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm hover:bg-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <i className="ri-settings-3-line mr-1" />
                Open AI Settings
              </button>
            </div>
            
            {isLoadingConfig ? (
              <div className="text-center py-8 text-purple-300">Loading configuration...</div>
            ) : (
              <div className="space-y-6">
                {/* Agent Name */}
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

                {/* Voice Selection */}
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

          {/* Panel 2: Customer Greeting */}
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
              <button
                onClick={handleNavigateToPhoneSystem}
                className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 text-sm hover:bg-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <i className="ri-phone-line mr-1" />
                Open Phone System
              </button>
            </div>
            
            {isLoadingConfig ? (
              <div className="text-center py-8 text-purple-300">Loading configuration...</div>
            ) : (
              <div className="space-y-6">
                {/* Twilio Number (Read-only) */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Assigned Phone Number</label>
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

                {/* Existing Caller Greeting */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Existing Caller Greeting</label>
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

                {/* New Caller Greeting */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">New Caller Greeting</label>
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

          {/* Panel 3: AI Behavior Controls */}
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
              {/* Temperature Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-purple-300">AI Temperature</label>
                  <span className="text-sm text-orange-400 font-mono">{aiTemperature.toFixed(2)}</span>
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

              {/* Response Speed Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-purple-300">Response Speed</label>
                  <span className="text-sm text-orange-400 font-mono">{responseSpeed.toFixed(2)}</span>
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

              {/* Creativity Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-purple-300">Creativity Level</label>
                  <span className="text-sm text-orange-400 font-mono">{creativity.toFixed(2)}</span>
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

          {/* Panel 4: Account Overview */}
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

        </div>
      </div>
    </CoreLayout>
  );
}
