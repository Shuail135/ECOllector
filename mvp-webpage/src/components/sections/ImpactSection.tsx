import { motion } from "framer-motion";
import { impactItems } from "../../content";
import { fadeUp, hoverLift, hoverTransition } from "../../lib/motion";
import SectionIntro from "../ui/SectionIntro";

function ImpactSection() {
  return (
    <section id="impact" className="section-shell pb-20">
      <SectionIntro
        eyebrow="Impact"
        title="Built for smarter waste management"
        description="ECOllector improves sorting accuracy, reduces contamination, and gives facilities real-time control over waste flows."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={hoverLift}
          transition={hoverTransition}
          className="panel bg-white/90 p-5 transition duration-300 ease-out will-change-transform hover:border-slate-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#27292b]">
            Classification accuracy
          </p>
          <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">98%</p>
          <p className="mt-2 text-sm leading-7 text-[#27292b]">Classification accuracy</p>
        </motion.div>
        <motion.div
          custom={0.08}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={hoverLift}
          transition={hoverTransition}
          className="panel bg-white/90 p-5 transition duration-300 ease-out will-change-transform hover:border-slate-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#27292b]">
            Contamination reduction
          </p>
          <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">40%</p>
          <p className="mt-2 text-sm leading-7 text-[#27292b]">Contamination reduction</p>
        </motion.div>
        <motion.div
          custom={0.16}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={hoverLift}
          transition={hoverTransition}
          className="panel bg-white/90 p-5 transition duration-300 ease-out will-change-transform hover:border-slate-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#27292b]">
            System tracking
          </p>
          <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-ink">Real-time</p>
          <p className="mt-2 text-sm leading-7 text-[#27292b]">Real-time system tracking</p>
        </motion.div>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {impactItems.map((item, index) => (
          <motion.article
            key={item.title}
            custom={index * 0.08}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={hoverLift}
            transition={hoverTransition}
            className="panel p-7 transition duration-300 ease-out will-change-transform hover:border-slate-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
          >
            <h3 className="text-xl font-bold tracking-[-0.04em] text-ink">{item.title}</h3>
            <p className="mt-4 text-base leading-8 text-[#27292b]">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default ImpactSection;
