export type PlanId = "starter" | "growth" | "enterprise";

export type OnboardingData = {
  sessionId: string;
  plan: PlanId;
  createdAt: string; // ISO
  step1?: {
    fullName: string;
    email: string;
    businessName: string;
    businessAddress: string;
    phone: string;
    taxId?: string;
  };
  step2?: {
    aiName: string;
    greeting: string;
    tone: "friendly" | "professional" | "bold" | "custom";
    customTone?: string;
  };
  step3?: {
    businessHours: string;
    transferEnabled: boolean;
    transferPhone?: string;
    transferWhen: "always" | "after_hours" | "on_request";
    transferNotes?: string;
  };
  step4?: {
    voicePreset: "warm" | "crisp" | "deep" | "custom";
    customVoiceId?: string;
    knowledgeNotes?: string;
  };
  payment?: {
    stripeSessionId: string;
    paid: boolean;
    paidAt?: string;
  };
  provisioned?: {
    accountNumber: string;
    tenantName: string;
    provisionedAt: string;
  };
};

const STORAGE_KEY = "ns_onboarding_v1";
const TENANT_KEY = "ns_tenant_v1";

export function getOrCreateOnboarding(plan?: PlanId): OnboardingData {
  const existing = loadOnboarding();
  if (existing) {
    if (plan) existing.plan = plan;
    saveOnboarding(existing);
    return existing;
  }
  const sessionId = crypto.randomUUID();
  const data: OnboardingData = {
    sessionId,
    plan: plan ?? "starter",
    createdAt: new Date().toISOString(),
  };
  saveOnboarding(data);
  return data;
}

export function loadOnboarding(): OnboardingData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

export function saveOnboarding(data: OnboardingData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
}

export type TenantRecord = {
  accountNumber: string;
  tenantName: string;
  email: string;
  phone: string;
  createdAt: string;
};

export function saveTenant(t: TenantRecord) {
  localStorage.setItem(TENANT_KEY, JSON.stringify(t));
}

export function loadTenant(): TenantRecord | null {
  try {
    const raw = localStorage.getItem(TENANT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TenantRecord;
  } catch {
    return null;
  }
}

export function clearTenant() {
  localStorage.removeItem(TENANT_KEY);
}

// Crockford Base32 (no I, L, O, U)
const ALPH = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function base32FromNumber(n: number): string {
  if (n === 0) return "0";
  let out = "";
  while (n > 0) {
    out = ALPH[n % 32] + out;
    n = Math.floor(n / 32);
  }
  return out;
}

function randomBase32(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPH[bytes[i] % 32];
  return out;
}

export function generateAccountNumber(phone?: string, at: Date = new Date()): string {
  // NS-YYMMDD-RRRR-PPP
  const yy = String(at.getFullYear()).slice(-2);
  const mm = String(at.getMonth() + 1).padStart(2, "0");
  const dd = String(at.getDate()).padStart(2, "0");

  const rand = randomBase32(4);

  let phonePart = "000";
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length >= 4) {
    const last4 = parseInt(digits.slice(-4), 10);
    phonePart = base32FromNumber(last4).padStart(3, "0").slice(-3);
  }

  return `NS-${yy}${mm}${dd}-${rand}-${phonePart}`;
}

export function isOnboardingComplete(data: OnboardingData | null): boolean {
  if (!data) return false;
  return Boolean(
    data.step1 && data.step2 && data.step3 && data.step4 && data.payment?.paid
  );
}
