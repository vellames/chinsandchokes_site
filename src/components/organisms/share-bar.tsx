"use client";

import { useState } from "react";

/** Our goal is a story people send to a friend: native share sheet first, then direct links. */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelled or blocked: fall back to copying the link.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable: the direct links below still work.
    }
  }

  const link = "kicker border border-line px-3 py-2 text-muted hover:border-lime hover:text-lime";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={share} className="kicker bg-lime px-4 py-2 text-charcoal hover:bg-bone">
        {copied ? "Link copied" : "Send to a friend"}
      </button>
      <a className={link} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}>
        WhatsApp
      </a>
      <a className={link} target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/post?text=${encodedText}&url=${encodedUrl}`}>
        X
      </a>
      <a className={link} target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}>
        Facebook
      </a>
    </div>
  );
}
