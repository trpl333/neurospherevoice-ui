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
          credentials: 'include'
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

  const handleNavigateToAISettings = () => {
    window.REACT_APP_NAVIGATE('/ai-settings');
  };

  const getVoiceLabel = (value: string) => {
    return VOICE_OPTIONS.find(v => v.value === value)?.label || value;
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

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          
          {/* Panel 1: AI Agent & Voice Selection (READ-ONLY MIRROR) */}
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
                Edit in AI Settings
              </button>
            </div>
            
            {isLoadingConfig ? (
              <div className="text-center py-8 text-purple-300">Loading configuration...</div>
            ) : (
              <div className="space-y-6">
                {/* Agent Name (Read-only display) */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">Agent Name</label>
                  <div
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/20 rounded-lg text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {agentName || 'Not set'}
                  </div>
                </div>

                {/* Voice Selection (Read-only display) */}
                <div>
                  <label className="block text-sm text-purple-300 mb-2">AI Voice Selection</label>
                  <div
                    className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/20 rounded-lg text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {getVoiceLabel(selectedVoice)}
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-400 text-center">
                  <i className="ri-information-line mr-1" />
                  Changes must be made in AI Settings page
                </div>
              </div>
            )}
          </div>

          {/* Panel 2: Transfer Routing Rules */}
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
                Transfer Routing Rules
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-purple-300 mb-2">Transfer Phone Number</label>
                <input
                  type="tel"
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                  placeholder="+1 (555) 000-0000"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#0d0d12] rounded-lg border border-purple-500/20">
                <input type="checkbox" className="w-4 h-4 accent-purple-600 cursor-pointer" />
                <span className="text-sm text-gray-300">Enable automatic transfer on keywords</span>
              </div>
              
              <button 
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 cursor-pointer whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Update Rules
              </button>
            </div>
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
