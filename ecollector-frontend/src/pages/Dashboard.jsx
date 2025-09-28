import React, { useMemo, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import DetectionPanel from "../components/DetectionPanel.jsx";
import TotalsPanel from "../components/TotalsPanel.jsx";
import { TIME_WINDOWS } from "../lib/timeRanges";
import HistoryList from "../components/HistoryList.jsx";

const LABELS = ["garbage", "paper", "plastic"];

// Temp: Random rubbish generator
const pickLabel = () => LABELS[Math.floor(Math.random() * LABELS.length)];
const pickConfidence = () => Math.round((0.6 + Math.random() * 0.35) * 100); // 60–95%

export default function Dashboard({ dark, toggleDark }) {
    // TEMP: Send some history so ranges have data
    const [history, setHistory] = useState([
        { ts: Date.now() - 10 * 60 * 1000, label: "garbage", confidence: 92 }, // 10 min ago
        { ts: Date.now() - 2 * 60 * 60 * 1000, label: "paper", confidence: 85 },     // 2 hours ago
        { ts: Date.now() - 5 * 24 * 60 * 60 * 1000, label: "plastic", confidence: 90 }, // 5 days ago
        { ts: Date.now() - 365 * 24 * 60 * 60 * 1000, label: "plastic", confidence: 25 }  // 1 year ago
    ]);

    // Latest detection is always the first item
    const current = history.length > 0 ? history[0] : null;

    // Range selector
    const [rangeKey, setRangeKey] = useState("24h");

    // Simulate a new detection
    const analyzeDemo = () => {
        const item = { ts: Date.now(), label: pickLabel(), confidence: pickConfidence() };
        setHistory(prev => [item, ...prev].slice(0, 500));
    };

    // Compute totals and percentages for the selected range
    const { totals, pct } = useMemo(() => {
        const win = TIME_WINDOWS.find(w => w.key === rangeKey) ?? TIME_WINDOWS[0];
        const now = Date.now();

        const filtered = history.filter(item => (win.ms ? item.ts >= now - win.ms : true));

        const totalsCalc = { garbage: 0, paper: 0, plastic: 0, all: 0 };
        for (const it of filtered) {
            if (totalsCalc[it.label] != null) totalsCalc[it.label] += 1;
            totalsCalc.all += 1;
        }

        const denom = totalsCalc.all || 1;
        const pctCalc = {
            garbage: Math.round((totalsCalc.garbage / denom) * 100),
            paper:   Math.round((totalsCalc.paper   / denom) * 100),
            plastic: Math.round((totalsCalc.plastic / denom) * 100),
        };

        return { totals: totalsCalc, pct: pctCalc };
    }, [history, rangeKey]);

    return (
        <>
            <TopBar dark={dark} toggleDark={toggleDark} />
            <main className="mx-auto max-w-6xl p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <section className="md:col-span-3 space-y-6">
                        <DetectionPanel current={current} onAnalyze={analyzeDemo} />
                        <TotalsPanel
                            totals={totals}
                            pct={pct}
                            selectedRangeKey={rangeKey}
                            onChangeRange={setRangeKey}
                        />
                    </section>

                    <aside className="md:col-span-2">
                        <HistoryList items={history} />
                    </aside>
                </div>
            </main>
        </>
    );
}
