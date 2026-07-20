"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "@/components/contact/ContactForm";
import AvailabilityInfo from "@/components/contact/AvailabilityInfo";
import SocialLinks from "@/components/contact/SocialLinks";

gsap.registerPlugin(ScrollTrigger);

export default function ContactContent() {
  const formRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const formFields = formRef.current?.querySelectorAll("[data-field] > *");
      const sidebarItems = sidebarRef.current?.children;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 85%",
          once: true,
        },
        defaults: { ease: "power4.out" },
      });

      if (formFields?.length) {
        tl.fromTo(
          formFields,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 },
        );
      }

      if (sidebarItems?.length) {
        tl.fromTo(
          sidebarItems,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
          "-=0.15",
        );
      }
    },
    { scope: formRef },
  );

  return (
    <div className="flex-grow pt-16 md:pt-20 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div
          ref={formRef}
          data-field
          className="md:col-span-8 md:pr-16"
        >
          <ContactForm />
        </div>

        <div
          ref={sidebarRef}
          className="md:col-span-4 mt-16 md:mt-0 flex flex-col gap-16 border-t md:border-t-0 md:border-l border-border-hairline pt-16 md:pt-0 md:pl-16"
        >
          <AvailabilityInfo />
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
