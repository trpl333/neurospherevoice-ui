import { Link } from "react-router-dom";
export default function MarketingHome() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a12] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hex-grid opacity-30"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center pt-32 px-6 text-center">
        {/* Main Headline */}
        <h1 
          className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-6"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            textShadow: '0 0 40px rgba(138, 43, 226, 0.3), 0 0 80px rgba(255, 106, 0, 0.2)'
          }}
        >
          Enter the NeuroSphere Universe
        </h1>

        {/* Subheadline */}
        <p 
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-4 tracking-wide"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          AI Voice, Memory, and Automation in One Integrated Core.
        </p>

        <p className="text-base text-gray-400 max-w-2xl mb-12">
          The unified platform for intelligent voice assistants, persistent memory systems, 
          and seamless automation workflows.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            o="/pricing"
            className="px-10 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 transition-all duration-300 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 whitespace-nowrap cursor-pointer text-center"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            View Pricing
          </Link>

          <Link
            to="/onboarding/1"
           className="px-10 py-4 rounded-lg bg-white/90 text-[#0a0a12] hover:bg-white transition-all duration-300 font-semibold shadow-lg hover:scale-105 whitespace-nowrap cursor-pointer text-center"
           style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Start for $1
          </Link>

          <Link
            to="/login"
            className="px-10 py-4 rounded-lg border-2 border-purple-400/60 hover:bg-purple-600/30 hover:border-purple-400 transition-all duration-300 font-semibold backdrop-blur-sm whitespace-nowrap cursor-pointer text-center"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-10 py-4 rounded-lg border-2 border-white/15 hover:border-white/30 hover:bg-white/5 transition-all duration-300 font-semibold backdrop-blur-sm whitespace-nowrap cursor-pointer text-center"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Create Account
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full">
          {[
          {
            icon: "ri-phone-line",
            title: "AI Voice System",
            desc: "Natural conversations powered by advanced voice AI",
            to: "/phone-system",
          },
          {
            icon: "ri-brain-line",
            title: "Memory Core",
            desc: "Persistent context across all interactions",
            to: "/user-memories",
          },
          {
            icon: "ri-links-line",
            title: "Unified Integration",
            desc: "Connect everything in one seamless platform",
            to: "/ai-settings",
          },
        ].map((feature, idx) => (
          <Link
            key={idx}
            to={feature.to}
            className="relative p-8 rounded-2xl bg-[#1a1a24]/60 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 group block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <i className={`${feature.icon} text-5xl bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent`}></i>
              </div>

              <h3
                className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                {feature.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>

              <div className="mt-5 text-xs text-white/60 underline decoration-white/20 group-hover:decoration-white/50">
                Learn more →
              </div>
            </div>
          </Link>
        ))}

            <div
              key={idx}
              className="relative p-8 rounded-2xl bg-[#1a1a24]/60 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                  <i className={`${feature.icon} text-5xl bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent`}></i>
                </div>
                
                <h3 
                  className="text-xl font-bold mb-3 bg-gradient-to-r from-purple-300 to-orange-300 bg-clip-text text-transparent"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hex-grid {
          background-image: 
            linear-gradient(30deg, rgba(138, 43, 226, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(138, 43, 226, 0.05) 87.5%, rgba(138, 43, 226, 0.05)),
            linear-gradient(150deg, rgba(138, 43, 226, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(138, 43, 226, 0.05) 87.5%, rgba(138, 43, 226, 0.05)),
            linear-gradient(30deg, rgba(138, 43, 226, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(138, 43, 226, 0.05) 87.5%, rgba(138, 43, 226, 0.05)),
            linear-gradient(150deg, rgba(138, 43, 226, 0.05) 12%, transparent 12.5%, transparent 87%, rgba(138, 43, 226, 0.05) 87.5%, rgba(138, 43, 226, 0.05)),
            linear-gradient(60deg, rgba(255, 106, 0, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(255, 106, 0, 0.03) 75%, rgba(255, 106, 0, 0.03)),
            linear-gradient(60deg, rgba(255, 106, 0, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(255, 106, 0, 0.03) 75%, rgba(255, 106, 0, 0.03));
          background-size: 80px 140px;
          background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
        }
      `}</style>
    </div>
  );
}
