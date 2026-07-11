"use client";

import { useState } from "react";

export default function LeadForm({ source }: { source: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
        source,
        pagePath: window.location.pathname,
      }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <p className="card border-brand-periwinkle/30 bg-brand-periwinkle/5 p-8 text-center text-lg font-medium text-brand-ink">
        Thanks! We got your message and will be in touch shortly. 🚀
      </p>
    );
  }

  const inputCls =
    "rounded-xl border border-brand-ink/12 bg-white px-4 py-3 text-brand-ink shadow-sm transition placeholder:text-brand-text/35 outline-none focus:border-brand-periwinkle focus:ring-2 focus:ring-brand-periwinkle/25";

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-brand-text/75">
          Name
          <input name="name" required autoComplete="name" placeholder="Your name" className={inputCls} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-brand-text/75">
          Email
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm font-medium text-brand-text/75">
        Phone <span className="font-normal text-brand-text/45">(optional)</span>
        <input name="phone" type="tel" autoComplete="tel" placeholder="+63 ..." className={inputCls} />
      </label>
      <label className="grid gap-1.5 text-sm font-medium text-brand-text/75">
        Tell us about your business or idea
        <textarea
          name="message"
          rows={4}
          required
          placeholder="What are you building?"
          className={inputCls}
        />
      </label>
      <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Let's Talk"}
      </button>
      {status === "error" && (
        <p className="text-sm text-brand-accent">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
