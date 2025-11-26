import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("https://app.neurospherevoiceai.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || `Login failed: ${res.status} ${res.statusText}`);
        setIsLoading(false);
        return;
      }

      // Store credentials
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", data.token);
      storage.setItem("customerId", data.customer_id);
      storage.setItem("userEmail", email);
      storage.setItem("userRole", data.role || "user");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(`Connection error: ${error instanceof Error ? error.message : "Unable to reach server"}`);
      setIsLoading(false);
    }
  };

  // Temporary bypass function for testing
  const handleBypassLogin = () => {
    // Set fake credentials for testing
    localStorage.setItem("authToken", "demo-token-12345");
    localStorage.setItem("customerId", "demo-customer");
    localStorage.setItem("userEmail", "demo@neurosphere.com");
    localStorage.setItem("userRole", "admin");
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] text-white relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 hex-grid opacity-20"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-purple-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="mb-6 flex items-center gap-2 text-purple-400 hover:text-orange-400 transition-colors cursor-pointer whitespace-nowrap"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <i className="ri-arrow-left-line"></i>
          <span>Back to Home</span>
        </button>

        <div
          className="p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden"
          style={{
            background: "rgba(20, 20, 30, 0.85)",
            border: "1px solid rgba(138, 43, 226, 0.3)",
            boxShadow: "0 8px 32px rgba(138, 43, 226, 0.2), 0 0 80px rgba(255, 106, 0, 0.1)"
          }}
        >
          {/* Gradient Overlay */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{
              background: "linear-gradient(90deg, #8a2be2, #ff6a00)",
              boxShadow: "0 0 20px rgba(138, 43, 226, 0.5)"
            }}
          />

          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                background: "linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px rgba(138, 43, 226, 0.3))"
              }}
            >
              NEUROSPHERE
            </h1>
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Access the Core System
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <i className="ri-error-warning-line text-red-400 text-xl flex-shrink-0 mt-0.5"></i>
              <div className="flex-1">
                <p className="text-red-400 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@theinsurancedoctors.com"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 pl-11 bg-[#0d0d12] border rounded-lg text-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: "rgba(138, 43, 226, 0.3)",
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                  onFocus={(e) => (e.target as HTMLElement).style.borderColor = "#8a2be2"}
                  onBlur={(e) => (e.target as HTMLElement).style.borderColor = "rgba(138, 43, 226, 0.3)"}
                />
                <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"></i>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 pl-11 bg-[#0d0d12] border rounded-lg text-white focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: "rgba(138, 43, 226, 0.3)",
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                  onFocus={(e) => (e.target as HTMLElement).style.borderColor = "#8a2be2"}
                  onBlur={(e) => (e.target as HTMLElement).style.borderColor = "rgba(138, 43, 226, 0.3)"}
                />
                <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"></i>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-purple-500 bg-[#0d0d12] text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-purple-400 hover:text-orange-400 transition-colors whitespace-nowrap"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] whitespace-nowrap cursor-pointer"
              style={{
                background: isLoading ? "rgba(138, 43, 226, 0.5)" : "linear-gradient(135deg, #8a2be2 0%, #ff6a00 100%)",
                boxShadow: isLoading ? "none" : "0 4px 20px rgba(138, 43, 226, 0.4)",
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* TEMPORARY: Bypass Button for Testing */}
            <button
              type="button"
              onClick={handleBypassLogin}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] whitespace-nowrap cursor-pointer border-2"
              style={{
                background: "rgba(255, 106, 0, 0.1)",
                borderColor: "rgba(255, 106, 0, 0.5)",
                color: "#ff6a00",
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              <i className="ri-eye-line"></i>
              <span>View Dashboard (Demo Mode)</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "rgba(138, 43, 226, 0.2)" }}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#14141e] text-gray-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="py-2.5 rounded-lg border transition-all duration-300 flex items-center justify-center gap-2 hover:bg-purple-600/10 whitespace-nowrap cursor-pointer"
              style={{
                borderColor: "rgba(138, 43, 226, 0.3)",
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              <i className="ri-google-fill text-lg"></i>
              <span className="text-sm">Google</span>
            </button>
            <button
              type="button"
              className="py-2.5 rounded-lg border transition-all duration-300 flex items-center justify-center gap-2 hover:bg-purple-600/10 whitespace-nowrap cursor-pointer"
              style={{
                borderColor: "rgba(138, 43, 226, 0.3)",
                fontFamily: "'Space Grotesk', sans-serif"
              }}
            >
              <i className="ri-github-fill text-lg"></i>
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-400 mt-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Don't have an account?{" "}
            <a href="#" className="text-purple-400 hover:text-orange-400 transition-colors font-medium">
              Sign up
            </a>
          </p>
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
