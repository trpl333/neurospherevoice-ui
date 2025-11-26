import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('https://app.neurospherevoiceai.com/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        // Store customer ID from response
        if (data.customer_id) {
          localStorage.setItem('customerId', data.customer_id);
          localStorage.setItem('userEmail', email);
        }
        
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Login failed' }));
        setErrorMessage(errorData.message || 'Invalid email or password');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] text-white relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 hex-grid opacity-30"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-[#1a1a24]/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              NEUROSPHERE
            </h1>
            <p className="text-gray-400 text-sm">Login to your Core</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm text-center">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0a12]/60 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0a0a12]/60 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-orange-400 hover:from-purple-600 hover:to-orange-500 transition-all duration-300 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {isLoading ? 'Logging in...' : 'Login to Core'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1a1a24] text-gray-400">or</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
          </div>
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
