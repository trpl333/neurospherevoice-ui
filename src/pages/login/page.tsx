
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("https://voice.theinsurancedoctors.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Store token and user info
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", data.token);
      storage.setItem("customerId", data.customer_id);
      storage.setItem("userEmail", email);
      if (data.role) storage.setItem("userRole", data.role);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] text-white relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 hex-grid opacity-30"></div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
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

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div 
            className="text-6xl font-bold mb-2"
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.4))'
            }}
          >
            NS
          </div>
          <h1 
            className="text-2xl font-bold"
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Login to access your NeuroSphere Core
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1a1a24]/60 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[#0a0a12] border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-300 mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[#0a0a12] border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-purple-500/30 bg-[#0a0a12] text-purple-500 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-sm text-gray-300" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 transition-all duration-300 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Logging in...
                </span>
              ) : (
                "Login to Core"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1a24] text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                or
              </span>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg border border-purple-500/30 hover:bg-purple-600/20 hover:border-purple-500/50 transition-all duration-300 text-white font-medium flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <i className="ri-google-fill text-xl"></i>
              Continue with Google
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg border border-purple-500/30 hover:bg-purple-600/20 hover:border-purple-500/50 transition-all duration-300 text-white font-medium flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <i className="ri-github-fill text-xl"></i>
              Continue with GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors inline-flex items-center gap-2 cursor-pointer"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <i className="ri-arrow-left-line"></i>
            Back to Home
          </a>
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
