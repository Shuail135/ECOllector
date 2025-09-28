import React, { useState } from "react";

import { TIME_WINDOWS } from "../lib/timeRanges";

function Stat({ title, value, pct, ring }) {
    return (
        <div className="card p-4 bg-white dark:bg-[#3a3a3a] ring shadow ring-gray-900/5 dark:ring-white/10 rounded-xl">
            <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/10 text-gray-700 dark:text-gray-300">
          {pct}%
        </span>
            </div>
            <div className="mt-3 flex items-end justify-between">
                <div className="text-3xl font-semibold text-gray-900 dark:text-white">{value}</div>
                <div className="relative h-8 w-24">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/5 overflow-hidden">
                        <div className={`h-full ${ring}`} style={{ width: `${pct}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TotalsPanel({ totals, pct, selectedRangeKey, onChangeRange }) {
    const [open, setOpen] = useState(false);
    const current = TIME_WINDOWS.find(w => w.key === selectedRangeKey) ?? TIME_WINDOWS[1];

    return (
        <div className="card p-5 bg-white dark:bg-[#3a3a3a] ring shadow ring-gray-900/5 dark:ring-white/10 rounded-xl relative">
            <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Totals</h2>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen(o => !o)}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/10 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-white/20 transition"
                        aria-haspopup="listbox"
                        aria-expanded={open}
                    >
                        {current.label}
                        <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2f2f2f] shadow-lg z-10" role="listbox">
                            <ul className="py-1">
                                {TIME_WINDOWS.map(w => {
                                    const active = w.key === current.key;
                                    return (
                                        <li key={w.key}>
                                            <button
                                                className={
                                                    "w-full text-left px-3 py-2 text-sm transition " +
                                                    (active ? "bg-blue-600 text-white"
                                                        : "text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10")
                                                }
                                                onClick={() => { onChangeRange(w.key); setOpen(false); }}
                                                role="option"
                                                aria-selected={active}
                                            >
                                                {w.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Stat title="Garbage" value={totals.garbage} pct={pct.garbage} ring="bg-red-400" />
                <Stat title="Paper" value={totals.paper} pct={pct.paper} ring="bg-amber-400" />
                <Stat title="Plastic"   value={totals.plastic}   pct={pct.plastic}   ring="bg-blue-400" />
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                TEMP totals — filtered by the selected time range.
            </p>
        </div>
    );
}
