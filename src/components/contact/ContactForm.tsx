"use client";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

interface FormState {
  name: string;
  email: string;
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
    email: "",
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
      console.log("Contact form submitted:", form);
      setSubmitted(true);
    },
    [form]
  );

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 py-12">
        <p className="text-headline-lg-mobile text-primary">
          Message sent. I&apos;ll get back to you soon.
        </p>
        <button
          className="text-label-mono text-secondary hover:text-primary transition-colors self-start"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", subject: "", message: "" });
          }}
        >
          Send another message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 max-w-2xl">
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

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="Where can I reach you?"
          className={inputClass}
        />
      </div>

      {/* Subject (optional) */}
      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelClass}>
          Subject{" "}
          <span className="text-[10px] text-secondary normal-case tracking-normal ml-1">
            optional
          </span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
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
