import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Zidan — open to fullstack roles, collaborations, or just a conversation.",
};

export default function ContactPage() {
  return <ContactContent />;
}
