import SectionIntro from "../ui/SectionIntro";
import DashboardMock from "../ui/DashboardMock";

function DashboardSection() {
  return (
    <section id="dashboard" className="section-shell pb-20">
      <SectionIntro
        eyebrow="Dashboard Preview"
        title="Operational visibility after every sorting event"
        description="The dashboard shows material counts, confidence levels, recent history, and system status in a way that feels investor-ready and product-real."
      />
      <div className="mt-12">
        <DashboardMock />
      </div>
    </section>
  );
}

export default DashboardSection;
