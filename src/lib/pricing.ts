export type PlanKey = "starter" | "growth" | "elite";

export type Plan = {
  key: PlanKey;
  name: string;
  priceMonthly: number;
  minutesIncluded: number;
  seatsIncluded: number | "unlimited";
  tagline: string;
  bestFor: string[];
  includes: string[];
};

export type AddOn = {
  key: string;
  name: string;
  price: string; // "$97/mo", "$200 one-time", etc.
  description: string;
};

export const TRIAL = {
  activationFee: 1, // dollars
  trialDays: 14,
  includedCompletedCalls: 10,
  // optional: includedMinutes: 200,
  copy: "Pay $1 to activate your 14-day trial. Includes 10 completed calls. Cancel anytime.",
};

export const PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    priceMonthly: 297,
    minutesIncluded: 1000,
    seatsIncluded: 1,
    tagline: "Inbound receptionist + basic automation",
    bestFor: ["Solo agents", "Small 2–3 person teams", "New offices"],
    includes: [
      "AI inbound receptionist (Twilio + voice AI)",
      "Basic call routing & voicemail",
      "Business hours + after-hours flows",
      "Appointment booking (Cal.com integration)",
      "Call summaries (basic)",
      "1 outbound workflow (renewal reminders OR missed-call texts)",
      "AI-Memory Lite (30-day retention)",
      "Admin portal basics (greetings + voice selection)",
    ],
  },
  {
    key: "growth",
    name: "Growth",
    priceMonthly: 597,
    minutesIncluded: 5000,
    seatsIncluded: 5,
    tagline: "Full outbound engine + knowledge base + long memory",
    bestFor: ["Most agencies", "Teams handling 20–80 calls/day", "Scaling service + sales"],
    includes: [
      "Everything in Starter",
      "Knowledge base + multi-intent receptionist",
      "Outbound engine: renewals, cross-sell, win-back, claims follow-up",
      "AI-Memory Pro (365-day retention + episodic memory)",
      "Dynamic greetings for returning callers",
      "Agency scripts: Auto / Home / Umbrella / Claims / Billing",
      "Farmers-ready compliance greetings",
      "Admin portal controls (greetings, voice, call flows)",
    ],
  },
  {
    key: "elite",
    name: "Elite",
    priceMonthly: 997,
    minutesIncluded: 15000,
    seatsIncluded: "unlimited",
    tagline: "Multi-location + custom campaigns + concierge onboarding",
    bestFor: ["High-volume offices", "Multi-location", "Serious automation"],
    includes: [
      "Everything in Growth",
      "Multi-location / multi-number support",
      "Dedicated AI voice tuning (ElevenLabs)",
      "Custom outbound campaigns (QuoteWizard, blitzes, etc.)",
      "ChatStack deployment with custom personas",
      "Priority routing for high-value callers",
      "RunPod LLM integration",
      "Internal “AI CSR” mode for staff tasks",
      "AI-Memory Enterprise (docs + embeddings + extended retention)",
      "Dedicated onboarding specialist",
    ],
  },
];

export const ENTERPRISE = {
  name: "Enterprise / Carrier",
  priceRange: "$24k–$84k/year per region",
  includes: [
    "White-label NeuroSphere AI",
    "Multi-agency analytics dashboard",
    "Shared knowledge base ingestion",
    "Claims hotline mode",
    "Dedicated API + engineering support",
    "Training for 50–500 agencies",
    "Priority voice + compliance tuning",
  ],
};

export const ADDONS: AddOn[] = [
  {
    key: "sms",
    name: "SMS Automation Engine",
    price: "$97/mo",
    description: "Appointment follow-ups, renewal confirmation, payment reminders",
  },
  {
    key: "dialer",
    name: "Lead AI Dialer (Outbound)",
    price: "$197/mo",
    description: "QuoteWizard / Everquote AI qualifying calls",
  },
  {
    key: "minutes_1000",
    name: "Additional Minutes",
    price: "$50 per 1,000 minutes",
    description: "Add to any plan",
  },
  {
    key: "minutes_10000",
    name: "Additional Minutes (Bulk)",
    price: "$275 per 10,000 minutes",
    description: "Add to any plan",
  },
  {
    key: "custom_voice",
    name: "Custom Voice / Personality",
    price: "$200 one-time",
    description: "Custom ElevenLabs tuning for your brand voice",
  },
];
