import { motion } from "framer-motion";
import { hoverTransition } from "../../lib/motion";
import { useDashboardPreview } from "../../hooks/useDashboardPreview";

function formatCount(value: number) {
  return new Intl.NumberFormat("en-CA").format(value);
}

function DashboardMock() {
  const {
    counts,
    latestEvent,
    recentEvents,
    historyBars,
    averageConfidence,
    lastResetLabel,
    onlineLabel,
    onlineTone,
    trackedSignals,
    isLoading,
    isConfigured,
    sourceLabel,
    lastUpdatedLabel,
    errorLabel,
  } = useDashboardPreview();

  const latestConfidenceWidth = latestEvent?.confidence ?? 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={hoverTransition}
      className="panel relative overflow-hidden p-5 transition duration-300 ease-out will-change-transform hover:shadow-[0_26px_52px_rgba(15,23,42,0.12)] md:p-6"
    >
      <div className="absolute inset-0 animate-[ambient-gradient-shift_14s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_28%)] bg-[length:140%_140%]" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#27292b]">
                  Live dashboard
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-ink">
                  ECOllector telemetry
                </h3>
              </div>
              <div className={`rounded-full px-4 py-2 text-sm font-semibold ${onlineTone}`}>
                {onlineLabel}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-[#27292b]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p>Live system telemetry across classification, routing, and event tracking.</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {sourceLabel === "Firebase live data"
                      ? "LIVE DATA SOURCE"
                      : sourceLabel === "Firebase connected"
                        ? "LIVE DATA SOURCE"
                        : sourceLabel}
                  </p>
                  {(sourceLabel === "Firebase live data" || sourceLabel === "Firebase connected") && !errorLabel ? (
                    <p className="mt-1 text-xs text-slate-500">Connected to real-time system events</p>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">{lastUpdatedLabel}</p>
              {errorLabel ? (
                <p className="mt-3 rounded-xl border border-paper/30 bg-paper/10 px-3 py-2 text-xs text-paper">
                  {errorLabel}
                </p>
              ) : null}
              {!isConfigured ? (
                <p className="mt-3 text-xs text-slate-500">
                  Add your `VITE_FIREBASE_*` values in `mvp-webpage/.env` to replace demo data with live telemetry.
                </p>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] bg-plastic/7 p-4">
                <p className="text-4xl font-extrabold tracking-[-0.05em] text-ink">
                  {isLoading ? "..." : formatCount(counts.plastic)}
                </p>
                <p className="mt-2 text-sm font-medium text-[#27292b]">Plastic</p>
                <p className="mt-1 text-sm text-plastic">events</p>
              </div>
              <div className="rounded-[22px] bg-paper/7 p-4">
                <p className="text-4xl font-extrabold tracking-[-0.05em] text-ink">
                  {isLoading ? "..." : formatCount(counts.paper)}
                </p>
                <p className="mt-2 text-sm font-medium text-[#27292b]">Paper</p>
                <p className="mt-1 text-sm text-paper">events</p>
              </div>
              <div className="rounded-[22px] bg-garbage/7 p-4">
                <p className="text-4xl font-extrabold tracking-[-0.05em] text-ink">
                  {isLoading ? "..." : formatCount(counts.garbage)}
                </p>
                <p className="mt-2 text-sm font-medium text-[#27292b]">Garbage</p>
                <p className="mt-1 text-sm text-garbage">events</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-ink">Recent classification activity</h4>
                  <span className="text-sm text-[#27292b]">
                    {recentEvents.length > 0 ? "Recent events" : "No history available"}
                  </span>
                </div>
                <div className="mt-6 flex h-40 items-end gap-3">
                  {historyBars.map((bar) => (
                    <motion.div
                      key={bar.id}
                      className={`flex-1 rounded-t-[14px] ${bar.tone}`}
                      style={{ height: bar.height }}
                      initial={{ height: 0, opacity: 0.45 }}
                      animate={{ height: bar.height, opacity: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-plastic" />
                    Plastic
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-paper" />
                    Paper
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-garbage" />
                    Garbage
                  </span>
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-ink">Current classification</h4>
                  <span className="text-sm text-[#27292b]">Live confidence</span>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                  <p className="text-3xl font-bold tracking-[-0.04em] text-ink">
                    {latestEvent?.materialLabel ?? "Awaiting event"}
                  </p>
                  <p
                    className={`mt-2 text-base font-semibold ${
                      latestEvent?.materialKey === "paper"
                        ? "text-paper"
                        : latestEvent?.materialKey === "garbage"
                          ? "text-garbage"
                          : "text-plastic"
                    }`}
                  >
                    {latestEvent?.confidenceLabel ?? "No confidence available"}
                  </p>
                  <div className="mt-5 h-2.5 rounded-full bg-slate-200">
                    <motion.div
                      className={`h-2.5 rounded-full ${
                        latestEvent?.materialKey === "paper"
                          ? "bg-paper"
                          : latestEvent?.materialKey === "garbage"
                            ? "bg-garbage"
                            : "bg-plastic"
                      }`}
                      style={{ width: `${latestConfidenceWidth}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${latestConfidenceWidth}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="mt-5 space-y-4 text-sm text-[#27292b]">
                  <div className="flex items-center justify-between">
                    <span>Routing</span>
                    <span className="font-semibold text-ink">
                      {latestEvent?.routePath ?? "Unavailable"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Latency</span>
                    <span className="font-semibold text-ink">
                      {latestEvent?.processingTime ?? "Unavailable"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className="font-semibold text-garbage">
                      {latestEvent?.systemState ?? (onlineLabel === "System online" ? "Active" : "Idle")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Timestamp</span>
                    <span className="font-semibold text-ink">
                      {latestEvent?.timestampLabel ?? "No event yet"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_44px_rgba(15,23,42,0.08)]">
              <p className="text-sm text-[#27292b]">Total events processed</p>
              <p className="mt-3 text-5xl font-extrabold tracking-[-0.06em] text-ink">
                {isLoading ? "..." : formatCount(counts.total)}
              </p>
              <p className="mt-2 text-sm text-[#27292b]">Aggregate event count from the connected recycling stream.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_22px_44px_rgba(15,23,42,0.08)]">
              <p className="text-sm text-[#27292b]">Average classification confidence</p>
              <p className="mt-3 text-5xl font-extrabold tracking-[-0.06em] text-ink">
                {averageConfidence === null ? (isLoading ? "..." : "--") : `${averageConfidence}%`}
              </p>
              <p className="mt-2 text-sm text-[#27292b]">Computed from the most recent entries in the connected event history.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/85 p-5 shadow-soft">
              <p className="text-sm text-[#27292b]">System summary</p>
              <div className="mt-4 space-y-4 text-sm text-[#27292b]">
                {trackedSignals.map((signal) => (
                  <div key={signal.label} className="flex items-center justify-between">
                    <span>
                      {signal.label === "Event volume"
                        ? "Events processed"
                        : signal.label === "Confidence average"
                          ? "Avg. confidence"
                          : signal.label === "History entries"
                            ? "Stored events"
                            : signal.label}
                    </span>
                    <span className="font-semibold text-ink">{signal.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span>Last reset</span>
                  <span className="font-semibold text-ink">{lastResetLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardMock;
