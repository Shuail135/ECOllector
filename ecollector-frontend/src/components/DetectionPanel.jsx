import React from "react";

const COLOR_BY_LABEL = {
    garbage: { dot: "bg-red-500",   chip: "bg-red-100 text-red-700",     bar: "bg-red-500" },
    paper: { dot: "bg-amber-500", chip: "bg-amber-100 text-amber-800", bar: "bg-amber-500" },
    plastic:   { dot: "bg-blue-500",  chip: "bg-blue-100 text-blue-700",   bar: "bg-blue-500" }
};
const DEFAULT_COLORS = { dot: "bg-gray-400", chip: "bg-gray-100 text-gray-700", bar: "bg-emerald-500" };

function formatDateTime(ts) {
    if (ts == null) return "";
    const d = ts instanceof Date ? ts : new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    const date = d.toLocaleDateString("en-GB"); // dd/mm/yyyy
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return `${date} ${time}`;
}

export default function DetectionPanel({ current = null, onAnalyze }) {
    const label = current?.label ?? null;
    const confidence = Number.isFinite(current?.confidence) ? current.confidence : 0;

    // Accept either `ts` (history shape) or `timestamp` (older shape)
    const tsVal = current?.ts ?? current?.timestamp ?? null;
    const whenFormatted = formatDateTime(tsVal);

    const colors = COLOR_BY_LABEL[label] ?? DEFAULT_COLORS;

    return (
        <div className="card p-5 rounded-xl bg-white dark:bg-[#3a3a3a] ring shadow ring-gray-900/5 dark:ring-white/10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Detection</h2>

                <button
                    onClick={onAnalyze}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 px-5 py-2.5 text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 active:translate-y-px transition"
                    aria-label="Analyze (Demo)"
                    title="Analyze (Demo)"
                    type="button"
                >
                    <span>Analyze (Demo)</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${colors.dot}`} />
                    <span className={`px-3 py-1 rounded-full text-sm ${colors.chip}`}>
            {label ? label[0].toUpperCase() + label.slice(1) : "—"}
          </span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
            {whenFormatted}
          </span>
                </div>

                <div className="w-full md:w-1/2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Confidence</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {confidence}%
            </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200/70 dark:bg-white/10 overflow-hidden">
                        <div
                            className={`h-2 rounded-full ${colors.bar} transition-all`}
                            style={{ width: `${Math.min(Number(confidence) || 0, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                TEMP only — values generated locally.
            </p>
        </div>
    );
}
