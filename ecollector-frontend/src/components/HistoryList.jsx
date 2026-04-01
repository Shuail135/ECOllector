import React, { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TIME_WINDOWS } from "../lib/timeRanges";

const PAGE_SIZE = 5;

const ITEM_THEME = {
    garbage: {
        chip: "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857] dark:border-[#10B981]/20 dark:bg-[#10B981]/16 dark:text-[#A7F3D0]",
        dot: "bg-[#10B981]",
        bar: "bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669]"
    },
    paper: {
        chip: "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#B45309] dark:border-[#F59E0B]/20 dark:bg-[#F59E0B]/16 dark:text-[#FDE68A]",
        dot: "bg-[#F59E0B]",
        bar: "bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706]"
    },
    plastic: {
        chip: "border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#1D4ED8] dark:border-[#3B82F6]/20 dark:bg-[#3B82F6]/16 dark:text-[#BFDBFE]",
        dot: "bg-[#3B82F6]",
        bar: "bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#2563EB]"
    },
    default: {
        chip: "border-[#4F46E5]/15 bg-[#4F46E5]/8 text-[#4338CA] dark:border-[#4F46E5]/16 dark:bg-[#4F46E5]/14 dark:text-[#C7D2FE]",
        dot: "bg-[#4F46E5]",
        bar: "bg-gradient-to-r from-[#818CF8] via-[#4F46E5] to-[#4338CA]"
    }
};

function RangeMenu({ rangeKey, open, setOpen, setRangeKey }) {
    return (
        <div className="relative">
            <motion.button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="control-button min-w-[10.5rem] justify-center"
                aria-haspopup="listbox"
                aria-expanded={open}
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
            >
                <span className="ui-label text-xs font-bold uppercase tracking-[0.18em]">
                    Range
                </span>
                <span className="max-w-[4.7rem] whitespace-normal text-center leading-tight">
                    {TIME_WINDOWS.find((w) => w.key === rangeKey)?.label ?? "Last 24 hours"}
                </span>
                <svg className="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="menu-surface absolute right-0 z-10 mt-3 w-52 p-2"
                        role="listbox"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.985 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ul className="space-y-1">
                            {TIME_WINDOWS.map((w) => {
                                const active = w.key === rangeKey;
                                return (
                                    <li key={w.key}>
                                        <motion.button
                                            type="button"
                                            className={
                                                "w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition " +
                                                (active
                                                ? "bg-slate-900 text-white dark:bg-[#4F46E5] dark:text-white"
                                                : "text-[#334155] hover:bg-slate-100 dark:text-[#CBD5F5] dark:hover:bg-slate-800/80")
                                            }
                                            onClick={() => {
                                                setRangeKey(w.key);
                                                setOpen(false);
                                            }}
                                            role="option"
                                            aria-selected={active}
                                            whileHover={{ x: 2 }}
                                            transition={{ duration: 0.14, ease: "easeOut" }}
                                        >
                                            {w.label}
                                        </motion.button>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function HistoryList({ items }) {
    const [rangeKey, setRangeKey] = useState(
        () => localStorage.getItem("historyRange") || "24h"
    );
    const [open, setOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [materialFilter, setMaterialFilter] = useState("all");
    const [sortKey, setSortKey] = useState("time-desc");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const rangeMenuRef = useRef(null);
    const toolsMenuRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("historyRange", rangeKey);
    }, [rangeKey]);

    useEffect(() => {
        if (!open && !toolsOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key !== "Escape") return;
            setOpen(false);
            setToolsOpen(false);
        };

        const handleMouseDown = (event) => {
            if (open && !rangeMenuRef.current?.contains(event.target)) {
                setOpen(false);
            }
            if (toolsOpen && !toolsMenuRef.current?.contains(event.target)) {
                setToolsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleMouseDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleMouseDown);
        };
    }, [open, toolsOpen]);

    const filtered = useMemo(() => {
        const win =
            TIME_WINDOWS.find((w) => w.key === rangeKey) ??
            TIME_WINDOWS.find((w) => w.key === "24h") ??
            TIME_WINDOWS[0];

        const now = Date.now();
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const startTs = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
        const endTs = endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : null;

        return (items || [])
            .filter((it) => {
                const ts = it.ts ?? it.timestamp;
                if (win.ms && ts < now - win.ms) return false;
                if (materialFilter !== "all" && it.label !== materialFilter) return false;
                if (startTs != null && ts < startTs) return false;
                if (endTs != null && ts > endTs) return false;

                if (!normalizedQuery) return true;

                const d = new Date(ts);
                const formatted = `${d.toLocaleDateString("en-GB")} ${d.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })}`.toLowerCase();
                const confidence = String(it.confidence ?? "").toLowerCase();
                const label = String(it.label ?? "").toLowerCase();

                return (
                    label.includes(normalizedQuery) ||
                    formatted.includes(normalizedQuery) ||
                    confidence.includes(normalizedQuery)
                );
            })
            .sort((a, b) => {
                const aTs = a.ts ?? a.timestamp;
                const bTs = b.ts ?? b.timestamp;
                const aConfidence = a.confidence ?? 0;
                const bConfidence = b.confidence ?? 0;

                switch (sortKey) {
                    case "time-asc":
                        return aTs - bTs;
                    case "confidence-desc":
                        return bConfidence - aConfidence || bTs - aTs;
                    case "confidence-asc":
                        return aConfidence - bConfidence || bTs - aTs;
                    case "time-desc":
                    default:
                        return bTs - aTs;
                }
            });
    }, [items, rangeKey, materialFilter, searchQuery, sortKey, startDate, endDate]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [rangeKey, materialFilter, searchQuery, sortKey, startDate, endDate]);

    return (
        <motion.div
            className="panel-surface panel-surface-secondary flex h-full flex-col p-6 md:p-7"
            whileHover={{ y: -3, boxShadow: "0 22px 40px rgba(15, 23, 42, 0.095)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <span className="section-kicker">Activity Feed</span>
                    <h2 className="ui-heading mt-4 text-3xl font-extrabold tracking-[-0.04em]">
                        Recent History
                    </h2>
                    <p className="ui-subtitle mt-2 max-w-xl text-sm leading-6">
                        Review the latest detection events with timestamps, labels, confidence, and paginated browsing.
                    </p>
                </div>

                <div ref={rangeMenuRef}>
                    <RangeMenu
                        rangeKey={rangeKey}
                        open={open}
                        setOpen={setOpen}
                        setRangeKey={setRangeKey}
                    />
                </div>
            </div>

            <div ref={toolsMenuRef} className="relative mt-6">
                <div className="flex items-center justify-between gap-3">
                    <div className="ui-label text-[0.72rem] uppercase tracking-[0.16em]">
                        Interactive feed tools
                    </div>
                    <motion.button
                        type="button"
                        onClick={() => setToolsOpen((value) => !value)}
                        className="control-button px-4 py-2.5"
                        aria-haspopup="dialog"
                        aria-expanded={toolsOpen}
                        whileHover={{ y: -1.5 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                    >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[#4F46E5] dark:border-white/10 dark:bg-slate-800/70 dark:text-[#C7D2FE]">
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M3 5.75A.75.75 0 013.75 5h12.5a.75.75 0 010 1.5h-12.5A.75.75 0 013 5.75zm2.5 4.25a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 015.5 10zm3 4.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" />
                            </svg>
                        </span>
                        Tools
                    </motion.button>
                </div>

                <AnimatePresence>
                    {toolsOpen && (
                        <motion.div
                            className="menu-surface absolute inset-x-0 top-full z-20 mt-3 p-4"
                            role="dialog"
                            initial={{ opacity: 0, y: 8, scale: 0.985 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.985 }}
                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.7fr)]">
                                <label className="flex items-center gap-3 rounded-[1rem] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 dark:border-white/10 dark:bg-slate-800/70">
                                        <svg className="h-4 w-4 ui-meta" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 104.12 9.14l2.62 2.62a.75.75 0 101.06-1.06l-2.62-2.62A5.5 5.5 0 009 3.5zm-4 5.5a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="Search by material, timestamp, or confidence"
                                            className="w-full bg-transparent text-sm text-[#334155] outline-none placeholder:text-[#64748B] dark:text-[#CBD5F5] dark:placeholder:text-[#64748B]"
                                    />
                                </label>

                                <label className="flex items-center gap-3 rounded-[1rem] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 dark:border-white/10 dark:bg-slate-800/70">
                                    <span className="ui-meta text-[0.68rem] uppercase tracking-[0.16em]">
                                        Sort
                                    </span>
                                    <select
                                        value={sortKey}
                                        onChange={(event) => setSortKey(event.target.value)}
                                        className="w-full bg-transparent text-sm font-medium text-[#334155] outline-none dark:text-[#CBD5F5]"
                                    >
                                        <option value="time-desc">Newest first</option>
                                        <option value="time-asc">Oldest first</option>
                                        <option value="confidence-desc">Highest confidence</option>
                                        <option value="confidence-asc">Lowest confidence</option>
                                    </select>
                                </label>
                            </div>

                            <div className="mt-3 flex flex-col gap-3">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: "all", label: "All" },
                                        { key: "garbage", label: "Garbage" },
                                        { key: "paper", label: "Paper" },
                                        { key: "plastic", label: "Plastic" }
                                    ].map((option) => {
                                        const active = materialFilter === option.key;
                                        return (
                                            <button
                                                key={option.key}
                                                type="button"
                                                onClick={() => setMaterialFilter(option.key)}
                                                className={
                                                    "rounded-full border px-3.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition " +
                                                    (active
                                                        ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] dark:border-[#6366F1]/50 dark:bg-[#4F46E5]/18 dark:text-[#C7D2FE]"
                                                        : "border-[#E2E8F0] bg-white text-[#334155] hover:border-[#CBD5E1] hover:text-[#0F172A] dark:border-white/10 dark:bg-slate-800/60 dark:text-[#CBD5F5] dark:hover:bg-slate-800")
                                                }
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <label className="flex items-center gap-2 rounded-[1rem] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 dark:border-white/10 dark:bg-slate-800/70">
                                        <span className="ui-meta text-[0.68rem] uppercase tracking-[0.14em]">
                                            From
                                        </span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(event) => setStartDate(event.target.value)}
                                            className="w-full bg-transparent text-sm text-[#334155] outline-none dark:text-[#CBD5F5]"
                                        />
                                    </label>
                                    <label className="flex items-center gap-2 rounded-[1rem] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 dark:border-white/10 dark:bg-slate-800/70">
                                        <span className="ui-meta text-[0.68rem] uppercase tracking-[0.14em]">
                                            To
                                        </span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(event) => setEndDate(event.target.value)}
                                            className="w-full bg-transparent text-sm text-[#334155] outline-none dark:text-[#CBD5F5]"
                                        />
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.div
                    className="rounded-[1.3rem] border border-white/60 bg-white/70 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-slate-900/45 dark:shadow-none"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                >
                    <p className="ui-label text-xs uppercase tracking-[0.16em]">
                        Visible results
                    </p>
                    <p className="ui-value mt-3 text-3xl tracking-[-0.04em]">
                        {filtered.length}
                    </p>
                </motion.div>
                <motion.div
                    className="rounded-[1.3rem] border border-white/60 bg-white/70 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-slate-900/45 dark:shadow-none"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                >
                    <p className="ui-label text-xs uppercase tracking-[0.16em]">
                        Current page
                    </p>
                    <p className="ui-value mt-3 text-3xl tracking-[-0.04em]">
                        {currentPage}
                    </p>
                </motion.div>
            </div>

            {pageItems.length === 0 ? (
                <motion.div
                    className="ui-subtitle mt-6 flex-1 rounded-[1.5rem] border border-dashed border-slate-300/80 bg-white/55 px-5 py-10 text-center dark:border-white/10 dark:bg-slate-900/40"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                >
                    No detections in this range.
                </motion.div>
            ) : (
                <>
                    <motion.ul className="mt-6 flex-1 space-y-3.5" layout>
                        <AnimatePresence mode="popLayout" initial={false}>
                            {pageItems.map((it, idx) => {
                            const ts = it.ts ?? it.timestamp;
                            const d = new Date(ts);
                            const theme = ITEM_THEME[it.label] ?? ITEM_THEME.default;
                            const formatted = `${d.toLocaleDateString("en-GB")} ${d.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}`;

                            return (
                                <motion.li
                                    key={`${ts}-${idx}`}
                                    className="group rounded-[1.35rem] border border-[#E2E8F0] bg-white/88 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:bg-[#F8FAFC] dark:border-white/10 dark:bg-slate-900/45 dark:hover:bg-slate-800/70 dark:shadow-none"
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{
                                        duration: 0.22,
                                        delay: idx * 0.035,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                    whileHover={{ y: -2, boxShadow: "0 16px 28px rgba(15, 23, 42, 0.06)" }}
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-start sm:gap-4">
                                            <div className="flex min-w-0 items-start gap-3.5">
                                                <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${theme.dot} shadow-[0_0_0_5px_rgba(148,163,184,0.10)]`} />
                                                <div className="min-w-0">
                                                    <p className="ui-meta text-[0.68rem] uppercase tracking-[0.18em]">
                                                        Event timestamp
                                                    </p>
                            <p className="ui-subtitle mt-1.5 truncate text-sm">
                                                        {formatted}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center sm:justify-end">
                                                <span className={`inline-flex rounded-full border px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] ${theme.chip}`}>
                                                    {it.label}
                                                </span>
                                            </div>

                                            <div className="flex items-center sm:justify-end">
                                                <span className="subtle-surface ui-value rounded-full px-3.5 py-1.5 text-sm">
                                                    {it.confidence}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="rounded-[1rem] border border-[#E2E8F0]/80 bg-[#F8FAFC]/90 px-3.5 py-3 dark:border-white/10 dark:bg-slate-900/55">
                                            <div className="ui-meta mb-2.5 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.16em]">
                                                <span>Confidence</span>
                                                <span>{it.confidence}%</span>
                                            </div>
                                            <div className="soft-progress h-2">
                                                <motion.span
                                                    className={theme.bar}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(it.confidence ?? 0, 100)}%` }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: idx * 0.035 + 0.06,
                                                        ease: [0.22, 1, 0.36, 1]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.li>
                            );
                            })}
                        </AnimatePresence>
                    </motion.ul>

                    <motion.div
                        className="mt-5 flex flex-col gap-4 rounded-[1.35rem] border border-white/65 bg-white/72 p-4 text-sm shadow-[0_16px_30px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-slate-900/45 dark:shadow-none sm:flex-row sm:items-center sm:justify-between"
                        layout
                    >
                        <div className="ui-subtitle">
                            Showing {startIdx + 1}-{Math.min(startIdx + PAGE_SIZE, filtered.length)} of{" "}
                            {filtered.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="control-button px-4 py-2 disabled:cursor-not-allowed disabled:opacity-45"
                                whileHover={currentPage <= 1 ? undefined : { y: -1.5 }}
                                whileTap={currentPage <= 1 ? undefined : { scale: 0.985 }}
                                transition={{ duration: 0.16, ease: "easeOut" }}
                            >
                                Prev
                            </motion.button>
                            <motion.span
                                className="subtle-surface ui-value rounded-full px-4 py-2"
                                key={`${currentPage}-${totalPages}`}
                                initial={{ opacity: 0.7, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                                Page {currentPage} / {totalPages}
                            </motion.span>
                            <motion.button
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="control-button px-4 py-2 disabled:cursor-not-allowed disabled:opacity-45"
                                whileHover={currentPage >= totalPages ? undefined : { y: -1.5 }}
                                whileTap={currentPage >= totalPages ? undefined : { scale: 0.985 }}
                                transition={{ duration: 0.16, ease: "easeOut" }}
                            >
                                Next
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}

            <p className="ui-label mt-5 text-xs uppercase tracking-[0.14em]">
                Live history from database.
            </p>
        </motion.div>
    );
}
