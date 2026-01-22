import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-white/70">
          Start for $1. We’ll verify your payment method and activate a 14-day trial.
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate("/onboarding/1")}
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
          >
            Start for $1
          </button>

          <Link
            to="/login"
            className="block w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 text-center hover:border-white/30"
          >
            I already have an account
          </Link>

          <Link
            to="/home"
            className="block text-center text-sm text-white/60 hover:text-white/80"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 text-xs text-white/50">
          By continuing, you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
