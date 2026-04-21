/**
 * HistoryPanel.jsx
 * Sidebar / modal showing past generated captions fetched from the API.
 */

import { useState, useEffect } from "react";
import { History, Trash2, X, RefreshCw } from "lucide-react";
import { fetchHistory, deleteHistory } from "../utils/api";

const STYLE_COLORS = {
  normal:    "bg-ink/10 text-ink",
  instagram: "bg-amber/20 text-amber-dark",
  funny:     "bg-rust/15 text-rust",
};

export default function HistoryPanel() {
  const [open,    setOpen]    = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setRecords(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-display font-semibold px-4 py-2 rounded-xl border-2 border-ink/15 bg-cream hover:border-amber hover:bg-amber/10 transition-all"
      >
        <History size={16} />
        History
      </button>

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-sm h-full bg-paper shadow-2xl flex flex-col animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-ink/10">
              <h2 className="font-display font-bold text-lg">Caption History</h2>
              <div className="flex gap-2">
                <button onClick={load} className="p-1.5 rounded-lg hover:bg-cream transition-colors">
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-cream transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading && records.length === 0 && (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="shimmer h-20 rounded-xl" />
                  ))}
                </div>
              )}

              {!loading && records.length === 0 && (
                <div className="text-center text-ink/40 font-body mt-16">
                  <History size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No captions generated yet.</p>
                </div>
              )}

              {records.map((r) => (
                <div
                  key={r.id}
                  className="bg-cream rounded-xl p-4 space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${STYLE_COLORS[r.style] ?? "bg-ink/10"}`}>
                      {r.style}
                    </span>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-rust hover:text-rust/70"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed line-clamp-4">{r.caption}</p>
                  <p className="text-xs text-ink/30 font-mono">
                    {r.imageName} · {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
