import { motion } from "framer-motion";
import { fadeUp } from "../../lib/motion";
import SectionIntro from "../ui/SectionIntro";
import DashboardMock from "../ui/DashboardMock";

function DashboardSection() {
  return (
    <motion.section
      id="dashboard"
      className="section-shell pb-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
    >
      <SectionIntro
        eyebrow="Dashboard Preview"
        title="Operational visibility after every sorting event"
        description="The dashboard displays material counts, confidence levels, recent history, and system status in real time."
      />
      <motion.div className="mt-12" variants={fadeUp}>
        <DashboardMock />
      </motion.div>
    </motion.section>
  );
}

export default DashboardSection;
