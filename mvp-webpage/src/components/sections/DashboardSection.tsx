import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";
import SectionIntro from "../ui/SectionIntro";
import DashboardMock from "../ui/DashboardMock";

function DashboardSection() {
  return (
    <motion.section
      id="dashboard"
      className="section-shell scroll-mt-28 pb-20 md:scroll-mt-32"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
    >
      <SectionIntro
        eyebrow="Dashboard Preview"
        title="Real-time operational visibility"
        description="Monitor classification accuracy, system activity, and material flow as it happens."
      />
      <motion.div className="mt-12" variants={fadeUp}>
        <DashboardMock />
      </motion.div>
    </motion.section>
  );
}

export default DashboardSection;
