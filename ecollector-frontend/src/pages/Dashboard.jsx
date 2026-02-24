import React, { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";

import TopBar from "../components/TopBar.jsx";
import DetectionPanel from "../components/DetectionPanel.jsx";
import TotalsPanel from "../components/TotalsPanel.jsx";
import HistoryList from "../components/HistoryList.jsx";
import { TIME_WINDOWS } from "../lib/timeRanges";
import { db } from "../lib/firebase.js";


export default function Dashboard({ dark, toggleDark }) {
    console.log("DASHBOARD RENDERED");
    const [history, setHistory] = useState([]);
    const [current, setCurrent] = useState(null);

    const [rangeKey, setRangeKey] = useState("24h");

    useEffect(() => {
        console.log("DASHBOARD useEffect fired");
        // current detection
        const currentRef = ref(db, "detections/current");
        const unsubCurrent = onValue(
            currentRef,
            (snap) => {
                console.log("CURRENT:", snap.val());
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
                console.log("HISTORY:", snap.val());
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
            <main className="mx-auto max-w-6xl p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <section className="md:col-span-3 space-y-6">
                        {/* Option A: read-only dashboard; no demo analyze */}
                        <DetectionPanel current={current} />

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
