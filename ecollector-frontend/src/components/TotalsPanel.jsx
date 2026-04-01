import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TIME_WINDOWS } from "../lib/timeRanges";

function Stat({ title, value, pct, tone, progress }) {
    return (
        <motion.div
                    className={`group rounded-[1.5rem] border p-5 transition-transform duration-200 hover:-translate-y-0.5 ${tone}`}
            whileHover={{ y: -3, boxShadow: "0 22px 34px rgba(15, 23, 42, 0.08)" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="ui-label text-xs uppercase tracking-[0.18em]">
                        Material
                    </p>
                    <h3 className="ui-heading mt-2 text-base">
                        {title}
                    </h3>
                </div>
                <span className="subtle-surface ui-value rounded-full px-3 py-1 text-xs">
                    {pct}%
                </span>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
                <div>
                    <div className="ui-value text-4xl tracking-[-0.04em]">
                        {value}
                    </div>
                    <p className="ui-subtitle mt-2 text-sm">
                        Items in the active range
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <div className="soft-progress h-3.5">
                    <motion.span
                        className={progress}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

function RangeMenu({ current, open, setOpen, onChangeRange }) {
    return (
        <div className="relative">
            <motion.button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="control-button"
                aria-haspopup="listbox"
                aria-expanded={open}
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
            >
                <span className="ui-label text-xs uppercase tracking-[0.18em]">
                    Range
                </span>
                <span>{current.label}</span>
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
                                const active = w.key === current.key;
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
                                                onChangeRange(w.key);
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

export default function TotalsPanel({ totals, pct, selectedRangeKey, onChangeRange }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const safeTotals = totals ?? { garbage: 0, paper: 0, plastic: 0, all: 0 };
    const safePct = pct ?? { garbage: 0, paper: 0, plastic: 0 };

    const current =
        TIME_WINDOWS.find((w) => w.key === selectedRangeKey) ??
        TIME_WINDOWS.find((w) => w.key === "24h") ??
        TIME_WINDOWS[0];

    useEffect(() => {
        if (!open) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        const handleMouseDown = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleMouseDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleMouseDown);
        };
    }, [open]);

    return (
        <motion.div
            className="panel-surface panel-surface-tertiary flex h-full flex-col p-6 md:p-7"
            whileHover={{ y: -2, boxShadow: "0 18px 34px rgba(15, 23, 42, 0.08)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <span className="section-kicker">Distribution</span>
                    <h2 className="ui-heading mt-4 text-3xl font-extrabold tracking-[-0.04em]">
                        Material Distribution
                    </h2>
                    <p className="ui-subtitle mt-2 max-w-xl text-sm leading-6">
                        Compare category volume inside the selected time window and spot shifts in incoming material mix.
                    </p>
                </div>

                <div ref={menuRef}>
                    <RangeMenu
                        current={current}
                        open={open}
                        setOpen={setOpen}
                        onChangeRange={onChangeRange}
                    />
                </div>
            </div>

            <motion.div
                className="mt-6 rounded-[1.65rem] border border-[#E2E8F0] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-6 shadow-[0_18px_34px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.88),rgba(15,23,42,0.88))] dark:shadow-none md:p-7"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                        <p className="ui-meta text-[0.68rem] uppercase tracking-[0.18em]">
                            Active window
                        </p>
                        <div className="mt-3 flex items-end gap-3">
                            <p className="ui-value text-5xl leading-none tracking-[-0.06em] md:text-6xl">
                            {safeTotals.all ?? safeTotals.garbage + safeTotals.paper + safeTotals.plastic}
                            </p>
                            <span className="mb-1 rounded-full border border-[#C7D2FE] bg-[#EEF2FF] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#4F46E5] dark:border-[#4F46E5]/20 dark:bg-[#4F46E5]/14 dark:text-[#C7D2FE]">
                                Total detections
                            </span>
                        </div>
                        <p className="ui-subtitle mt-4 text-sm leading-6">
                            Total detections recorded for {current.label.toLowerCase()}.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[360px]">
                        <div className="rounded-[1.2rem] border border-[#E2E8F0] bg-white/90 px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
                            <p className="ui-meta text-[0.68rem] uppercase tracking-[0.16em]">Garbage</p>
                            <p className="ui-value mt-2 text-xl tracking-[-0.03em]">{safePct.garbage}%</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-[#E2E8F0] bg-white/90 px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
                            <p className="ui-meta text-[0.68rem] uppercase tracking-[0.16em]">Paper</p>
                            <p className="ui-value mt-2 text-xl tracking-[-0.03em]">{safePct.paper}%</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-[#E2E8F0] bg-white/90 px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-none">
                            <p className="ui-meta text-[0.68rem] uppercase tracking-[0.16em]">Plastic</p>
                            <p className="ui-value mt-2 text-xl tracking-[-0.03em]">{safePct.plastic}%</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Stat
                    title="Garbage"
                    value={safeTotals.garbage}
                    pct={safePct.garbage}
                    tone="border-[#10B981]/18 bg-gradient-to-br from-[#ECFDF5] to-[#FFFFFF] dark:border-[#10B981]/15 dark:from-[#10B981]/8 dark:to-white/4"
                    progress="bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669]"
                />
                <Stat
                    title="Paper"
                    value={safeTotals.paper}
                    pct={safePct.paper}
                    tone="border-[#F59E0B]/18 bg-gradient-to-br from-[#FFFBEB] to-[#FFFFFF] dark:border-[#F59E0B]/15 dark:from-[#F59E0B]/8 dark:to-white/4"
                    progress="bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706]"
                />
                <Stat
                    title="Plastic"
                    value={safeTotals.plastic}
                    pct={safePct.plastic}
                    tone="border-[#3B82F6]/18 bg-gradient-to-br from-[#EFF6FF] to-[#FFFFFF] dark:border-[#3B82F6]/15 dark:from-[#3B82F6]/8 dark:to-white/4"
                    progress="bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#2563EB]"
                />
            </div>

            <p className="ui-label mt-auto pt-5 text-xs uppercase tracking-[0.14em]">
                Totals are computed from history within the selected time range.
            </p>
        </motion.div>
    );
}
