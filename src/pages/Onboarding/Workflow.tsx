// src/pages/Onboarding/Workflow.tsx
//
// 5-step "User Registration & Verification" flow, built on shadcn's <Tabs>.
// The visible stepper header is a custom control that drives the same
// `value` state as the underlying Tabs — TabsList itself is kept but
// visually hidden (sr-only) so keyboard/AT users still get a real tablist.
//
// Requires: npx shadcn@latest add tabs button input label
// Icons: lucide-react

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  ShieldCheck,
  Landmark,
  IndianRupee,
  CheckCircle2,
  ChevronDown,
  Lock,
  PartyPopper,
  Fingerprint,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type BasicDetails = {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
};

type BankDetails = {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
};

const STEPS = [
  { id: "basic", label: "Basic Details" },
  { id: "kyc", label: "DigiLocker KYC" },
  { id: "bank", label: "Bank Details" },
  { id: "verify", label: "Verify ₹1" },
  { id: "complete", label: "Complete" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const STEP_ACCENT: Record<StepId, string> = {
  basic: "bg-blue-600",
  kyc: "bg-violet-600",
  bank: "bg-emerald-600",
  verify: "bg-amber-500",
  complete: "bg-emerald-600",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function Workflow() {
  const [step, setStep] = useState<StepId>("basic");
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());

  const [basic, setBasic] = useState<BasicDetails>({
    fullName: "Rahul Kumar",
    mobile: "9876543210",
    email: "rahul.kumar@email.com",
    dob: "1995-08-15",
    gender: "Male",
    address: "123, MG Road, Bengaluru,\nKarnataka - 560001",
  });

  const [bank, setBank] = useState<BankDetails>({
    accountHolder: "Rahul Kumar",
    bankName: "State Bank of India",
    accountNumber: "12345678901",
    ifsc: "SBIN0001234",
  });

  const [verifyAmount, setVerifyAmount] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const goTo = (id: StepId) => setStep(id);
  const markDoneAndGo = (from: StepId, to: StepId) => {
    setCompleted((prev) => new Set(prev).add(from));
    goTo(to);
  };

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const handleVerify = () => {
    if (verifyAmount.trim() !== "1" && verifyAmount.trim() !== "1.00") {
      setVerifyError("That doesn't match the amount we sent. Check your bank SMS and try again.");
      return;
    }
    setVerifyError(null);
    markDoneAndGo("verify", "complete");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <h1 className="text-center text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        User Registration &amp; Verification
      </h1>

      <Tabs value={step} onValueChange={(v) => setStep(v as StepId)} className="mt-8">
        {/* Real tablist for a11y — visually hidden, stepper below is the visible control.
            Wrapped in its own sr-only div (rather than putting sr-only directly on
            TabsList) so overflow:hidden always wins over any of shadcn's own
            default TabsList classes — the hidden tablist can never push the
            page into horizontal scroll this way. */}
        <div className="sr-only">
          <TabsList>
            {STEPS.map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ── Visual stepper ── */}
        <div className="mb-8 sm:mb-10">
          {/* Mobile-only caption: keeps the current step's name readable
              without cramming all 5 text labels into a narrow screen */}
          <div className="mb-3 flex items-center justify-between sm:hidden">
            <span className="text-xs font-semibold text-slate-500">
              Step {stepIndex + 1} of {STEPS.length}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {STEPS[stepIndex].label}
            </span>
          </div>

          <ol className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const isDone = completed.has(s.id) || i < stepIndex;
              const isActive = s.id === step;
              return (
                <li key={s.id} className="flex min-w-0 flex-1 items-center last:flex-none">
                  <button
                    type="button"
                    onClick={() => goTo(s.id)}
                    className="flex shrink-0 flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors sm:h-9 sm:w-9 ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isActive
                          ? `${STEP_ACCENT[s.id]} text-white`
                          : "border-2 border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : i + 1}
                    </span>
                    {/* Full labels only from sm+ — mobile relies on the caption above */}
                    <span
                      className={`hidden text-xs font-medium sm:block ${
                        isDone || isActive ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <span
                      className={`mx-1.5 h-0.5 flex-1 rounded-full sm:mx-2 ${
                        i < stepIndex ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* ── Step 1: Basic Details ── */}
        <TabsContent value="basic" className="mt-0">
          <StepCard icon={<User className="h-5 w-5" />} iconBg="bg-blue-600"
            title="1. Basic Details" subtitle="Enter your basic information">
            <div className="space-y-4">
              <Field label="Full Name">
                <Input value={basic.fullName}
                  onChange={(e) => setBasic((b) => ({ ...b, fullName: e.target.value }))} />
              </Field>
              <Field label="Mobile Number">
                <Input value={basic.mobile}
                  onChange={(e) => setBasic((b) => ({ ...b, mobile: e.target.value }))} />
              </Field>
              <Field label="Email ID">
                <Input type="email" value={basic.email}
                  onChange={(e) => setBasic((b) => ({ ...b, email: e.target.value }))} />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Date of Birth">
                  <Input type="date" value={basic.dob}
                    onChange={(e) => setBasic((b) => ({ ...b, dob: e.target.value }))} />
                </Field>
                <Field label="Gender">
                  <div className="relative">
                    <select
                      value={basic.gender}
                      onChange={(e) => setBasic((b) => ({ ...b, gender: e.target.value }))}
                      className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </Field>
              </div>
              <Field label="Address">
                <textarea
                  rows={2}
                  value={basic.address}
                  onChange={(e) => setBasic((b) => ({ ...b, address: e.target.value }))}
                  className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Field>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => markDoneAndGo("basic", "kyc")}
              >
                Continue
              </Button>
            </div>
          </StepCard>
        </TabsContent>

        {/* ── Step 2: DigiLocker KYC ── */}
        <TabsContent value="kyc" className="mt-0">
          <StepCard icon={<Fingerprint className="h-5 w-5" />} iconBg="bg-violet-600"
            title="2. DigiLocker KYC" subtitle="Verify your identity using DigiLocker">
            <div className="space-y-4">
              <Banner tone="success">DigiLocker account found</Banner>

              <Field label="Select document to fetch">
                <div className="relative">
                  <select
                    disabled
                    className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm"
                  >
                    <option>Aadhaar Card</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </Field>

              <div className="rounded-lg border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800">Fetched Details</span>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                </div>
                <dl className="space-y-2 text-sm">
                  <Row label="Name" value={basic.fullName} />
                  <Row label="Aadhaar Number" value="XXXX XXXX 1234" />
                  <Row label="Date of Birth" value={basic.dob || "—"} />
                  <Row label="Gender" value={basic.gender} />
                </dl>
              </div>

              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5 shrink-0" /> Your information is safe and secure
              </p>

              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                onClick={() => markDoneAndGo("kyc", "bank")}
              >
                Continue
              </Button>
            </div>
          </StepCard>
        </TabsContent>

        {/* ── Step 3: Bank Account Details ── */}
        <TabsContent value="bank" className="mt-0">
          <StepCard icon={<Landmark className="h-5 w-5" />} iconBg="bg-emerald-600"
            title="3. Bank Account Details" subtitle="Enter your bank account details">
            <div className="space-y-4">
              <Field label="Account Holder Name">
                <Input value={bank.accountHolder}
                  onChange={(e) => setBank((b) => ({ ...b, accountHolder: e.target.value }))} />
              </Field>
              <Field label="Bank Name">
                <Input value={bank.bankName}
                  onChange={(e) => setBank((b) => ({ ...b, bankName: e.target.value }))} />
              </Field>
              <Field label="Account Number">
                <Input value={bank.accountNumber}
                  onChange={(e) => setBank((b) => ({ ...b, accountNumber: e.target.value }))} />
              </Field>
              <Field label="IFSC Code">
                <Input value={bank.ifsc}
                  onChange={(e) => setBank((b) => ({ ...b, ifsc: e.target.value }))} />
              </Field>

              <Banner tone="success">
                <Lock className="mr-1.5 inline h-3.5 w-3.5" />
                We will send ₹1 to your account for verification
              </Banner>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => markDoneAndGo("bank", "verify")}
              >
                Send ₹1 &amp; Continue
              </Button>
            </div>
          </StepCard>
        </TabsContent>

        {/* ── Step 4: Verify with ₹1 ── */}
        <TabsContent value="verify" className="mt-0">
          <StepCard icon={<IndianRupee className="h-5 w-5" />} iconBg="bg-amber-500"
            title="4. Verify with ₹1" subtitle="Check your bank account for a ₹1 transaction">
            <div className="space-y-4">
              <Banner tone="warning">
                <span className="block font-semibold">We have sent ₹1 to your bank account</span>
                <span className="text-xs">
                  Please check your account and enter the amount to verify.
                </span>
              </Banner>

              <Field label="Enter the amount received (in ₹)">
                <Input
                  value={verifyAmount}
                  onChange={(e) => { setVerifyAmount(e.target.value); setVerifyError(null); }}
                  placeholder="1.00"
                />
              </Field>

              {verifyError && <p className="text-xs font-medium text-red-600">{verifyError}</p>}

              <div className="rounded-lg border border-slate-200 p-4 text-sm">
                <Row label="Transaction ID" value="TXN1234567890" />
                <Row label="Sent to" value={`XXXXXX${bank.accountNumber.slice(-4)}`} />
                <Row label="Sent on" value="24 May 2024, 11:30 AM" />
              </div>

              <Button
                className="w-full bg-amber-500 hover:bg-amber-600"
                onClick={handleVerify}
              >
                Verify &amp; Continue
              </Button>
            </div>
          </StepCard>
        </TabsContent>

        {/* ── Step 5: Complete ── */}
        <TabsContent value="complete" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2">
            <StepCard icon={<CheckCircle2 className="h-5 w-5" />} iconBg="bg-emerald-600"
              title="5. Verification Successful" subtitle="All your details have been verified">
              <ul className="space-y-2.5 text-sm">
                {(["Basic Details", "DigiLocker KYC", "Bank Account", "₹1 Verification"] as const).map((label) => (
                  <li key={label} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> {label}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-emerald-600">Verified</span>
                  </li>
                ))}
              </ul>
              <Banner tone="success" className="mt-4">All verifications completed successfully!</Banner>
            </StepCard>

            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
              <PartyPopper className="mb-2 h-10 w-10 text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-900">Registration Complete!</h3>
              <p className="mt-1 text-sm text-slate-500">Welcome to our platform</p>
              <p className="mt-3 text-sm text-slate-600">
                Your account has been successfully created and all your details are verified.
              </p>
              <Button className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
              <button className="mt-3 text-sm font-medium text-blue-600 hover:underline">
                Go to Dashboard
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Shared pieces ──────────────────────────────────────────────────────────

function StepCard({
  icon, iconBg, title, subtitle, children,
}: {
  icon: React.ReactNode; iconBg: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${iconBg}`}>
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-600">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}

function Banner({
  tone, children, className = "",
}: {
  tone: "success" | "warning"; children: React.ReactNode; className?: string;
}) {
  const styles =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-amber-50 text-amber-800 border-amber-100";
  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${styles} ${className}`}>
      {tone === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />}
      {tone === "warning" && <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />}
      <div>{children}</div>
    </div>
  );
}