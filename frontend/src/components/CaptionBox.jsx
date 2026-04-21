/**
 * CaptionBox.jsx
 * Displays the generated caption with copy / download / regenerate actions.
 */

import { useState } from "react";
import { Copy, Check, RefreshCw, Download } from "lucide-react";

export default function CaptionBox({ caption, loading, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  /* ── Copy to clipboard ── */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback for older browsers */
      const el = document.createElement("textarea");
      el.value = caption;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ── Download as .txt ── */
  const handleDownload = () => {
    const blob = new Blob([caption], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "caption.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Loading shimmer ── */
  if (loading) {
    return (
      <div className="w-full rounded-2xl border-2 border-ink/10 bg-cream p-6 space-y-3 animate-fade-up">
        <div className="flex items-center gap-2 text-amber font-display font-semibold text-sm">
          <div className="w-4 h-4 border-2 border-amber border-t-transparent rounded-full animate-spin" />
          Generating caption…
        </div>
        <div className="shimmer h-4 rounded-lg w-full" />
        <div className="shimmer h-4 rounded-lg w-3/4" />
        <div className="shimmer h-4 rounded-lg w-1/2" />
      </div>
    );
  }

  if (!caption) return null;

  return (
    <div className="w-full rounded-2xl border-2 border-sage/30 bg-cream/60 p-6 animate-fade-up space-y-4">
      {/* Caption text */}
      <p className="font-body text-base leading-relaxed text-ink whitespace-pre-wrap">
        {caption}
      </p>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-ink/10">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className={[
            "flex items-center gap-1.5 text-sm font-display font-semibold px-3 py-1.5 rounded-lg transition-all",
            copied
              ? "bg-sage text-paper"
              : "bg-ink/5 text-ink hover:bg-amber hover:text-ink",
          ].join(" ")}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-sm font-display font-semibold px-3 py-1.5 rounded-lg bg-ink/5 text-ink hover:bg-amber hover:text-ink transition-all"
        >
          <Download size={14} />
          Download
        </button>

        {/* Regenerate */}
        <button
          onClick={onRegenerate}
          className="ml-auto flex items-center gap-1.5 text-sm font-display font-semibold px-3 py-1.5 rounded-lg bg-ink text-paper hover:bg-amber hover:text-ink transition-all"
        >
          <RefreshCw size={14} />
          Regenerate
        </button>
      </div>
    </div>
  );
}
