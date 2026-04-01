import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";

const ctaContent = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.08,
        },
    },
};

function FinalCtaSection() {
    const valueBullets = [
        "Live classification tracking",
        "Real-time dashboard insights",
        "End-to-end system visibility",
    ];

    return (
        <section
            id="final-cta"
            className="section-shell scroll-mt-28 pb-20 md:scroll-mt-32"
        >
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                variants={fadeUp}
                className="panel relative overflow-hidden rounded-[36px] px-8 py-14 text-center md:px-14 md:py-20"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 animate-[ambient-gradient-shift_18s_ease-in-out_infinite] bg-[radial-gradient(circle_at_18%_22%,rgba(59,130,246,0.08),transparent_24%),radial-gradient(circle_at_82%_72%,rgba(16,185,129,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] bg-[length:140%_140%]"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-10 bottom-8 top-[42%] rounded-[28px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(248,250,252,0.78),rgba(255,255,255,0.52))] opacity-70 blur-[1px]"
                />

                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),rgba(59,130,246,0))] blur-2xl"
                    animate={{ y: [0, -10, 0], x: [0, -6, 0], scale: [1, 1.06, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                    className="relative z-10"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.45 }}
                    variants={ctaContent}
                >
                    <motion.span className="eyebrow justify-center" variants={fadeUp}>
                        Final CTA
                    </motion.span>

                    <motion.h2
                        className="mx-auto mt-5 max-w-[12ch] text-4xl font-extrabold tracking-[-0.06em] text-ink md:text-6xl"
                        variants={fadeUp}
                    >
                        See your waste system in real time
                    </motion.h2>

                    <motion.p
                        className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#27292b]"
                        variants={fadeUp}
                    >
                        ECOllector connects hardware and software into one continuous system,
                        giving you live visibility into every sorting event.
                    </motion.p>

                    <motion.div
                        className="mx-auto mt-8 grid max-w-3xl gap-3 text-center sm:grid-cols-3"
                        variants={fadeUp}
                    >
                        {valueBullets.map((item, index) => (
                            <motion.div
                                key={item}
                                className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-[#27292b] shadow-soft"
                                variants={fadeUp}
                                custom={0.08 * index}
                                whileHover={{ y: -3, scale: 1.01 }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                            >
                                {item}
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div className="mt-10 flex justify-center" variants={fadeUp}>
                        <motion.a
                            href="https://ecollector-webapp.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Opens live system dashboard"
                            className="primary-cta group gap-2 hover:shadow-[0_20px_48px_rgba(15,23,42,0.28)]"
                            whileHover={{ y: -2, scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span>View Live Dashboard</span>
                            <motion.svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                className="h-4 w-4"
                                animate={{ x: [0, 2, 0], y: [0, -1, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <path
                                    d="M14 5h5v5M10 14l9-9M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </motion.svg>
                        </motion.a>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}

export default FinalCtaSection;