import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./_Shell";
import { getOrCreateOnboarding, saveOnboarding } from "../../lib/onboarding";
import { postJSON } from "../../lib/api";

type CreateCheckoutResponse = { checkoutUrl: string; sessionId: string };

export default function OnboardingCheckout() {
  const navigate = useNavigate();
  const ob = getOrCreateOnboarding();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Basic guard: you shouldn't be here without steps 1-4
    if (!ob.step1 || !ob.step2 || !ob.step3 || !ob.step4) {
      navigate("/onboarding/1");
    }
  }, []);

  async function pay() {
    setError(null);
    setLoading(true);
    try {
      const resp = await postJSON<CreateCheckoutResponse>("/api/create-checkout-session", {
        plan: ob.plan,
        sessionId: ob.sessionId,
        customerEmail: ob.step1?.email,
        businessName: ob.step1?.businessName,
      });

      saveOnboarding({
        ...ob,
        payment: {
          stripeSessionId: resp.sessionId,
          paid: false,
        },
      });

      window.location.href = resp.checkoutUrl;
    } catch (e: any) {
      setError(e?.message ?? "Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  }

  function back() {
    navigate("/onboarding/4");
  }

  const planLabel =
  ob.plan === "growth" ? "Growth" : ob.plan === "starter" ? "Starter" : "Elite";

  return (
    <OnboardingShell
      step={5}
      title="Payment"
      subtitle="Secure checkout powered by Stripe. After payment, we provision your account and drop you into the dashboard."
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-white/70">
          <div className="font-semibold text-white/85">Plan</div>
          <div className="mt-1">{planLabel}</div>

          <div className="mt-4 text-xs text-white/55">
            Note: prices are placeholders until you finalize Stripe price IDs.
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
            <div className="mt-2 text-xs text-red-200/70">
              If you haven’t added Stripe env vars in Vercel yet, this will fail. That’s normal.
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
            onClick={back}
            disabled={loading}
          >
            Back
          </button>
          <button
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90 disabled:opacity-40"
            onClick={pay}
            disabled={loading}
            >
            {loading ? "Starting checkout..." : "Pay & Activate"}

          </button>
        </div>

      </div>
    </OnboardingShell>
  );
}
