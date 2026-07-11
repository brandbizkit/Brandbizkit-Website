"use client";

import Link from "next/link";
import { useState } from "react";

const EXPERIENCE_OPTIONS = [
  { value: "none", label: "No knowledge or experience" },
  { value: "some", label: "Some knowledge and experience with a few AI tools" },
  { value: "experienced", label: "Experienced user of several tools but need guidance" },
];

/**
 * AI School signup form — captures the extra qualifying data the general
 * "Let's Talk" LeadForm doesn't: self-reported AI experience level and an
 * explicit terms/marketing consent checkbox (both stored on the lead record,
 * see supabase/migrations/002_ai_school_lead_fields.sql).
 */
export default function AiSchoolLeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`.trim(),
        email: form.get("email"),
        message: form.get("message"),
        experienceLevel: form.get("experienceLevel"),
        consent: form.get("consent") === "on",
        source: "ai-school",
        pagePath: window.location.pathname,
      }),
    });

    if (res.ok) {
      setStatus("sent");
    } else {
      const body = await res.json().catch(() => ({}));
      setErrorMsg(body.error || "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card bg-brand-light p-8 text-center">
        <p className="text-lg font-medium text-brand-ink">
          🎉 Thanks for signing up! We&apos;ll be in touch to set up your AI School session.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border-0 bg-white px-5 py-4 text-brand-ink shadow-sm transition placeholder:text-brand-text/45 outline-none focus:ring-2 focus:ring-brand-periwinkle/40";

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-brand-light p-6 md:p-8">
      <div className="grid gap-4">
        <input name="firstName" required placeholder="First Name*" className={inputCls} />
        <input name="lastName" required placeholder="Last Name*" className={inputCls} />
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-text/40"
          >
            <path
              d="M2.5 5.5A1.5 1.5 0 014 4h12a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-9z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path d="M3 5.5l7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            name="email"
            type="email"
            required
            placeholder="Email*"
            className={`${inputCls} pl-12`}
          />
        </div>

        <fieldset className="mt-2">
          <legend className="mb-3 font-display font-bold text-brand-ink">
            Your knowledge and experience using AI tools:
          </legend>
          <div className="grid gap-3">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="experienceLevel"
                  value={opt.value}
                  className="h-5 w-5 accent-brand-periwinkle"
                />
                <span className="text-brand-text/85">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-2">
          <p className="mb-3 font-display font-bold text-brand-ink">Any other details you want to share:</p>
          <textarea
            name="message"
            rows={4}
            placeholder="Your Message"
            className={`${inputCls} resize-y`}
          />
        </div>

        <label className="mt-2 flex cursor-pointer items-start gap-3 text-sm text-brand-text/80">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-5 w-5 shrink-0 rounded accent-brand-periwinkle"
          />
          <span>
            I agree to the terms &amp; conditions provided by the company. By providing my email, I
            agree to receive offers and invites from brandbizkit and AI Advantage101.
          </span>
        </label>

        <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-3 w-full">
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>

        {status === "error" && (
          <p className="text-center text-sm text-brand-accent">{errorMsg}</p>
        )}

        <p className="text-center text-sm">
          <Link href="/terms-and-conditions" className="text-brand-periwinkle underline underline-offset-2 hover:text-brand-periwinkle-dark">
            Terms &amp; Conditions
          </Link>
          <span className="mx-2 text-brand-text/40">|</span>
          <Link href="/privacy-policy" className="text-brand-periwinkle underline underline-offset-2 hover:text-brand-periwinkle-dark">
            Privacy Policy
          </Link>
        </p>
      </div>
    </form>
  );
}
