import { useState, useEffect } from 'react';
import CoreLayout from '../../components/layout/CoreLayout';
import api from '../../lib/api';

interface Memory {
  id: string;
  phone: string;
  key: string;
  value: string;
  timestamp: string;
  expanded: boolean;
}

export default function UserMemories() {
  const [searchPhone, setSearchPhone] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const getCustomerId = () =>
    localStorage.getItem('customerId') || sessionStorage.getItem('customerId');

  const toggleExpand = (id: string) => {
    setMemories((prev) =>
      prev.map((mem) =>
        mem.id === id ? { ...mem, expanded: !mem.expanded } : mem
      )
    );
  };

  // Fetch memories from backend for the given phone number
  const fetchMemories = async () => {
    setError('');
    setIsLoading(true);
    try {
      const customerId = getCustomerId();
      if (!customerId) {
        setError('No customer ID found. Please log in again.');
        return;
      }
      if (!searchPhone) {
        setError('Please enter a phone number to search.');
        return;
      }
      const data: any = await api.get(
        `/customers/${customerId}/memories?phone=${encodeURIComponent(
          searchPhone
        )}`
      );
      const mems = (data.memories || []).map((m: any, idx: number) => {
        const id = m.uuid || m.id || m.memory_id || `${idx}`;
        let valueString = '';
        if (m.value !== undefined) {
          if (typeof m.value === 'object') {
            try {
              valueString = JSON.stringify(m.value);
            } catch (e) {
              valueString = String(m.value);
            }
          } else {
            valueString = String(m.value);
          }
        } else {
          valueString = '';
        }
        const timestamp =
          m.timestamp || m.created_at || m.ts || new Date().toISOString();
        return {
          id,
          phone: searchPhone,
          key: m.key || '',
          value: valueString,
          timestamp: timestamp,
          expanded: false
        } as Memory;
      });
      setMemories(mems);
    } catch (err: any) {
      console.error('Error fetching memories:', err);
      setError(err.message || 'Failed to fetch memories');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new memory for the current phone number
  const addMemory = async () => {
    setError('');
    try {
      const customerId = getCustomerId();
      if (!customerId) {
        setError('No customer ID found. Please log in again.');
        return;
      }
      if (!searchPhone) {
        setError('Please search by phone number before adding a memory.');
        return;
      }
      if (!newKey || !newValue) {
        setError('Memory key and value are required.');
        return;
      }
      await api.post(`/customers/${customerId}/memories`, {
        memory_type: 'fact',
        key: newKey,
        value: newValue,
        user_id: searchPhone
      });
      // Reset input fields
      setNewKey('');
      setNewValue('');
      // Refresh list
      fetchMemories();
    } catch (err: any) {
      console.error('Error adding memory:', err);
      setError(err.message || 'Failed to add memory');
    }
  };

  // Derived filtered list: if a searchPhone is set, show all memories loaded
  const filteredMemories = memories;

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
            THE MEMORY CORE
          </h1>
          <div 
            className="h-1 w-64 mx-auto mt-4 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #8a2be2, #ff6a00)',
              boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)'
            }}
          />
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="relative">
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Enter phone number…"
              className="w-full px-6 py-4 pl-14 bg-[#1a1a24] border-2 rounded-xl text-white text-lg focus:outline-none transition-all duration-300"
              style={{
                borderColor: searchPhone ? '#ff6a00' : 'rgba(138, 43, 226, 0.4)',
                boxShadow: searchPhone
                  ? '0 0 20px rgba(255, 106, 0, 0.3)'
                  : '0 0 15px rgba(138, 43, 226, 0.2)',
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            />
            <i className="ri-search-line absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-purple-400" />
            {searchPhone && (
              <button
                onClick={() => setSearchPhone('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-purple-600/20 hover:bg-purple-600/40 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-purple-400" />
              </button>
            )}
          </div>
          {/* Search button */}
          <div className="flex justify-end mt-3">
            <button
              onClick={fetchMemories}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 text-white text-sm font-semibold shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Search Memories
            </button>
          </div>
        </div>

        {/* Error & Loading Messages */}
        {error && (
          <div className="max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-sm text-center">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="max-w-4xl mx-auto mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm text-center">
            Loading memories...
          </div>
        )}

        {/* Add New Memory Form */}
        <div className="max-w-4xl mx-auto mb-8 p-6 rounded-xl backdrop-blur-sm"
          style={{
            background: 'rgba(26, 26, 36, 0.75)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            boxShadow: '0 8px 32px rgba(255, 0, 140, 0.1)'
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Add New Memory
          </h2>
          <div className="flex flex-col md:flex-row gap-3 mb-3">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Memory key"
              className="flex-1 px-4 py-2 rounded-lg bg-[#1a1a24] border border-purple-500/30 text-white focus:outline-none focus:border-orange-500/40 text-sm"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Memory value"
              className="flex-1 px-4 py-2 rounded-lg bg-[#1a1a24] border border-purple-500/30 text-white focus:outline-none focus:border-orange-500/40 text-sm"
            />
            <button
              onClick={addMemory}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-orange-600 text-white font-medium hover:from-purple-700 hover:to-orange-700 transition-all text-sm"
            >
              Add Memory
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Memories are stored for this phone number and can be retrieved on future calls.
          </p>
        </div>

        {/* Memory Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-database-2-line text-6xl text-purple-400/30 mb-4" />
              <p className="text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                No memories found
              </p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <div
                key={memory.id}
                onClick={() => toggleExpand(memory.id)}
                className="p-5 rounded-xl backdrop-blur-sm transition-all duration-300 cursor-pointer hover:scale-[1.01]"
                style={{
                  background: 'rgba(28, 28, 37, 0.8)',
                  borderLeft: '4px solid',
                  borderImage: 'linear-gradient(180deg, #8a2be2, #ff6a00) 1',
                  boxShadow: memory.expanded 
                    ? '0 8px 32px rgba(138, 43, 226, 0.3)' 
                    : '0 4px 16px rgba(138, 43, 226, 0.15)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <i className="ri-phone-line text-purple-400" />
                      <span className="text-orange-400 font-mono text-sm">{memory.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-300 font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {memory.key}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {memory.expanded ? memory.value : memory.value.substring(0, 80) + (memory.value.length > 80 ? '...' : '')}
                    </p>
                    
                    {memory.expanded && memory.value.startsWith('{') && (
                      <pre className="mt-3 p-3 bg-[#0d0d12] rounded-lg text-xs text-green-400 overflow-x-auto border border-purple-500/20">
                        {JSON.stringify(JSON.parse(memory.value), null, 2)}
                      </pre>
                    )}
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <i className="ri-time-line" />
                      <span>{memory.timestamp}</span>
                    </div>
                  </div>
                  
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600/20 hover:bg-purple-600/40 transition-colors">
                    <i className={`ri-arrow-${memory.expanded ? 'up' : 'down'}-s-line text-purple-400`} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CoreLayout>
  );
}
