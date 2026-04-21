/**
 * ImageDropzone.jsx
 * Drag-and-drop upload zone with a click-to-browse fallback.
 */

import { useRef, useState, useCallback } from "react";
import { Upload, ImageIcon } from "lucide-react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ImageDropzone({ onFile, imageURL }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      alert("Please upload a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    onFile(file);
  }, [onFile]);

  /* ── Drag handlers ── */
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  /* ── Click-to-browse ── */
  const onInputChange = (e) => handleFile(e.target.files?.[0]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Image upload zone"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        "relative w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden",
        "min-h-[280px] flex items-center justify-center",
        dragging
          ? "border-amber bg-amber/10 drop-active"
          : imageURL
          ? "border-sage/40 bg-cream/60"
          : "border-ink/20 bg-cream/40 hover:border-amber hover:bg-amber/5",
      ].join(" ")}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={onInputChange}
      />

      {imageURL ? (
        /* ── Preview ── */
        <div className="w-full h-full">
          <img
            src={imageURL}
            alt="Preview"
            className="w-full max-h-[400px] object-contain rounded-2xl"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-ink/40 opacity-0 hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
            <div className="bg-paper/90 text-ink font-display font-semibold px-5 py-2 rounded-xl text-sm">
              Click to change image
            </div>
          </div>
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="flex flex-col items-center gap-4 p-8 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-amber/20 flex items-center justify-center">
            {dragging
              ? <ImageIcon size={32} className="text-amber animate-bounce" />
              : <Upload size={32} className="text-amber" />
            }
          </div>
          <div>
            <p className="font-display font-semibold text-lg text-ink">
              {dragging ? "Drop it!" : "Drop your image here"}
            </p>
            <p className="text-sm text-ink/50 mt-1">
              or <span className="text-amber underline underline-offset-2">browse files</span>
              &nbsp;· JPG, PNG, WEBP, GIF
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
