function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"];
  return `${proto}://${host}`;
}

function formEncode(obj, prefix) {
  const pairs = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === undefined || v === null) continue;
    if (typeof v === "object" && !Array.isArray(v)) {
      pairs.push(...formEncode(v, key));
    } else if (Array.isArray(v)) {
      v.forEach((item, idx) => {
        if (typeof item === "object") {
          pairs.push(...formEncode(item, `${key}[${idx}]`));
        } else {
          pairs.push([`${key}[${idx}]`, String(item)]);
        }
      });
    } else {
      pairs.push([key, String(v)]);
    }
  }
  return pairs
    .map(([a, b]) => encodeURIComponent(a) + "=" + encodeURIComponent(b))
    .join("&");
}

async function stripeFetch(path, method, body) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY env var in Vercel.");
  const url = `https://api.stripe.com/v1${path}`;

  const headers = {
    Authorization: `Bearer ${key}`,
  };

  let fetchBody;
  if (body) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    fetchBody = formEncode(body);
  }

  const resp = await fetch(url, {
    method,
    headers,
    body: fetchBody,
  });

  const txt = await resp.text();
  let data;
  try {
    data = JSON.parse(txt);
  } catch {
    data = { raw: txt };
  }

  if (!resp.ok) {
    const msg = data?.error?.message || `Stripe error (${resp.status})`;
    const err = new Error(msg);
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data;
}

module.exports = { json, getBaseUrl, stripeFetch };
