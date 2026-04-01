function DashboardMock() {
  return (
    <div className="panel relative overflow-hidden p-5 md:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_28%)]" />
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Live dashboard
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-ink">
                  ECOllector telemetry
                </h3>
              </div>
              <div className="rounded-full bg-garbage/10 px-4 py-2 text-sm font-semibold text-garbage">
                System online
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
              Search classification history, confidence logs, or recent sorting events...
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] bg-plastic/10 p-4">
                <p className="text-sm text-slate-600">Plastic count</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">1,284</p>
                <p className="mt-2 text-sm text-plastic">+12.8% today</p>
              </div>
              <div className="rounded-[22px] bg-paper/10 p-4">
                <p className="text-sm text-slate-600">Paper count</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">936</p>
                <p className="mt-2 text-sm text-paper">Balanced intake</p>
              </div>
              <div className="rounded-[22px] bg-garbage/10 p-4">
                <p className="text-sm text-slate-600">Garbage count</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">514</p>
                <p className="mt-2 text-sm text-garbage">Below threshold</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-ink">Material history</h4>
                  <span className="text-sm text-slate-500">Last 7 hours</span>
                </div>
                <div className="mt-5 flex h-36 items-end gap-3">
                  {["55%", "70%", "64%", "78%", "82%", "72%", "88%"].map((height, index) => (
                    <div
                      key={height}
                      className={`flex-1 rounded-t-[14px] ${
                        index % 3 === 0 ? "bg-plastic" : index % 3 === 1 ? "bg-paper" : "bg-garbage"
                      }`}
                      style={{ height }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-ink">Latest event</h4>
                  <span className="text-sm text-slate-500">Confidence</span>
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Detected material</p>
                  <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-ink">Plastic bottle</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-200">
                    <div className="h-2 w-[91%] rounded-full bg-plastic" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-plastic">91% confidence</p>
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Route path</span>
                    <span className="font-semibold text-ink">Servo lane A</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Processing time</span>
                    <span className="font-semibold text-ink">0.8s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System state</span>
                    <span className="font-semibold text-garbage">Stable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-soft">
              <p className="text-sm text-slate-500">Daily diversion rate</p>
              <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink">82%</p>
              <p className="mt-2 text-sm text-slate-600">More recyclable waste captured before contamination.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-soft">
              <p className="text-sm text-slate-500">Error reduction</p>
              <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-ink">3.1x</p>
              <p className="mt-2 text-sm text-slate-600">Consistent routing versus manual user sorting decisions.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-soft">
              <p className="text-sm text-slate-500">Tracked signals</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Material counts</span>
                  <span className="font-semibold text-ink">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Confidence scores</span>
                  <span className="font-semibold text-ink">Per event</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>History logs</span>
                  <span className="font-semibold text-ink">Persistent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMock;
