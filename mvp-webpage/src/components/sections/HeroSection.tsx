import { motion, type MotionValue } from "framer-motion";
import { fadeUp } from "../../lib/motion";
import ProductHeroMedia from "../ui/ProductHeroMedia";
import StatPill from "../ui/StatPill";

type HeroSectionProps = {
  heroOpacity: MotionValue<number>;
  heroYOffset: MotionValue<number>;
};

function HeroSection({ heroOpacity, heroYOffset }: HeroSectionProps) {
  return (
    <section className="section-shell grid gap-14 pb-20 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-20">
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        style={{ y: heroYOffset, opacity: heroOpacity }}
      >
        <span className="eyebrow">AI Waste Sorting System</span>
        <h1 className="mt-6 max-w-[11ch] text-5xl font-extrabold leading-[0.94] tracking-[-0.07em] text-ink md:text-7xl">
          Identify, sort, and track waste automatically.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#27292b]">
          ECOllector detects, classifies, and routes waste in real time.
          Every sorting event is logged to a live dashboard for full system visibility.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#dashboard" className="primary-cta">
            Watch Live Demo
          </a>
          <a href="#solution" className="secondary-cta">
            Explore System
          </a>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#27292b]">
          Built with computer vision and embedded control systems. Prototype tested in real environments.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <StatPill
            label="Capability"
            value="Real-time classification"
            tone="border-plastic/25 bg-white text-plastic"
          />
          <StatPill
            label="Mechanism"
            value="Servo-based routing"
            tone="border-paper/25 bg-white text-paper"
          />
          <StatPill
            label="Visibility"
            value="Live analytics"
            tone="border-garbage/25 bg-white text-garbage"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{ y: heroYOffset }}
      >
        <ProductHeroMedia />
      </motion.div>
    </section>
  );
}

export default HeroSection;
