export type SolutionCardIcon = "camera" | "ai" | "route" | "chart";
export type FeatureCardIcon = "ai" | "route" | "chart" | "target";
export type WorkflowCardIcon = "camera" | "ai" | "route" | "chart";

export const navItems = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Architecture", href: "#architecture" },
  { label: "Dashboard", href: "#dashboard" },
];

export const problemCards = [
  {
    label: "User decision",
    description:
      "Most disposal decisions happen in seconds, so users often sort by assumption instead of material type.",
    icon: "confusion" as const,
  },
  {
    label: "Contamination",
    description:
      "That guesswork contaminates waste streams, reduces sorting consistency, and lowers recovery quality downstream.",
    icon: "error" as const,
  },
  {
    label: "Visibility gap",
    description:
      "Without live tracking, facilities cannot see usage patterns, sorting accuracy, or disposal behavior in real time.",
    icon: "data" as const,
  },
];

export const solutionCapabilityCards = [
  {
    step: "01",
    eyebrow: "Detection",
    title: "Perception",
    description:
      "Captures each disposal event in real time and turns it into a clean input for the system.",
    tone: "bg-plastic/[0.07]",
    badgeTone: "bg-plastic/10 text-plastic",
    icon: "camera" as SolutionCardIcon,
  },
  {
    step: "02",
    eyebrow: "Classification",
    title: "Decision",
    description:
      "Classifies material instantly and produces the routing decision needed for automated sorting.",
    tone: "bg-paper/[0.07]",
    badgeTone: "bg-paper/10 text-paper",
    icon: "ai" as SolutionCardIcon,
  },
  {
    step: "03",
    eyebrow: "Sorting",
    title: "Actuation",
    description:
      "Executes the correct sorting action automatically through servo-based mechanical routing.",
    tone: "bg-garbage/[0.07]",
    badgeTone: "bg-garbage/10 text-garbage",
    icon: "route" as SolutionCardIcon,
  },
  {
    step: "04",
    eyebrow: "Analytics",
    title: "Visibility",
    description:
      "Logs every event to the dashboard for live visibility into volume, accuracy, and usage patterns.",
    tone: "bg-slate-900/[0.035]",
    badgeTone: "bg-slate-900/5 text-ink",
    icon: "chart" as SolutionCardIcon,
  },
];

export const workflowCards = [
  {
    step: "01",
    stage: "System layer",
    title: "Perception",
    description:
      "Captures each disposal event as structured input for the sorting system.",
    icon: "camera" as WorkflowCardIcon,
  },
  {
    step: "02",
    stage: "System layer",
    title: "Decision",
    description:
      "Interprets material type and produces a routing decision in real time.",
    icon: "ai" as WorkflowCardIcon,
    isRealtime: true,
  },
  {
    step: "03",
    stage: "System layer",
    title: "Actuation",
    description:
      "Executes the sorting action automatically through servo-based routing.",
    icon: "route" as WorkflowCardIcon,
    isRealtime: true,
  },
  {
    step: "04",
    stage: "System layer",
    title: "Visibility",
    description:
      "Logs every event to the dashboard for live operational visibility.",
    icon: "chart" as WorkflowCardIcon,
  },
];

export const featureCards = [
  {
    eyebrow: "Reliability",
    title: "Reliable sorting",
    description:
      "Ensures consistent sorting decisions every time, removing reliance on user judgment.",
    icon: "ai" as FeatureCardIcon,
  },
  {
    eyebrow: "Quality",
    title: "Reduced contamination",
    description:
      "Keeps materials in the correct stream, improving sorting quality at the source.",
    icon: "route" as FeatureCardIcon,
  },
  {
    eyebrow: "Monitoring",
    title: "Real-time visibility",
    description:
      "Tracks every sorting event with live insight into usage, confidence, and behavior.",
    icon: "chart" as FeatureCardIcon,
  },
  {
    eyebrow: "Validation",
    title: "Verified accuracy",
    description:
      "Validates system performance through recorded classification results.",
    icon: "target" as FeatureCardIcon,
  },
];

export const architecture = [
  { label: "Camera", tone: "border-plastic/30 bg-plastic/10 text-plastic" },
  { label: "AI", tone: "border-slate-300 bg-white text-ink" },
  { label: "Controller", tone: "border-slate-300 bg-white text-ink" },
  { label: "Servo Motors", tone: "border-paper/30 bg-paper/10 text-paper" },
  { label: "Dashboard", tone: "border-garbage/30 bg-garbage/10 text-garbage" },
];

export const impactItems = [
  {
    title: "Higher sustainability",
    description: "Better separation improves recovery quality and reduces contamination.",
  },
  {
    title: "Less human error",
    description: "The system standardizes sorting instead of depending on user judgment.",
  },
  {
    title: "Better efficiency",
    description: "Live data exposes volume patterns, usage trends, and operational performance.",
  },
];
