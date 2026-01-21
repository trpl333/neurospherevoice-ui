import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getJSON } from "../../lib/api";
import {
  getOrCreateOnboarding,
  saveOnboarding,
  generateAccountNumber,
  saveTenant,
  clearOnboarding,
} from "../../lib/onboarding";

type SessionStatus = {
  paid: boolean;
  status: string;
  sessionId: string;
  customerEmail?: string;
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const q = useQuery();
  const sessionId = q.get("session_id") || "";

  const ob = getOrCreateOnboarding();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!sessionId) {
          throw new Error("Missing Stripe session_id.");
        }

        const status = await getJSON<SessionStatus>(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`);

        if (!status.paid) {
          throw new Error(`Payment not confirmed yet (status: ${status.status}).`);
        }

        // Mark paid
        const paidAt = new Date().toISOString();
        const updated = {
          ...ob,
          payment: { stripeSessionId: sessionId, paid: true, paidAt },
        };

        // "Provision" (MVP): generate account number + store tenant locally
        const tenantName = updated.step1?.businessName || "New Tenant";
        const phone = updated.step1?.phone || "";
        const email = updated.step1?.email || status.customerEmail || "";

        const accountNumber = generateAccountNumber(phone, new Date());
        saveOnboarding({
          ...updated,
          provisioned: {
            accountNumber,
            tenantName,
            provisionedAt: paidAt,
          },
        });

        saveTenant({
          accountNumber,
          tenantName,
          email,
          phone,
          createdAt: paidAt,
        });

        // Clear onboarding session so future starts are fresh
        clearOnboarding();

        navigate("/dashboard");
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong.");
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-orange-400" />
        <h1 className="text-2xl font-extrabold">Activating your account…</h1>

        {loading && (
          <p className="mt-3 text-white/70">
            Confirming payment and provisioning your tenant.
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 text-left">
            {error}
            <div className="mt-3 text-xs text-red-200/70">
              If Stripe keys/webhook aren’t set up yet, this is expected. You can still proceed manually for now.
            </div>
            <div className="mt-4 flex gap-3">
              <button
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
                onClick={() => navigate("/pricing")}
              >
                Back to pricing
              </button>
              <button
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
                onClick={() => navigate("/dashboard")}
              >
                Go to dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
