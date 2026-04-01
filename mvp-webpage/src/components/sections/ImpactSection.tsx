import { motion } from "framer-motion";
import { impactItems } from "../../content";
import { fadeUp } from "../../lib/motion";
import SectionIntro from "../ui/SectionIntro";

function ImpactSection() {
  return (
    <section className="section-shell pb-20">
      <SectionIntro
        eyebrow="Impact"
        title="Built for smarter waste management"
        description="The value is practical: cleaner recycling streams, fewer mistakes, and better insight into how waste moves through a space."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {impactItems.map((item, index) => (
          <motion.article
            key={item.title}
            custom={index * 0.08}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -5 }}
            className="panel p-7"
          >
            <h3 className="text-xl font-bold tracking-[-0.04em] text-ink">{item.title}</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default ImpactSection;
