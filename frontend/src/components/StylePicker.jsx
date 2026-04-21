/**
 * StylePicker.jsx
 * Pill-style selector for caption style (Normal / Instagram / Funny)
 */

const STYLES = [
  { id: "normal",    label: "Normal",    icon: "✍️",  desc: "Clean descriptive caption" },
  { id: "instagram", label: "Instagram", icon: "📸",  desc: "Emojis + hashtags" },
  { id: "funny",     label: "Funny",     icon: "😂",  desc: "Meme-style twist" },
];

export default function StylePicker({ value, onChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {STYLES.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={[
            "group flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200 font-display font-semibold text-sm",
            value === s.id
              ? "border-amber bg-amber text-ink shadow-md"
              : "border-ink/15 bg-cream text-ink/70 hover:border-amber/60 hover:bg-amber/10",
          ].join(" ")}
        >
          <span>{s.icon}</span>
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  );
}
