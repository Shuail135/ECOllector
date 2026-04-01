import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";
import SectionIntro from "../ui/SectionIntro";

const architectureColumns = [
  {
    group: "Sensing",
    textGradient: "bg-[linear-gradient(90deg,#3B82F6_0%,#3B82F6_100%)]",
    nodes: ["Ultrasonic Sensor", "Computer Vision Camera"],
  },
  {
    group: "AI Processing",
    textGradient: "bg-[linear-gradient(90deg,#3B82F6_0%,#F97316_100%)]",
    nodes: ["Raspberry Pi (AI Processing)"],
  },
  {
    group: "Control",
    textGradient: "bg-[linear-gradient(90deg,#F97316_0%,#F97316_100%)]",
    nodes: ["Arduino Controllers"],
  },
  {
    group: "Actuation",
    textGradient: "bg-[linear-gradient(90deg,#F97316_0%,#10B981_100%)]",
    nodes: ["Three-Way Divider (Servo)"],
  },
  {
    group: "Reporting",
    textGradient: "bg-[linear-gradient(90deg,#10B981_0%,#10B981_100%)]",
    nodes: ["Server / Database", "Web Application"],
  },
];

function ArchitectureSection() {
  return (
    <section id="architecture" className="section-shell pb-20">
      <SectionIntro
        eyebrow="System Architecture"
        title="End-to-end system architecture"
        description="From sensing and intelligence to control, actuation, and reporting, ECOllector connects the full sorting pipeline in real time."
      />
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="panel mt-12 overflow-hidden p-6 md:p-8"
      >
        <div className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,250,0.96))] p-5 shadow-soft md:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.10),transparent_22%),radial-gradient(circle_at_45%_16%,rgba(249,115,22,0.08),transparent_20%),radial-gradient(circle_at_80%_22%,rgba(16,185,129,0.09),transparent_22%),radial-gradient(circle_at_52%_80%,rgba(148,163,184,0.08),transparent_26%)]" />
          <div className="relative">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Perception To Action
                </p>
                <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-ink md:text-3xl">
                  One clear path from input to reporting
                </h3>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-right">
                Sensor input, AI processing, hardware control, sorting actuation, and software reporting
                are connected as one continuous product system.
              </p>
            </div>

            <div className="relative mt-8">
              <div className="absolute left-10 right-10 top-10 hidden h-[2px] overflow-hidden rounded-full bg-slate-200/70 xl:block">
                <div className="h-full w-full animate-[architecture-flow_4.6s_ease-in-out_infinite] bg-[linear-gradient(90deg,rgba(59,130,246,0.55),rgba(249,115,22,0.55),rgba(16,185,129,0.55),rgba(148,163,184,0.52))] bg-[length:200%_100%]" />
              </div>
              <div className="grid gap-5 xl:grid-cols-5">
                {architectureColumns.map((column, index) => (
                  <motion.div
                    key={column.group}
                    className="relative"
                    custom={index * 0.12}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {index < architectureColumns.length - 1 ? (
                      <div className="pointer-events-none absolute -right-8 top-[2.28rem] z-10 hidden xl:block">
                        <div className="relative h-3 w-10">
                          <svg viewBox="0 0 32 12" aria-hidden="true" className="absolute inset-0 h-3 w-10 fill-none stroke-slate-700/65">
                            <path d="M1 6h24" strokeWidth="4" strokeLinecap="round" />
                            <path d="M20 2l6 4-6 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(59,130,246,0),rgba(59,130,246,0.55),rgba(249,115,22,0.5),rgba(16,185,129,0))] blur-[1px] animate-[architecture-arrow-flow_2.8s_ease-in-out_infinite]" />
                        </div>
                      </div>
                    ) : null}

                    <div className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white/90 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition duration-300 ease-out hover:border-slate-300 hover:shadow-[0_18px_36px_rgba(15,23,42,0.10)]">
                      <motion.div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.6),transparent_38%),radial-gradient(circle_at_82%_80%,rgba(59,130,246,0.08),transparent_34%)]"
                        animate={{ opacity: [0.05, 0.11, 0.05], scale: [1, 1.03, 1] }}
                        transition={{ duration: 4.2 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className={`relative inline-flex bg-clip-text text-xs font-bold uppercase tracking-[0.2em] text-transparent ${column.textGradient}`}>
                        {column.group}
                      </div>

                      <div className="relative mt-5 grid gap-3">
                        {column.nodes.map((node) => (
                          <div
                            key={node}
                            className="rounded-[18px] border border-slate-200 bg-slate-50/90 px-4 py-5 text-sm font-semibold tracking-[-0.02em] text-ink"
                          >
                            {node}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default ArchitectureSection;
