import { useEffect, useMemo, useState } from "react";
import logoImage from "../../assets/images/logo.png";
import { navItems } from "../../content";

function SiteHeader() {
  const [activeSection, setActiveSection] = useState<string>("top");
  const [isScrolled, setIsScrolled] = useState(false);

  const sectionIds = useMemo(() => navItems.map((item) => item.sectionId), []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      setIsScrolled(window.scrollY > 16);
      let currentSection = "top";

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);
        if (!section) {
          continue;
        }

        if (section.offsetTop <= scrollPosition) {
          currentSection = sectionId;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    const headerHeight = 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.history.replaceState(null, "", `#${targetId}`);
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="section-shell pt-4">
      <div
        className={`flex items-center justify-between gap-4 rounded-full px-6 py-4 transition-all duration-300 ease-out ${
          isScrolled
            ? "border border-slate-200/90 bg-white/88 shadow-[0_18px_42px_rgba(15,23,42,0.10)] backdrop-blur-xl"
            : "border border-slate-200/60 bg-white/62 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <img src={logoImage} alt="ECOllector logo" className="h-full w-full object-contain p-1.5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[-0.03em] text-ink">ECOllector</p>
            <p className="text-xs text-[#27292b]">Smart recycling system</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-[#27292b] md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(event) => handleAnchorClick(event, item.sectionId)}
              className={`transition ${
                activeSection === item.sectionId
                  ? "font-semibold text-ink"
                  : "text-[#27292b] hover:text-ink"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#prototype" className="primary-cta hidden md:inline-flex">
          View Demo
        </a>
      </div>
      </div>
    </header>
  );
}

export default SiteHeader;
