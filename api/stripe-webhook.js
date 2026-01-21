const crypto = require("crypto");
const { json } = require("./_util");

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyStripeSignature(rawBody, sigHeader, secret) {
  // Stripe-Signature: t=...,v1=...,v0=...
  const parts = (sigHeader || "").split(",").map((p) => p.trim());
  const t = parts.find((p) => p.startsWith("t="))?.slice(2);
  const v1 = parts.find((p) => p.startsWith("v1="))?.slice(3);
  if (!t || !v1) return false;

  const signed = `${t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signed, "utf8").digest("hex");
  return timingSafeEqual(expected, v1);
}

// POST /api/stripe-webhook
module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return json(res, 500, { error: "Missing STRIPE_WEBHOOK_SECRET env var" });

    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString("utf8");

    const sig = req.headers["stripe-signature"];
    const ok = verifyStripeSignature(raw, sig, secret);
    if (!ok) return json(res, 400, { error: "Invalid Stripe signature" });

    const evt = JSON.parse(raw);

    // MVP: just acknowledge. Later: provision tenant, store subscription, etc.
    if (evt.type === "checkout.session.completed") {
      const session = evt.data?.object;
      // You can persist session.client_reference_id (our onboarding sessionId) here when DB is wired.
    }

    return json(res, 200, { received: true });
  } catch (e) {
    return json(res, 500, { error: e.message || "Webhook error" });
  }
};
