const { json, stripeFetch } = require("./_util");

// GET /api/checkout-session?session_id=cs_test_...
module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) return json(res, 400, { error: "Missing session_id" });

    const session = await stripeFetch(`/checkout/sessions/${sessionId}`, "GET");

    // Stripe returns payment_status in checkout session
    const paid = session.payment_status === "paid" || session.status === "complete";
    return json(res, 200, {
      paid,
      status: session.payment_status || session.status,
      sessionId: session.id,
      customerEmail: session.customer_details?.email || session.customer_email || undefined,
    });
  } catch (e) {
    const status = e.status || 500;
    return json(res, status, { error: e.message || "Failed to fetch session" });
  }
};
