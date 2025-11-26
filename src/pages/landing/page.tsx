import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./landing.css";

export default function LandingPortal() {
  const navigate = useNavigate();
  const [animationPhase, setAnimationPhase] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [showPhrase, setShowPhrase] = useState(true);

  useEffect(() => {
    // Phrase sequence: 0=A Voice, 1=A Brain, 2=A Memory, 3=Finally United, 4=show all
    const phraseTimings = [
      { phrase: 0, delay: 50 },      // A Voice appears at 0.05s
      { phrase: 1, delay: 4000 },    // A Brain appears at 4s
      { phrase: 2, delay: 7000 },    // A Memory appears at 7s
      { phrase: 3, delay: 10000 },   // Finally United appears at 10s
      { phrase: 4, delay: 13000 },   // Show all permanently at 13s
    ];

    const phraseTimeouts = phraseTimings.map(({ phrase, delay }) =>
      setTimeout(() => {
        setCurrentPhrase(phrase);
        setShowPhrase(true);
      }, delay)
    );

    // Titles shoot to corners at 16s
    const titleTimeout = setTimeout(() => setAnimationPhase(1), 16000);
    
    // List items start cascading at 17s (1s after titles)
    const listTimeout = setTimeout(() => setAnimationPhase(2), 17000);

    return () => {
      phraseTimeouts.forEach(clearTimeout);
      clearTimeout(titleTimeout);
      clearTimeout(listTimeout);
    };
  }, []);

  const handleEnter = () => {
    navigate("/home");
  };

  const inboundFeatures = [
    "Answers Every Call Instantly",
    "Greets Callers by Name",
    "Routes Calls Intelligently (Based on Intent)",
    "Screens & Blocks Spam / Robocalls",
    "Captures Caller Details Automatically",
    "Detects Urgency & Escalates to Humans",
    "Takes Messages & Sends Summaries",
    "Remembers Caller History & Context",
    "Handles After-Hours / Holidays / Overflow"
  ];

  const outboundFeatures = [
    "Proactive Customer Service Calls",
    "Follows Up on Unfinished Tasks",
    "Reaches Out to New Leads Instantly",
    "Re-Engages Dormant or Lost Customers",
    "Schedules Appointments",
    "Personalized Announcements or Updates",
    "Automated Thank-You or Welcome Calls",
    "Executes Retention & Loyalty Campaigns",
    "Auto-Retries Missed Calls",
    "Smart Follow-Up Texts After Each Call"
  ];

  const advancedFeatures = [
    "Personalized Dynamic Greetings",
    "Real-Time Caller Texting (Simultaneous SMS)",
    "Caller Memory Across Calls",
    "Smart Transfer to Humans",
    "Call Screening & Spam Blocking",
    "Automatic Call Summaries & CRM Sync",
    "Email, SMS, and Calendar Automation",
    "Omni-Channel Intelligence"
  ];

  const specialtyAgents = [
    "Lead Capture Agent",
    "Customer Follow-Up Agent",
    "Document & Information Collection Agent",
    "Loyalty & Re-Engagement Agent",
    "Onboarding & Welcome Agent",
    "VIP Priority Agent",
    "Smart Receptionist AI (Advanced Mode)"
  ];

  const phrases = ["A Voice", "A Brain", "A Memory", "Finally United"];

  return (
    <div className="min-h-screen w-full bg-[#0b0b0f] flex items-center justify-center relative overflow-hidden">
      {/* Hex-grid background */}
      <div className="absolute inset-0 hex-grid opacity-40"></div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Sequential Phrase Animation - Center Screen */}
      {currentPhrase < 4 && showPhrase && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <h1 
            key={currentPhrase}
            className="text-5xl md:text-7xl font-extrabold animate-phraseIn"
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              color: '#ffffff',
              textShadow: `
                0 0 30px rgba(192, 132, 252, 0.9),
                0 0 60px rgba(249, 168, 212, 0.7),
                0 0 90px rgba(251, 146, 60, 0.5)
              `
            }}
          >
            {phrases[currentPhrase]}
          </h1>
        </div>
      )}

      {/* Feature Titles and Lists - Top Corners */}
      {animationPhase >= 1 && (
        <>
          {/* Inbound Agent - Top Left */}
          <div className="absolute top-8 left-8 z-30">
            <h2 
              className="text-2xl font-bold mb-4 animate-shootFromCenter"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Inbound Call Agent
            </h2>
            {animationPhase >= 2 && (
              <div className="space-y-2">
                {inboundFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="text-gray-300 text-sm animate-cascadeIn"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  >
                    • {feature}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outbound Call Agent - Top Right */}
          <div className="absolute top-8 right-8 z-30">
            <h2 
              className="text-2xl font-bold mb-4 animate-shootFromCenter text-right"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Outbound Call Agent
            </h2>
            {animationPhase >= 2 && (
              <div className="space-y-2">
                {outboundFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="text-gray-300 text-sm animate-cascadeIn text-left"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  >
                    • {feature}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Voice Automations - Bottom Left */}
          <div className="absolute top-8 left-8 z-30" style={{ marginTop: '45vh' }}>
            <h2 
              className="text-2xl font-bold mb-4 animate-shootFromCenter"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Advanced Voice Automations
            </h2>
            {animationPhase >= 2 && (
              <div className="space-y-2">
                {advancedFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="text-gray-300 text-sm animate-cascadeIn"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  >
                    • {feature}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specialty AI Agents - Bottom Right */}
          <div className="absolute top-8 right-8 z-30" style={{ marginTop: '45vh' }}>
            <h2 
              className="text-2xl font-bold mb-4 animate-shootFromCenter"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Specialty AI Agents
            </h2>
            {animationPhase >= 2 && (
              <div className="space-y-2">
                {specialtyAgents.map((feature, index) => (
                  <div
                    key={index}
                    className="text-gray-300 text-sm animate-cascadeIn text-left"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  >
                    • {feature}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center px-6 w-full">
        
        {/* Orb Container - Always visible and centered */}
        <div
          className="relative cursor-pointer group z-10 flex flex-col items-center"
          onClick={handleEnter}
        >
          {/* Orbital rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[380px] h-[380px] rounded-full border border-purple-500/20 animate-spin" style={{ animationDuration: '30s' }}></div>
            <div className="absolute w-[420px] h-[420px] rounded-full border border-orange-500/15 animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }}></div>
          </div>

          {/* Main Circle with Gradient Ring and Transparent Center */}
          <div className="orb-container group-hover:scale-105 transition-all duration-300 relative">
            <div className="w-[280px] h-[280px] rounded-full relative flex items-center justify-center">
              {/* Gradient Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-orange-500 p-[3px]">
                <div className="w-full h-full rounded-full bg-[#0b0b0f]"></div>
              </div>
              
              {/* NS Text and Press to Enter - Centered with Purple to Orange Gradient */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div 
                  className="text-[120px] font-bold select-none leading-none" 
                  style={{ 
                    fontFamily: '"Orbitron", "Arial", sans-serif', 
                    letterSpacing: '-0.05em',
                    background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.4))'
                  }}
                >
                  NS
                </div>
                <div 
                  className="text-sm font-semibold tracking-wider uppercase mt-2"
                  style={{ 
                    fontFamily: '"Space Grotesk", "Arial", sans-serif',
                    background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Press to Enter
                </div>
              </div>
            </div>

            {/* Orbiting Text */}
            <div className="absolute inset-0 animate-spin-slow">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <path
                    id="circlePath"
                    d="M 100, 100 m -85, 0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
                  />
                  <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#8a2be2', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ff6a00', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <text 
                  className="uppercase font-bold"
                  style={{ 
                    fontSize: '11px',
                    letterSpacing: '0.7em',
                    fontFamily: "'Orbitron', sans-serif",
                    fill: 'url(#textGradient)'
                  }}
                >
                  <textPath href="#circlePath" startOffset="0%">
                    <tspan style={{ fontSize: '2em' }}>•</tspan>ENTER THE <tspan style={{ fontSize: '2em' }}>•</tspan> NEUROSPHERE UNIVERSE <tspan style={{ fontSize: '2em' }}>•</tspan>
                  </textPath>
                </text>
              </svg>
            </div>

          </div>

          {/* System Status Text - Below orb */}
          {currentPhrase >= 4 && (
            <p className="text-center text-gray-400 mt-8 tracking-[0.2em] text-sm opacity-80 uppercase animate-heroFade" style={{ fontFamily: '"Space Grotesk", "Arial", sans-serif' }}>
              System Ready. Awaiting Input.
            </p>
          )}

          {/* Static Hero Text - Below System Status */}
          {currentPhrase >= 4 && (
            <div className="text-center mt-6 space-y-3 animate-heroFade" style={{ animationDelay: '0.3s' }}>
              <p 
                className="text-2xl md:text-3xl font-bold tracking-wide"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#ffffff',
                  textShadow: `
                    0 0 20px rgba(192, 132, 252, 0.8),
                    0 0 40px rgba(249, 168, 212, 0.6),
                    0 0 60px rgba(251, 146, 60, 0.4)
                  `
                }}
              >
                A Voice | A Brain | A Memory
              </p>
              
              <p 
                className="text-3xl md:text-4xl font-extrabold"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#ffffff',
                  textShadow: `
                    0 0 25px rgba(192, 132, 252, 0.9),
                    0 0 50px rgba(249, 168, 212, 0.7),
                    0 0 75px rgba(251, 146, 60, 0.5)
                  `
                }}
              >
                Finally United
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
