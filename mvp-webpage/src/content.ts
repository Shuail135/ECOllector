export type SolutionCardIcon = "camera" | "ai" | "route" | "chart";
export type FeatureCardIcon = "ai" | "route" | "chart" | "target";
export type WorkflowCardIcon = "camera" | "ai" | "route" | "chart";

export const navItems = [
  { label: "Home", href: "#top", sectionId: "top" },
  { label: "Problem", href: "#problem", sectionId: "problem" },
  { label: "Solution", href: "#solution", sectionId: "solution" },
  { label: "Architecture", href: "#architecture", sectionId: "architecture" },
  { label: "Dashboard", href: "#dashboard", sectionId: "dashboard" },
  { label: "Impact", href: "#impact", sectionId: "impact" },
];

export const problemCards = [
  {
    label: "User decision",
    description:
      "Most disposal decisions happen in seconds, leading to sorting based on assumption instead of material type.",
    icon: "confusion" as const,
  },
  {
    label: "Contamination",
    description:
      "Incorrect sorting contaminates waste streams, reducing recovery quality and increasing downstream processing costs.",
    icon: "error" as const,
  },
  {
    label: "Visibility gap",
    description:
      "Without live tracking, facilities cannot monitor usage patterns, sorting accuracy, or system performance.",
    icon: "data" as const,
  },
];

export const solutionCapabilityCards = [
  {
    step: "01",
    eyebrow: "Detection",
    title: "Detection",
    description:
      "Captures each disposal event in real time and converts it into structured input for the system.",
    tone: "bg-plastic/[0.07]",
    badgeTone: "bg-plastic/10 text-plastic",
    icon: "camera" as SolutionCardIcon,
  },
  {
    step: "02",
    eyebrow: "Classification",
    title: "Classification",
    description:
      "Identifies material type instantly and determines the correct routing decision.",
    tone: "bg-paper/[0.07]",
    badgeTone: "bg-paper/10 text-paper",
    icon: "ai" as SolutionCardIcon,
  },
  {
    step: "03",
    eyebrow: "Actuation",
    title: "Actuation",
    description:
      "Executes sorting automatically through a servo-based mechanical system.",
    tone: "bg-garbage/[0.07]",
    badgeTone: "bg-garbage/10 text-garbage",
    icon: "route" as SolutionCardIcon,
  },
  {
    step: "04",
    eyebrow: "Visibility",
    title: "Visibility",
    description:
      "Logs every event to a live dashboard with insights into volume, accuracy, and usage patterns.",
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
    eyebrow: "Reliable sorting",
    title: "Reliable sorting decisions",
    description:
      "Consistently classifies materials without relying on user judgment.",
    icon: "ai" as FeatureCardIcon,
  },
  {
    eyebrow: "Cleaner streams",
    title: "Reduced contamination at source",
    description:
      "Improves recycling stream quality before waste enters processing systems.",
    icon: "route" as FeatureCardIcon,
  },
  {
    eyebrow: "Live visibility",
    title: "Live operational visibility",
    description:
      "Tracks sorting events and system performance in real time.",
    icon: "chart" as FeatureCardIcon,
  },
  {
    eyebrow: "Verified results",
    title: "Verified classification accuracy",
    description:
      "Logs and validates results across every sorting event.",
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
    title: "Cleaner recycling streams",
    description:
      "Improves material separation at the source, reducing contamination and increasing recovery quality.",
  },
  {
    title: "Consistent sorting decisions",
    description:
      "Removes reliance on user judgment with real-time classification and automated routing.",
  },
  {
    title: "Actionable facility data",
    description:
      "Provides live insights into usage patterns, sorting accuracy, and operational performance.",
  },
];
