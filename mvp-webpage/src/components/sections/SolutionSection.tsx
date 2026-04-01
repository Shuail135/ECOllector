import { motion } from "framer-motion";
import { solutionCapabilityCards } from "../../content";
import { fadeUp } from "../../lib/motion";
import { panelHoverClass } from "../../lib/uiClasses";
import { SolutionIcon } from "../ui/Icons";
import SectionIntro from "../ui/SectionIntro";

function SolutionSection() {
  return (
    <section id="solution" className="section-shell pb-20">
      <SectionIntro
        eyebrow="The Solution"
        title="An intelligent waste-sorting system for real-time sorting"
        description="ECOllector integrates perception, decision-making, actuation, and analytics into a continuous system that detects, sorts, and tracks waste in real time."
      />

      <motion.div
        className="relative mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {solutionCapabilityCards.map((card, index) => (
          <motion.article
            key={card.title}
            custom={index * 0.08}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={`panel relative p-6 ${card.tone} ${panelHoverClass}`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-current/10 ${card.badgeTone}`}>
                <SolutionIcon type={card.icon} />
              </div>
              <div className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${card.badgeTone}`}>
                {card.eyebrow}
              </div>
              <span className="ml-auto text-sm font-extrabold tracking-[-0.03em] text-slate-400">
                {card.step}
              </span>
            </div>
            <h3 className="mt-10 text-xl font-extrabold tracking-[-0.03em] text-ink">{card.title}</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">{card.description}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

export default SolutionSection;
