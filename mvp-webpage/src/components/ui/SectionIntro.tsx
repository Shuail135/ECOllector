import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <motion.div
      className="section-copy"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.45 }}
      variants={fadeUp}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.05em] text-ink md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[#27292b] md:text-lg">{description}</p>
    </motion.div>
  );
}

export default SectionIntro;
