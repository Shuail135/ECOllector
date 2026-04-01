import { motion, useScroll, useTransform } from "framer-motion";
import SiteFooter from "./components/layout/SiteFooter";
import SiteHeader from "./components/layout/SiteHeader";
import ArchitectureSection from "./components/sections/ArchitectureSection";
import DashboardSection from "./components/sections/DashboardSection";
import FeaturesSection from "./components/sections/FeaturesSection";
import FinalCtaSection from "./components/sections/FinalCtaSection";
import HeroSection from "./components/sections/HeroSection";
import ImpactSection from "./components/sections/ImpactSection";
import ProblemSection from "./components/sections/ProblemSection";
import PrototypeSection from "./components/sections/PrototypeSection";
import SolutionSection from "./components/sections/SolutionSection";

function App() {
  const { scrollYProgress } = useScroll();
  const heroYOffset = useTransform(scrollYProgress, [0, 0.2], [0, -36]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0.92]);

  return (
    <div id="top" className="scroll-mt-28 pb-10 pt-28 md:scroll-mt-32 md:pt-32">
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-plastic via-paper to-garbage"
        style={{ scaleX: scrollYProgress }}
      />

      <SiteHeader />

      <main>
        <HeroSection heroOpacity={heroOpacity} heroYOffset={heroYOffset} />
        <PrototypeSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <ArchitectureSection />
        <DashboardSection />
        <ImpactSection />
        <FinalCtaSection />
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
