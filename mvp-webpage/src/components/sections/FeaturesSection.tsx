import { motion } from "framer-motion";
import { featureCards } from "../../content";
import { fadeUp } from "../../lib/motion";
import { iconShellClass, panelHoverClass } from "../../lib/uiClasses";
import { FeatureIcon } from "../ui/Icons";
import SectionIntro from "../ui/SectionIntro";

function FeaturesSection() {
  return (
    <section className="section-shell pb-20">
      <SectionIntro
        eyebrow="Features"
        title="Built for real-time, reliable sorting"
        description="Four core product benefits, designed to improve sorting quality and operational visibility."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((card, index) => (
          <motion.article
            key={card.title}
            custom={index * 0.06}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={`panel p-6 ${panelHoverClass}`}
          >
            <div className={iconShellClass}>
              <FeatureIcon type={card.icon} />
            </div>
            <p className="mt-5 text-sm font-bold tracking-[-0.02em] text-ink">{card.eyebrow}</p>
            <h3 className="mt-3 text-lg font-extrabold tracking-[-0.03em] text-ink">{card.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
