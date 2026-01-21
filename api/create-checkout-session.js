const { json, getBaseUrl, stripeFetch } = require("./_util");

// POST /api/create-checkout-session
// Body: { plan: "starter"|"growth", sessionId: string, customerEmail?: string, businessName?: string }
module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString("utf8");
    const body = raw ? JSON.parse(raw) : {};

    const plan = body.plan;
    const onboardingSessionId = body.sessionId;

    if (!plan || !onboardingSessionId) {
      return json(res, 400, { error: "Missing required fields: plan, sessionId" });
    }

    if (plan === "enterprise") {
      return json(res, 400, { error: "Enterprise plan uses demo booking, not Stripe checkout." });
    }

    const base = getBaseUrl(req);

    // Placeholder prices (monthly subscription). Change these anytime.
    const planMap = {
      starter: { name: "NeuroSphere Starter", amount: 49900 },
      growth: { name: "NeuroSphere Growth", amount: 149900 },
    };

    const cfg = planMap[plan];
    if (!cfg) return json(res, 400, { error: "Invalid plan" });

    const successUrl = `${base}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${base}/pricing`;

    const session = await stripeFetch("/checkout/sessions", "POST", {
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: onboardingSessionId,
      customer_email: body.customerEmail || undefined,
      metadata: {
        onboarding_session_id: onboardingSessionId,
        plan: plan,
        business_name: body.businessName || "",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: cfg.name },
            unit_amount: cfg.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
    });

    return json(res, 200, { checkoutUrl: session.url, sessionId: session.id });
  } catch (e) {
    const status = e.status || 500;
    return json(res, status, {
      error: e.message || "Failed to create checkout session",
      hint:
        "If this fails in production, add STRIPE_SECRET_KEY in Vercel env vars. (Stripe test keys work fine.)",
    });
  }
};
