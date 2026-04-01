import { motion } from "framer-motion";
import { problemCards } from "../../content";
import { fadeUp, hoverLift, hoverTransition } from "../../lib/motion";
import { problemCardClass } from "../../lib/uiClasses";
import { ProblemIcon } from "../ui/Icons";

function ProblemSection() {
  return (
    <motion.section
      id="problem"
      className="section-shell scroll-mt-28 pb-20 md:scroll-mt-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
    >
      <div className="grid gap-10 rounded-[36px] border border-slate-200 bg-[linear-gradient(135deg,rgba(15,23,42,0.03),rgba(59,130,246,0.05)_45%,rgba(249,250,251,0.94))] p-8 shadow-soft md:grid-cols-[0.95fr_1.05fr] md:p-10">
        <div>
          <span className="eyebrow">The Problem</span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.06em] text-slate-950 md:text-5xl">
            Recycling fails when sorting depends on{" "}
            <span className="text-slate-950 underline decoration-slate-300 decoration-[3px] underline-offset-[10px]">
              guesswork
            </span>
            .
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#27292b]">
            When disposal depends on user judgment alone, sorting becomes inconsistent
            and facilities lose visibility into what is actually entering the waste stream.
          </p>
        </div>

        <div className="grid gap-5">
          {problemCards.map((card, index) => (
            <motion.div
              key={card.label}
              className={problemCardClass}
              custom={index * 0.08}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              whileHover={hoverLift}
              transition={hoverTransition}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                  <ProblemIcon type={card.icon} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#27292b]">
                    {card.label}
                  </p>
                  <p className="mt-2 text-base leading-8 text-[#27292b]">{card.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default ProblemSection;
