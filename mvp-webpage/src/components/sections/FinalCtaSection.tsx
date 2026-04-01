import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";

function FinalCtaSection() {
  const valueBullets = [
    "Live classification tracking",
    "Real-time dashboard insights",
    "End-to-end system visibility",
  ];

  return (
    <section id="final-cta" className="section-shell scroll-mt-28 pb-20 md:scroll-mt-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={fadeUp}
        className="panel relative overflow-hidden rounded-[36px] px-8 py-14 text-center md:px-14 md:py-20"
      >
        <div className="absolute inset-0 animate-[ambient-gradient-shift_18s_ease-in-out_infinite] bg-[radial-gradient(circle_at_18%_22%,rgba(59,130,246,0.08),transparent_24%),radial-gradient(circle_at_82%_72%,rgba(16,185,129,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] bg-[length:140%_140%]" />
        <div className="absolute inset-x-10 bottom-8 top-[42%] rounded-[28px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(248,250,252,0.78),rgba(255,255,255,0.52))] opacity-70 blur-[1px]" />
        <div className="absolute inset-x-[16%] top-[58%] h-px bg-[linear-gradient(90deg,rgba(59,130,246,0),rgba(59,130,246,0.2),rgba(249,115,22,0.16),rgba(16,185,129,0.2),rgba(16,185,129,0))]" />
        <div className="relative">
        <span className="eyebrow justify-center">Final CTA</span>
        <h2 className="mx-auto mt-5 max-w-[12ch] text-4xl font-extrabold tracking-[-0.06em] text-ink md:text-6xl">
          See your waste system in real time
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#27292b]">
          ECOllector connects hardware and software into one continuous system, giving you live visibility into every sorting event.
        </p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
          {valueBullets.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-[#27292b] shadow-soft"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="https://ecollector-webapp.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            title="Opens live system dashboard"
            className="primary-cta group gap-2 hover:scale-[1.03] hover:shadow-[0_20px_48px_rgba(15,23,42,0.28)]"
          >
            View Live Dashboard
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 transition duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              <path
                d="M14 5h5v5M10 14l9-9M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
        </div>
      </motion.div>
    </section>
  );
}

export default FinalCtaSection;
