import { useState } from 'react';
import CoreLayout from '../../components/layout/CoreLayout';

export default function Dashboard() {
  const [greetingMessage, setGreetingMessage] = useState('Welcome to Neurosphere AI');
  const [transferNumber, setTransferNumber] = useState('');
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [responseSpeed, setResponseSpeed] = useState(0.5);
  const [creativity, setCreativity] = useState(0.6);

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
          
          {/* Panel 1: Custom Greetings */}
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
                Custom Greetings
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-purple-300 mb-2">Greeting Message</label>
                <textarea
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d12] border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                  rows={3}
                  placeholder="Enter your custom greeting..."
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>
              
              <button 
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Save Greeting
              </button>
            </div>
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
