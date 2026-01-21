import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./_Shell";
import { getOrCreateOnboarding, saveOnboarding } from "../../lib/onboarding";

export default function OnboardingStep1() {
  const navigate = useNavigate();
  const ob = getOrCreateOnboarding();

  const [fullName, setFullName] = useState(ob.step1?.fullName ?? "");
  const [email, setEmail] = useState(ob.step1?.email ?? "");
  const [businessName, setBusinessName] = useState(ob.step1?.businessName ?? "");
  const [businessAddress, setBusinessAddress] = useState(ob.step1?.businessAddress ?? "");
  const [phone, setPhone] = useState(ob.step1?.phone ?? "");
  const [taxId, setTaxId] = useState(ob.step1?.taxId ?? "");

  useEffect(() => {
    // ensure session exists
    getOrCreateOnboarding(ob.plan);
  }, []);

  function next() {
    saveOnboarding({
      ...ob,
      step1: { fullName, email, businessName, businessAddress, phone, taxId: taxId || undefined },
    });
    navigate("/onboarding/2");
  }

  return (
    <OnboardingShell
      step={1}
      title="Company & Contact"
      subtitle="This becomes your tenant profile and billing contact."
    >
      <div className="grid gap-4">
        <Field label="Full name" value={fullName} onChange={setFullName} required />
        <Field label="Email" value={email} onChange={setEmail} required type="email" />
        <Field label="Business name" value={businessName} onChange={setBusinessName} required />
        <Field label="Business address" value={businessAddress} onChange={setBusinessAddress} required />
        <Field label="Main phone" value={phone} onChange={setPhone} required />
        <Field label="Tax ID (optional)" value={taxId} onChange={setTaxId} />
        <button
          className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90 disabled:opacity-40"
          onClick={next}
          disabled={!fullName || !email || !businessName || !businessAddress || !phone}
        >
          Continue
        </button>
      </div>
    </OnboardingShell>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white/85">
        {props.label}{props.required ? " *" : ""}
      </label>
      <input
        type={props.type ?? "text"}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
