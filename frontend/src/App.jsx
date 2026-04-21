/**
 * App.jsx  —  Root component for the Image Caption Generator.
 * Orchestrates the upload, style selection, generation, and display flow.
 */

import ImageDropzone  from "./components/ImageDropzone";
import StylePicker    from "./components/StylePicker";
import CaptionBox     from "./components/CaptionBox";
import HistoryPanel   from "./components/HistoryPanel";
import { useCaption } from "./hooks/useCaption";
import { Sparkles, Zap, RotateCcw } from "lucide-react";

export default function App() {
  const {
    imageURL, style, setStyle,
    caption, loading, error,
    selectImage, generate, reset,
  } = useCaption();

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-sm border-b border-ink/8">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
              <Sparkles size={18} className="text-ink" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Caption Lab</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <HistoryPanel />
            {imageURL && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm font-display font-semibold px-4 py-2 rounded-xl border-2 border-ink/15 bg-cream hover:border-rust hover:text-rust transition-all"
              >
                <RotateCcw size={15} />
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* Hero tagline */}
        <div className="mb-10 space-y-1">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight">
            Drop an image. <br />
            <span className="text-amber">Get a caption.</span>
          </h1>
          <p className="text-ink/50 text-base font-body">
            Powered by ViT-GPT2 · Three caption styles · Instant copy & download
          </p>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left — upload */}
          <section className="space-y-5">
            <label className="block text-xs font-mono font-medium text-ink/40 uppercase tracking-widest">
              01 / Upload Image
            </label>
            <ImageDropzone onFile={selectImage} imageURL={imageURL} />
          </section>

          {/* Right — controls + output */}
          <section className="space-y-6">
            {/* Step 2 — Pick style */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-medium text-ink/40 uppercase tracking-widest">
                02 / Caption Style
              </label>
              <StylePicker value={style} onChange={setStyle} />
            </div>

            {/* Step 3 — Generate */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-medium text-ink/40 uppercase tracking-widest">
                03 / Generate
              </label>
              <button
                onClick={() => generate()}
                disabled={!imageURL || loading}
                className={[
                  "w-full flex items-center justify-center gap-2",
                  "px-6 py-3.5 rounded-xl font-display font-bold text-base",
                  "transition-all duration-200 shadow-md",
                  !imageURL || loading
                    ? "bg-ink/20 text-ink/40 cursor-not-allowed"
                    : "bg-ink text-paper hover:bg-amber hover:text-ink hover:shadow-lg active:scale-[0.98]",
                ].join(" ")}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyzing image…
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Generate Caption
                  </>
                )}
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-rust/10 border border-rust/30 text-rust rounded-xl p-4 text-sm font-body animate-fade-up">
                ⚠️ {error}
              </div>
            )}

            {/* Caption output */}
            <CaptionBox
              caption={caption}
              loading={loading}
              onRegenerate={() => generate()}
            />
          </section>
        </div>

        {/* Feature chips */}
        <div className="mt-14 flex flex-wrap gap-2">
          {[
            "✍️ Normal captions",
            "📸 Instagram style",
            "😂 Funny captions",
            "📋 Copy to clipboard",
            "💾 Download .txt",
            "🗂️ Caption history",
          ].map((f) => (
            <span
              key={f}
              className="text-xs font-mono px-3 py-1.5 rounded-full bg-cream border border-ink/10 text-ink/60"
            >
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-ink/8 py-5 text-center text-xs font-mono text-ink/30">
        Caption Lab · Built with React + Flask + ViT-GPT2
      </footer>
    </div>
  );
}
