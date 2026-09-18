"use client";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

interface FormState {
  name: string;
  subject: string;
  message: string;
}

const inputClass =
  "w-full bg-transparent border-0 border-b border-border-hairline focus:ring-0 focus:border-primary p-0 py-3 text-body-lg text-primary placeholder:text-tertiary-fixed-dim transition-colors outline-none rounded-none";

const labelClass =
  "text-label-caps text-secondary uppercase tracking-widest";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const to = "dxnzid@icloud.com";
      const subject = `${form.name} - ${form.subject}`;
      const body = form.message;
      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setSubmitted(true);
    },
    [form]
  );

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 py-12">
        <p className="text-headline-lg-mobile text-primary">
          Opening your email client...
        </p>
        <p className="text-body-md text-secondary">
          If it didn&apos;t open, check your email app settings.
        </p>
        <button
          className="text-label-mono text-secondary hover:text-primary transition-colors self-start"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", subject: "", message: "" });
          }}
        >
          Compose another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="What should I call you?"
          className={inputClass}
        />
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={form.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-4 self-start text-label-mono text-primary hover:text-secondary flex items-center gap-2 group transition-colors"
      >
        Send Message{" "}
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform duration-200"
        />
      </button>
    </form>
  );
}
