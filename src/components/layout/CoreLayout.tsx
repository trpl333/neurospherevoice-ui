import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface CoreLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: 'ri-dashboard-line', label: 'Dashboard', path: '/dashboard' },
  { icon: 'ri-phone-line', label: 'Phone System', path: '/phone-system' },
  { icon: 'ri-brain-line', label: 'Personality Studio', path: '/personality-studio' },
  { icon: 'ri-user-line', label: 'User Memories', path: '/user-memories' },
  { icon: 'ri-book-line', label: 'Knowledge Base', path: '/knowledge-base' },
  { icon: 'ri-satellite-line', label: 'System Status', path: '/system-status' },
  { icon: 'ri-file-list-line', label: 'Call Logs', path: '/call-logs' },
  { icon: 'ri-mic-line', label: 'Voice Agents', path: '/voice-agents' },
  { icon: 'ri-links-line', label: 'Integrations', path: '/integrations' },
  { icon: 'ri-bank-card-line', label: 'Billing', path: '/billing' }
];

export default function CoreLayout({ children }: CoreLayoutProps) {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleNavigate = (path: string) => {
    window.REACT_APP_NAVIGATE(path);
  };

  const handleLogout = async () => {
    try {
      // Clears the HttpOnly session cookie (server-side)
      await fetch('https://app.neurospherevoiceai.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      // Even if this fails, still clear client hints and redirect.
      console.warn('Logout request failed:', err);
    }

    // Clear local UI hints (your app uses these)
    localStorage.removeItem('customerId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('ns_onboarding_v1');

    // Go to login (as requested)
    window.location.href = 'https://neurospherevoiceai.com/login';
  };

  return (
    <div className="flex min-h-screen bg-[#0b0b0f]">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen w-60 bg-[#0d0d12] border-r flex flex-col z-50"
        style={{ borderColor: 'rgba(138, 43, 226, 0.25)' }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(138, 43, 226, 0.15)' }}>
          <h1
            className="text-xl font-bold tracking-wider cursor-pointer"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.4))',
              wordBreak: 'keep-all',
              whiteSpace: 'normal',
              lineHeight: '1.3'
            }}
            onClick={() => handleNavigate('/dashboard')}
          >
            NEUROSPHERE
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredItem === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap group"
                style={{
                  background: isActive ? 'rgba(138, 43, 226, 0.15)' : 'transparent',
                  color: isActive ? '#ff6a00' : '#aaaaaa'
                }}
              >
                {/* Active/Hover Indicator */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r transition-all duration-300"
                  style={{
                    background: 'linear-gradient(180deg, #8a2be2, #ff6a00)',
                    opacity: isActive ? 1 : isHovered ? 0.6 : 0,
                    boxShadow: isActive ? '0 0 10px rgba(138, 43, 226, 0.6)' : 'none'
                  }}
                />

                {/* Icon */}
                <div className="w-5 h-5 flex items-center justify-center">
                  <i
                    className={`${item.icon} text-lg transition-all duration-300`}
                    style={{
                      color: isActive ? '#ff6a00' : isHovered ? '#8a2be2' : '#aaaaaa'
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  className="text-sm font-medium transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {item.label}
                </span>

                {/* Hover Glow */}
                {isHovered && !isActive && (
                  <div
                    className="absolute inset-0 rounded-lg opacity-50"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(138, 43, 226, 0.1), transparent)'
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(138, 43, 226, 0.15)' }}>
          <div className="flex items-center gap-2 text-xs text-purple-400/60">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>System Online</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(138, 43, 226, 0.15)',
              color: '#aaaaaa'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#ff6a00';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 106, 0, 0.35)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#aaaaaa';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(138, 43, 226, 0.15)';
            }}
          >
            <i className="ri-logout-box-r-line text-lg" />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-60">
        <div className="min-h-screen">{children}</div>
      </main>

      {/* Background Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(138,43,226,0.3) 1px, transparent 1px),
              linear-gradient(rgba(138,43,226,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
    </div>
  );
}
