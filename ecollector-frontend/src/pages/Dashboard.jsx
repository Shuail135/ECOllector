import React, { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";
import { motion } from "motion/react";

import TopBar from "../components/TopBar.jsx";
import DetectionPanel from "../components/DetectionPanel.jsx";
import TotalsPanel from "../components/TotalsPanel.jsx";
import HistoryList from "../components/HistoryList.jsx";
import { TIME_WINDOWS } from "../lib/timeRanges";
import { db } from "../lib/firebase.js";

const sectionTransition = {
    duration: 0.42,
    ease: [0.22, 1, 0.36, 1]
};

const sectionVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { ...sectionTransition, delay }
    })
};

export default function Dashboard({ dark, toggleDark }) {
    const [history, setHistory] = useState([]);
    const [current, setCurrent] = useState(null);

    const [rangeKey, setRangeKey] = useState("24h");

    useEffect(() => {
        // current detection
        const currentRef = ref(db, "detections/current");
        const unsubCurrent = onValue(
            currentRef,
            (snap) => {
                const v = snap.val();
                if (!v) return setCurrent(null);
                setCurrent({ ts: v.timestamp, label: v.type, confidence: v.confidence });
            },
            (err) => {
                console.error("CURRENT onValue error:", err);
            }
        );

        // history list
        const historyRef = ref(db, "detections/history");
        const unsubHistory = onValue(
            historyRef,
            (snap) => {
                const obj = snap.val() || {};
                const arr = Object.values(obj)
                    .map((v) => ({ ts: v.timestamp, label: v.type, confidence: v.confidence }))
                    .sort((a, b) => b.ts - a.ts);
                setHistory(arr);
            },
            (err) => {
                console.error("HISTORY onValue error:", err);
            }
        );

        return () => {
            unsubCurrent();
            unsubHistory();
        };
    }, []);

    // Compute totals and percentages for the selected range
    const { totals, pct } = useMemo(() => {
        const win = TIME_WINDOWS.find((w) => w.key === rangeKey) ?? TIME_WINDOWS[0];
        const now = Date.now();

        const filtered = history.filter((item) =>
            win.ms ? item.ts >= now - win.ms : true
        );

        const totalsCalc = { garbage: 0, paper: 0, plastic: 0, all: 0 };
        for (const it of filtered) {
            if (totalsCalc[it.label] != null) totalsCalc[it.label] += 1;
            totalsCalc.all += 1;
        }

        const denom = totalsCalc.all || 1;
        const pctCalc = {
            garbage: Math.round((totalsCalc.garbage / denom) * 100),
            paper: Math.round((totalsCalc.paper / denom) * 100),
            plastic: Math.round((totalsCalc.plastic / denom) * 100),
        };

        return { totals: totalsCalc, pct: pctCalc };
    }, [history, rangeKey]);

    return (
        <>
            <TopBar dark={dark} toggleDark={toggleDark} />
            <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
                <motion.div
                    className="panel-surface mb-8 overflow-hidden px-6 py-7 md:px-7 md:py-8"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    custom={0.05}
                >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(79,70,229,0.12),transparent_24%),radial-gradient(circle_at_78%_20%,rgba(59,130,246,0.08),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.3),rgba(255,255,255,0.04))] dark:bg-[radial-gradient(circle_at_14%_18%,rgba(79,70,229,0.14),transparent_24%),radial-gradient(circle_at_78%_20%,rgba(59,130,246,0.12),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <span className="section-kicker">Live Overview</span>
                            <div className="relative mt-5">
                                <div className="pointer-events-none absolute -left-4 top-1/2 h-20 w-52 -translate-y-1/2 rounded-full bg-[#4F46E5]/16 blur-3xl dark:bg-[#4F46E5]/16" />
                                <h2 className="ui-heading relative text-3xl md:text-4xl">
                                    Recycling operations at a glance
                                </h2>
                            </div>
                            <p className="ui-subtitle mt-5 max-w-2xl text-sm leading-7 md:text-base">
                                Monitor the latest classification, compare material volumes, and review incoming events from a single operational surface.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-stretch gap-3 lg:justify-end">
                            <motion.div
                                className="dashboard-pill min-w-[180px] justify-start"
                                whileHover={{ y: -2, boxShadow: "0 16px 26px rgba(15, 23, 42, 0.08)" }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                                <motion.span
                                    className="h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_0_6px_rgba(16,185,129,0.16)]"
                                    animate={{
                                        scale: [1, 1.18, 1],
                                        opacity: [0.9, 1, 0.9]
                                    }}
                                    transition={{
                                        duration: 2.2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <div className="flex min-w-0 flex-col justify-center">
                                    <p className="ui-meta text-[0.68rem] uppercase tracking-[0.18em]">
                                        Stream Status
                                    </p>
                                    <p className="ui-value text-sm">Connected</p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="dashboard-pill min-w-[180px] justify-start"
                                whileHover={{ y: -2, boxShadow: "0 16px 26px rgba(15, 23, 42, 0.08)" }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                            >
                                <div className="flex min-w-0 flex-col justify-center">
                                <p className="ui-meta text-[0.68rem] uppercase tracking-[0.18em]">
                                    Events Loaded
                                </p>
                                <p className="ui-value text-sm">{history.length}</p>
                            </div>
                        </motion.div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-stretch">
                    <section className="flex h-full flex-col gap-6 xl:col-span-7">
                        <motion.div
                            className="flex-1"
                            initial="hidden"
                            animate="visible"
                            variants={sectionVariants}
                            custom={0.12}
                        >
                            <DetectionPanel current={current} />
                        </motion.div>

                        <motion.div
                            className="flex-1"
                            initial="hidden"
                            animate="visible"
                            variants={sectionVariants}
                            custom={0.18}
                        >
                            <TotalsPanel
                                totals={totals}
                                pct={pct}
                                selectedRangeKey={rangeKey}
                                onChangeRange={setRangeKey}
                            />
                        </motion.div>
                    </section>

                    <aside className="xl:col-span-5">
                        <motion.div
                            className="h-full"
                            initial="hidden"
                            animate="visible"
                            variants={sectionVariants}
                            custom={0.14}
                        >
                            <HistoryList items={history} />
                        </motion.div>
                    </aside>
                </div>
            </main>
        </>
    );


}
