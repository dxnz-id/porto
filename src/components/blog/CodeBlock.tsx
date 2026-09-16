"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  rawText: string;
}

export default function CodeBlock({ children, rawText }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!rawText) return;
    navigator.clipboard.writeText(rawText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={handleCopy}
          className="p-1.5 bg-surface-container-high border border-border-hairline rounded text-secondary hover:text-primary transition-colors shadow-sm"
          title="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="[&>figure>pre]:p-6 [&>figure>pre]:overflow-x-auto [&>figure>pre]:font-mono [&>figure>pre]:text-[13px] [&>figure>pre]:leading-relaxed [&>figure>pre]:rounded-md [&>figure>pre]:border [&>figure>pre]:border-border-hairline [&>figure>pre]:bg-surface-container-low [&>figure]:m-0">
        {children}
      </div>
    </div>
  );
}
