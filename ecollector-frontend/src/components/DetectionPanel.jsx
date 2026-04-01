import React from "react";
import { motion } from "motion/react";

const COLOR_BY_LABEL = {
    garbage: {
        dot: "bg-[#10B981]",
        chip: "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857] dark:border-[#10B981]/20 dark:bg-[#10B981]/16 dark:text-[#A7F3D0]",
        bar: "bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669]",
        glow: "from-[#10B981]/16 via-[#10B981]/8 to-transparent"
    },
    paper: {
        dot: "bg-[#F59E0B]",
        chip: "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#B45309] dark:border-[#F59E0B]/20 dark:bg-[#F59E0B]/16 dark:text-[#FDE68A]",
        bar: "bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706]",
        glow: "from-[#F59E0B]/16 via-[#F59E0B]/8 to-transparent"
    },
    plastic: {
        dot: "bg-[#3B82F6]",
        chip: "border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#1D4ED8] dark:border-[#3B82F6]/20 dark:bg-[#3B82F6]/16 dark:text-[#BFDBFE]",
        bar: "bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#2563EB]",
        glow: "from-[#3B82F6]/16 via-[#3B82F6]/8 to-transparent"
    }
};

const DEFAULT_COLORS = {
    dot: "bg-[#4F46E5]",
    chip: "border-[#4F46E5]/15 bg-[#4F46E5]/8 text-[#4338CA] dark:border-[#4F46E5]/16 dark:bg-[#4F46E5]/14 dark:text-[#C7D2FE]",
    bar: "bg-gradient-to-r from-[#818CF8] via-[#4F46E5] to-[#4338CA]",
    glow: "from-[#4F46E5]/16 via-[#4F46E5]/8 to-transparent"
};

function formatDateTime(ts) {
    if (ts == null) return "";
    const d = ts instanceof Date ? ts : new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    const date = d.toLocaleDateString("en-GB");
    const time = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
    return `${date} ${time}`;
}

export default function DetectionPanel({ current = null }) {
    const label = current?.label ?? null;
    const confidence = Number.isFinite(current?.confidence) ? current.confidence : 0;
    const tsVal = current?.ts ?? current?.timestamp ?? null;
    const whenFormatted = formatDateTime(tsVal);
    const colors = COLOR_BY_LABEL[label] ?? DEFAULT_COLORS;

    return (
        <motion.div
            className="panel-surface panel-surface-primary flex h-full flex-col p-7 md:p-8"
            whileHover={{ y: -4, boxShadow: "0 28px 52px rgba(15, 23, 42, 0.12)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
        >
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-br ${colors.glow}`} />

            <div className="relative flex h-full flex-col">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <span className="section-kicker">Latest Detection</span>
                    <h2 className="ui-heading mt-4 text-3xl">
                        {label ? label[0].toUpperCase() + label.slice(1) : "Awaiting signal"}
                    </h2>
                    <p className="ui-subtitle mt-2 max-w-xl text-sm leading-6">
                        The most recent classification received from the live detection feed.
                    </p>
                </div>

                <motion.div
                    className="dashboard-pill self-start"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                >
                    <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <p className="ui-meta text-[0.68rem] uppercase tracking-[0.18em]">
                            Updated
                        </p>
                        <p className="ui-value text-sm tabular-nums">{whenFormatted || "No timestamp"}</p>
                    </div>
                </motion.div>
            </div>

            <div className="relative grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
                <motion.div
                    className="subtle-surface flex h-full flex-col rounded-[1.4rem] p-5"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${colors.chip}`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                            {label ? label[0].toUpperCase() + label.slice(1) : "No label"}
                        </span>
                        <span className="subtle-surface rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] ui-label">
                            Live classification
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="subtle-surface rounded-[1.2rem] p-4">
                            <p className="ui-label text-xs uppercase tracking-[0.18em]">
                                Confidence
                            </p>
                            <p className="ui-value mt-3 text-4xl tracking-[-0.04em]">
                                {confidence}%
                            </p>
                        </div>
                        <div className="subtle-surface rounded-[1.2rem] p-4">
                            <p className="ui-label text-xs uppercase tracking-[0.18em]">
                                Detection time
                            </p>
                            <p className="ui-value mt-3 text-lg">
                                {whenFormatted || "Unavailable"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto pt-5">
                        <div className="subtle-surface rounded-[1.2rem] p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="ui-meta text-[0.68rem] uppercase tracking-[0.18em]">
                                        Detection Summary
                                    </p>
                                    <p className="ui-subtitle mt-2 text-sm leading-6">
                                        The system is currently classifying incoming material as{" "}
                                        <span className="ui-value">
                                            {label ? label[0].toUpperCase() + label.slice(1) : "unavailable"}
                                        </span>
                                        {" "}with the latest recorded certainty shown above.
                                    </p>
                                </div>
                                <span className={`hidden h-10 w-10 shrink-0 rounded-2xl sm:inline-flex ${colors.dot} opacity-90`} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="subtle-surface flex h-full flex-col rounded-[1.4rem] p-5"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="ui-label text-xs uppercase tracking-[0.18em]">
                                Confidence Meter
                            </p>
                            <p className="ui-value mt-2 text-base">
                                Model certainty
                            </p>
                        </div>
                        <span className="subtle-surface ui-value rounded-full px-3 py-1 text-sm">
                            {confidence}%
                        </span>
                    </div>

                    <div className="mt-8">
                        <div className="soft-progress h-4">
                            <motion.span
                                className={`${colors.bar} transition-all duration-500`}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(confidence, 100)}%` }}
                                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                        <div className="ui-label mt-3 flex items-center justify-between text-xs uppercase tracking-[0.16em]">
                            <span>0%</span>
                            <span>Reliable</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
                        <div className="subtle-surface rounded-[1.15rem] p-4">
                            <p className="ui-label text-xs uppercase tracking-[0.16em]">
                                Feed
                            </p>
                            <p className="ui-value mt-2 text-sm">
                                Realtime
                            </p>
                        </div>
                        <div className="subtle-surface rounded-[1.15rem] p-4">
                            <p className="ui-label text-xs uppercase tracking-[0.16em]">
                                Status
                            </p>
                            <p className="ui-value mt-2 text-sm">
                                {label ? "Classified" : "Waiting"}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
            </div>
        </motion.div>
    );
}
