import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import AvailabilityInfo from "@/components/contact/AvailabilityInfo";
import SocialLinks from "@/components/contact/SocialLinks";
import SectionReveal from "@/components/ui/SectionReveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Zidan — open to fullstack roles, collaborations, or just a conversation.",
};

export default function ContactPage() {
  return (
    <div className="flex-grow pt-16 md:pt-20 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Page header */}
      <header className="mb-16 md:mb-20">
        <p className="text-label-caps text-secondary mb-3">Contact</p>
        <h1 className="text-headline-lg-mobile md:text-headline-xl text-primary mb-4">
          Let&apos;s build something{" "}
          <span className="text-secondary">together.</span>
        </h1>
        <p className="text-body-lg text-secondary max-w-2xl">
          Whether you have a project in mind, want to collaborate, or just want
          to say hi — I&apos;m always open to new conversations.
        </p>
      </header>

      {/* 2-col layout: form (left) + info sidebar (right) */}
      <SectionReveal>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Form — 8 cols */}
          <div className="md:col-span-8 md:pr-16">
            <ContactForm />
          </div>

          {/* Sidebar — 4 cols */}
          <div className="md:col-span-4 mt-16 md:mt-0 flex flex-col gap-16 border-t md:border-t-0 md:border-l border-border-hairline pt-16 md:pt-0 md:pl-16">
            <AvailabilityInfo />
            <SocialLinks />
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
