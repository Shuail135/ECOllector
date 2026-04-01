import { navItems } from "../../content";

function SiteHeader() {
  return (
    <header className="section-shell pt-6">
      <div className="panel flex items-center justify-between gap-4 rounded-full px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-lg font-bold text-white">
            E
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[-0.03em] text-ink">ECOllector</p>
            <p className="text-xs text-slate-500">Smart recycling system</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="transition hover:text-ink">
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#dashboard" className="secondary-cta hidden md:inline-flex">
          View Demo
        </a>
      </div>
    </header>
  );
}

export default SiteHeader;
