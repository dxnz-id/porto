"use client";

import { useState, useCallback } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareSectionProps {
  title: string;
  description: string;
}

async function copyToClipboard(text: string): Promise<void> {
  // Modern async Clipboard API
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for older browsers
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0.01;pointer-events:none";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
  } catch {
    // ignored
  }
  document.body.removeChild(ta);
}

export default function ShareSection({
  title,
  description,
}: ShareSectionProps) {
  const [buttonCopied, setButtonCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, text: description, url }).catch(() => {});
      return;
    }
    await copyToClipboard(url);
    showToast("Link copied to clipboard");
  }, [title, description, showToast]);

  const handleCopyLink = useCallback(async () => {
    await copyToClipboard(window.location.href);
    setButtonCopied(true);
    setTimeout(() => setButtonCopied(false), 2000);
    showToast("Link copied to clipboard");
  }, [showToast]);

  return (
    <>
      <hr className="my-12 border-t border-border-hairline" />

      <div className="mt-16 pt-8 border-t border-border-hairline flex justify-between items-center">
        <span className="text-label-caps text-secondary">Share this post</span>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center border border-border-hairline hover:border-primary transition-colors bg-surface text-primary cursor-pointer select-none touch-manipulation"
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 h-10 flex items-center justify-center border border-primary bg-surface hover:bg-surface-container-low transition-colors text-label-mono text-primary gap-2 cursor-pointer select-none touch-manipulation"
          >
            {buttonCopied ? (
              <>
                <Check size={18} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={18} />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast notification */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-primary text-on-primary text-label-mono transition-all duration-300 ${
          toastVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {toastMessage}
      </div>
    </>
  );
}
