import { motion } from "framer-motion";
import { hoverLift, hoverTransition } from "../../lib/motion";

type StatPillProps = {
  label: string;
  value: string;
  tone: string;
};

function StatPill({ label, value, tone }: StatPillProps) {
  return (
    <motion.div
      whileHover={hoverLift}
      transition={hoverTransition}
      className={`rounded-full border px-4 py-3 shadow-soft transition duration-300 ease-out will-change-transform hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)] ${tone}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </motion.div>
  );
}

export default StatPill;
