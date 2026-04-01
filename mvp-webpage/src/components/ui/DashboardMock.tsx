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
              Search classification history, confidence logs, or recent sorting events...
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] bg-plastic/10 p-4">
                <p className="text-sm text-[#27292b]">Plastic count</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                  {isLoading ? "..." : formatCount(counts.plastic)}
                </p>
                <p className="mt-2 text-sm text-plastic">
                  {counts.plastic > 0 ? "Live total" : "Awaiting detections"}
                </p>
              </div>
              <div className="rounded-[22px] bg-paper/10 p-4">
                <p className="text-sm text-[#27292b]">Paper count</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                  {isLoading ? "..." : formatCount(counts.paper)}
                </p>
                <p className="mt-2 text-sm text-paper">
                  {counts.paper > 0 ? "Live total" : "Awaiting detections"}
                </p>
              </div>
              <div className="rounded-[22px] bg-garbage/10 p-4">
                <p className="text-sm text-[#27292b]">Garbage count</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">
                  {isLoading ? "..." : formatCount(counts.garbage)}
                </p>
                <p className="mt-2 text-sm text-garbage">
                  {counts.garbage > 0 ? "Live total" : "Awaiting detections"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-ink">Material history</h4>
                  <span className="text-sm text-[#27292b]">
                    {recentEvents.length > 0 ? "Recent events" : "Waiting for history"}
                  </span>
                </div>
                <div className="mt-5 flex h-36 items-end gap-3">
                  {historyBars.map((bar) => (
                    <div
                      key={bar.id}
                      className={`flex-1 rounded-t-[14px] ${bar.tone}`}
                      style={{ height: bar.height }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-ink">Latest event</h4>
                  <span className="text-sm text-[#27292b]">Confidence</span>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-[#27292b]">Detected material</p>
                  <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-ink">
                    {latestEvent?.materialLabel ?? "Plastic"}
                  </p>
                  <div className="mt-4 h-2 rounded-full bg-slate-200">
                    <div
                      className={`h-2 rounded-full ${
                        latestEvent?.materialKey === "paper"
                          ? "bg-paper"
                          : latestEvent?.materialKey === "garbage"
                            ? "bg-garbage"
                            : "bg-plastic"
                      }`}
                      style={{ width: `${latestConfidenceWidth}%` }}
                    />
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      latestEvent?.materialKey === "paper"
                        ? "text-paper"
                        : latestEvent?.materialKey === "garbage"
                          ? "text-garbage"
                          : "text-plastic"
                    }`}
                  >
                    {latestEvent?.confidenceLabel ?? "Waiting for confidence"}
                  </p>
                </div>
                <div className="mt-4 space-y-3 text-sm text-[#27292b]">
                  <div className="flex items-center justify-between">
                    <span>Route path</span>
                    <span className="font-semibold text-ink">
                      {latestEvent?.routePath ?? "Not available"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Processing time</span>
                    <span className="font-semibold text-ink">
                      {latestEvent?.processingTime ?? "Auto"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System state</span>
                    <span className="font-semibold text-garbage">{latestEvent?.systemState ?? "Stable"}</span>
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
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-soft">
              <p className="text-sm text-[#27292b]">Tracked events</p>
              <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink">
                {isLoading ? "..." : formatCount(counts.total)}
              </p>
              <p className="mt-2 text-sm text-[#27292b]">Live total across plastic, paper, and garbage streams.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-soft">
              <p className="text-sm text-[#27292b]">Average confidence</p>
              <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink">
                {averageConfidence === null ? (isLoading ? "..." : "--") : `${averageConfidence}%`}
              </p>
              <p className="mt-2 text-sm text-[#27292b]">Calculated from the most recent classification history.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-soft">
              <p className="text-sm text-[#27292b]">Tracked signals</p>
              <div className="mt-4 space-y-3 text-sm text-[#27292b]">
                {trackedSignals.map((signal) => (
                  <div key={signal.label} className="flex items-center justify-between">
                    <span>{signal.label}</span>
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
