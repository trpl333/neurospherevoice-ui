import { useState } from 'react';
import CoreLayout from '../../components/layout/CoreLayout';

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
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      phone: '+1 (555) 123-4567',
      key: 'preferred_name',
      value: 'Alex',
      timestamp: '2024-01-15 14:32:00',
      expanded: false
    },
    {
      id: '2',
      phone: '+1 (555) 123-4567',
      key: 'last_inquiry',
      value: 'Asked about pricing plans and enterprise features',
      timestamp: '2024-01-15 14:35:12',
      expanded: false
    },
    {
      id: '3',
      phone: '+1 (555) 987-6543',
      key: 'customer_type',
      value: 'Premium subscriber',
      timestamp: '2024-01-14 09:15:30',
      expanded: false
    },
    {
      id: '4',
      phone: '+1 (555) 987-6543',
      key: 'preferences',
      value: '{"notifications": true, "language": "en", "timezone": "PST"}',
      timestamp: '2024-01-14 09:16:45',
      expanded: false
    }
  ]);

  const toggleExpand = (id: string) => {
    setMemories(memories.map(mem => 
      mem.id === id ? { ...mem, expanded: !mem.expanded } : mem
    ));
  };

  const filteredMemories = searchPhone 
    ? memories.filter(mem => mem.phone.includes(searchPhone))
    : memories;

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
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Enter phone number…"
              className="w-full px-6 py-4 pl-14 bg-[#1a1a24] border-2 rounded-xl text-white text-lg focus:outline-none transition-all duration-300"
              style={{
                borderColor: searchPhone ? '#ff6a00' : 'rgba(138, 43, 226, 0.4)',
                boxShadow: searchPhone ? '0 0 20px rgba(255, 106, 0, 0.3)' : '0 0 15px rgba(138, 43, 226, 0.2)',
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
