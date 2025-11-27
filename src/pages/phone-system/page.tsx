import { useState, useEffect } from 'react';
import CoreLayout from '../../components/layout/CoreLayout';

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
        greetings: {
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
        // Don't reload config - keep the user's input visible
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
          <p className="text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
                <label className="block text-sm text-purple-300 mb-2">Twilio Number</label>
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
                  <label className="block text-sm text-purple-300 mb-2">Existing Caller Greeting</label>
                  <p className="text-xs text-gray-400 mb-3">
                    This message will be used when a returning caller contacts you. You can use variables like {'{'}{'{'} caller_name {'}'}{'}'}
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
                  <label className="block text-sm text-purple-300 mb-2">New Caller Greeting</label>
                  <p className="text-xs text-gray-400 mb-3">
                    This message will be used when a first-time caller contacts you. You can use variables like {'{'}{'{'} caller_name {'}'}{'}'}
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
