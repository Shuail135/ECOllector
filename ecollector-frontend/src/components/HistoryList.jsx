import React, { useMemo, useState, useEffect } from "react";

import { TIME_WINDOWS } from "../lib/timeRanges";
const PAGE_SIZE = 10;

const chip = (label) =>
    label === "garbage"
        ? "bg-red-100 text-red-700 dark:bg-red-400/20 dark:text-red-300"
        : label === "paper"
            ? "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300"
            : label === "plastic"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300"
                : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";

export default function HistoryList({ items }) {
    const [rangeKey, setRangeKey] = useState(() => localStorage.getItem( "24h")); // default last 24
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);

    // Persist selected range
    useEffect(() => {
        localStorage.setItem("historyRange", rangeKey);
    }, [rangeKey]);

    // Derived, filtered + sorted items
    const filtered = useMemo(() => {
        const win = TIME_WINDOWS.find((w) => w.key === rangeKey) ?? TIME_WINDOWS[1];
        const now = Date.now();
        return (items || [])
            .filter((it) => (win.ms ? (it.ts ?? it.timestamp) >= now - win.ms : true))
            .sort((a, b) => (b.ts ?? b.timestamp) - (a.ts ?? a.timestamp));
    }, [items, rangeKey]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    // Reset page when range changes or list > current page limit
    useEffect(() => {
        setPage(1);
    }, [rangeKey]);

    return (
        <div className="rounded-xl bg-white dark:bg-[#3a3a3a] ring shadow ring-gray-900/5 dark:ring-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Recent History</h2>

                {/* Range dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/10 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-white/20 transition"
                        aria-haspopup="listbox"
                        aria-expanded={open}
                    >
                        {TIME_WINDOWS.find((w) => w.key === rangeKey)?.label ?? "Last 24 hours"}
                        <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    {open && (
                        <div
                            className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2f2f2f] shadow-lg z-10"
                            role="listbox"
                        >
                            <ul className="py-1">
                                {TIME_WINDOWS.map((w) => {
                                    const active = w.key === rangeKey;
                                    return (
                                        <li key={w.key}>
                                            <button
                                                className={
                                                    "w-full text-left px-3 py-2 text-sm transition " +
                                                    (active
                                                        ? "bg-blue-600 text-white"
                                                        : "text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10")
                                                }
                                                onClick={() => {
                                                    setRangeKey(w.key);
                                                    setOpen(false);
                                                }}
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

            {/* List */}
            {pageItems.length === 0 ? (
                <div className="text-gray-600 dark:text-gray-300">No detections in this range.</div>
            ) : (
                <>
                    <ul className="divide-y divide-gray-200/70 dark:divide-white/10">
                        {pageItems.map((it, idx) => {
                            const ts = it.ts ?? it.timestamp;
                            const d = new Date(ts);
                            const formatted = `${d.toLocaleDateString("en-GB")} ${d.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}`;
                            return (
                                <li key={`${ts}-${idx}`} className="py-3 flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-200">{formatted}</div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${chip(it.label)}`}>{it.label}</span>
                                        <span className="text-sm text-gray-700 dark:text-gray-200">{it.confidence}%</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Pagination footer */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="text-gray-600 dark:text-gray-300">
                            Showing {startIdx + 1}-{Math.min(startIdx + PAGE_SIZE, filtered.length)} of {filtered.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="text-gray-700 dark:text-gray-200">
                Page {currentPage} / {totalPages}
              </span>
                            <button
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            <p className="mt-4 text-xs text-gray-600 dark:text-gray-300">
                TEMP history — Refresh will clear it.
            </p>
        </div>
    );
}
