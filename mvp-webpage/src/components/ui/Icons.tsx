import type { FeatureCardIcon, SolutionCardIcon, WorkflowCardIcon } from "../../content";

export function ProblemIcon({ type }: { type: "error" | "confusion" | "data" }) {
  if (type === "error") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
        <path d="M12 3l9 16H3L12 3z" strokeWidth="1.7" />
        <path d="M12 9v4.5" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1" className="fill-current stroke-none" />
      </svg>
    );
  }

  if (type === "confusion") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
        <path d="M9.5 9a2.5 2.5 0 115 0c0 1.8-2.5 2.2-2.5 4" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1" className="fill-current stroke-none" />
        <circle cx="12" cy="12" r="9" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <path d="M5 17V9" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 17V5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M19 17v-6" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 19h18" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function SolutionIcon({ type }: { type: SolutionCardIcon }) {
  if (type === "camera") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
        <path d="M5 8.5h14a2 2 0 012 2V17a2 2 0 01-2 2H5a2 2 0 01-2-2v-6.5a2 2 0 012-2z" strokeWidth="1.7" />
        <path d="M8 8.5l1.4-2h5.2l1.4 2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.2" strokeWidth="1.7" />
      </svg>
    );
  }

  if (type === "ai") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
        <rect x="5" y="5" width="14" height="14" rx="4" strokeWidth="1.7" />
        <path d="M9 10.5h6M9 13.5h3.5" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "route") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
        <path d="M6 6h5a3 3 0 013 3v9" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M14 18l-2-2M14 18l2-2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="6" r="2" strokeWidth="1.7" />
        <circle cx="18" cy="8" r="2" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
      <path d="M5 18V9" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 18V5" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M19 18v-6" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3 20h18" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function WorkflowIcon({ type }: { type: WorkflowCardIcon }) {
  return <SolutionIcon type={type} />;
}

export function FeatureIcon({ type }: { type: FeatureCardIcon }) {
  if (type === "target") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current">
        <circle cx="12" cy="12" r="7.5" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.5" strokeWidth="1.7" />
        <path d="M12 12l5-5" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return <SolutionIcon type={type} />;
}
