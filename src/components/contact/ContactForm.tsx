"use client";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { EMAIL } from "@/lib/socials";

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
      const subject = `${form.name} - ${form.subject}`;
      const body = form.message;
      const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setSubmitted(true);
    },
    [form]
  );

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

      {submitted && (
        <p role="status" className="text-body-md text-secondary">
          Your email app should open with the message ready. If it doesn&apos;t,
          email{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="text-primary underline decoration-border-hairline hover:decoration-primary transition-colors"
          >
            {EMAIL}
          </a>
          . Your text stays here either way.
        </p>
      )}
    </form>
  );
}
