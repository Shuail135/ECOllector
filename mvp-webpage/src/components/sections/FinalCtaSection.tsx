import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";

function FinalCtaSection() {
  return (
    <section className="section-shell pb-16">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeUp}
        className="panel overflow-hidden rounded-[36px] px-8 py-12 text-center md:px-14 md:py-16"
      >
        <div className="absolute inset-0" />
        <span className="eyebrow justify-center">Final CTA</span>
        <h2 className="mx-auto mt-5 max-w-[12ch] text-4xl font-extrabold tracking-[-0.06em] text-ink md:text-6xl">
          Built for smarter waste management
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          ECOllector presents recycling as an intelligent product system, with
          hardware action and software visibility working together.
        </p>
        <div className="mt-8 flex justify-center">
          <a href="#dashboard" className="primary-cta">
            View Live Dashboard
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export default FinalCtaSection;
