import { useEffect, useMemo, useState } from "react";
import { onValue, ref, type DatabaseReference } from "firebase/database";
import { getFirebaseDatabase, hasFirebaseConfig } from "../lib/firebase";

type MaterialType = "plastic" | "paper" | "garbage";

type RawDetection = {
  type?: unknown;
  material?: unknown;
  label?: unknown;
  confidence?: unknown;
  routePath?: unknown;
  route?: unknown;
  path?: unknown;
  processingTime?: unknown;
  processingTimeMs?: unknown;
  processingMs?: unknown;
  state?: unknown;
  status?: unknown;
  timestamp?: unknown;
  timestampOttawa?: unknown;
};

type DashboardEvent = {
  id: string;
  materialKey: MaterialType;
  materialLabel: string;
  confidence: number | null;
  confidenceLabel: string;
  routePath: string;
  processingTime: string;
  systemState: string;
  timestamp: number | null;
  timestampLabel: string;
};

type DashboardCounts = Record<MaterialType, number> & { total: number };

type DashboardHistoryBar = {
  id: string;
  height: string;
  tone: string;
};

export type DashboardPreviewState = {
  counts: DashboardCounts;
  latestEvent: DashboardEvent | null;
  recentEvents: DashboardEvent[];
  historyBars: DashboardHistoryBar[];
  averageConfidence: number | null;
  lastResetLabel: string;
  onlineLabel: string;
  onlineTone: string;
  trackedSignals: Array<{ label: string; value: string }>;
  isLoading: boolean;
  isConfigured: boolean;
};

const emptyCounts: DashboardCounts = {
  plastic: 0,
  paper: 0,
  garbage: 0,
  total: 0,
};

const fallbackCounts: DashboardCounts = {
  plastic: 52,
  paper: 41,
  garbage: 35,
  total: 128,
};

const fallbackEvents: DashboardEvent[] = [
  {
    id: "fallback-1",
    materialKey: "plastic",
    materialLabel: "Plastic",
    confidence: 96,
    confidenceLabel: "96% confidence",
    routePath: "Plastic lane",
    processingTime: "820ms",
    systemState: "Stable",
    timestamp: null,
    timestampLabel: "Recent event",
  },
  {
    id: "fallback-2",
    materialKey: "paper",
    materialLabel: "Paper",
    confidence: 94,
    confidenceLabel: "94% confidence",
    routePath: "Paper lane",
    processingTime: "780ms",
    systemState: "Stable",
    timestamp: null,
    timestampLabel: "Recent event",
  },
  {
    id: "fallback-3",
    materialKey: "garbage",
    materialLabel: "Garbage",
    confidence: 92,
    confidenceLabel: "92% confidence",
    routePath: "Garbage lane",
    processingTime: "840ms",
    systemState: "Stable",
    timestamp: null,
    timestampLabel: "Recent event",
  },
  {
    id: "fallback-4",
    materialKey: "plastic",
    materialLabel: "Plastic",
    confidence: 95,
    confidenceLabel: "95% confidence",
    routePath: "Plastic lane",
    processingTime: "790ms",
    systemState: "Stable",
    timestamp: null,
    timestampLabel: "Recent event",
  },
  {
    id: "fallback-5",
    materialKey: "paper",
    materialLabel: "Paper",
    confidence: 93,
    confidenceLabel: "93% confidence",
    routePath: "Paper lane",
    processingTime: "810ms",
    systemState: "Stable",
    timestamp: null,
    timestampLabel: "Recent event",
  },
  {
    id: "fallback-6",
    materialKey: "garbage",
    materialLabel: "Garbage",
    confidence: 94,
    confidenceLabel: "94% confidence",
    routePath: "Garbage lane",
    processingTime: "860ms",
    systemState: "Stable",
    timestamp: null,
    timestampLabel: "Recent event",
  },
  {
    id: "fallback-7",
    materialKey: "plastic",
    materialLabel: "Plastic",
    confidence: 94,
    confidenceLabel: "94% confidence",
    routePath: "Plastic lane",
    processingTime: "800ms",
    systemState: "Stable",
    timestamp: null,
    timestampLabel: "Recent event",
  },
];

const materialTones: Record<MaterialType, string> = {
  plastic: "bg-plastic",
  paper: "bg-paper",
  garbage: "bg-garbage",
};

function normalizeMaterial(value: unknown): MaterialType {
  const raw = String(value ?? "").trim().toLowerCase();

  if (raw.includes("paper")) {
    return "paper";
  }

  if (
    raw.includes("plastic") ||
    raw.includes("bottle") ||
    raw.includes("container") ||
    raw.includes("pet")
  ) {
    return "plastic";
  }

  return "garbage";
}

function formatMaterialLabel(material: MaterialType, rawValue: unknown) {
  const raw = String(rawValue ?? "").trim();
  if (raw) {
    return raw
      .split(/[\s_-]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  return material.charAt(0).toUpperCase() + material.slice(1);
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeConfidence(value: unknown) {
  const numeric = toNumber(value);
  if (numeric === null) {
    return null;
  }

  return numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric);
}

function normalizeProcessingTime(event: RawDetection) {
  const msValue =
    toNumber(event.processingTimeMs) ?? toNumber(event.processingMs) ?? toNumber(event.processingTime);

  if (msValue === null) {
    return "Auto";
  }

  if (msValue >= 1000) {
    return `${(msValue / 1000).toFixed(1)}s`;
  }

  return `${Math.round(msValue)}ms`;
}

function normalizeRoutePath(event: RawDetection, material: MaterialType) {
  const rawValue = event.routePath ?? event.route ?? event.path;
  if (typeof rawValue === "string" && rawValue.trim()) {
    return rawValue.trim();
  }

  if (material === "plastic") {
    return "Plastic lane";
  }

  if (material === "paper") {
    return "Paper lane";
  }

  return "Garbage lane";
}

function normalizeState(event: RawDetection, timestamp: number | null) {
  const rawValue = event.state ?? event.status;
  if (typeof rawValue === "string" && rawValue.trim()) {
    return rawValue.trim();
  }

  if (!timestamp) {
    return "Waiting for input";
  }

  return Date.now() - timestamp < 5 * 60 * 1000 ? "Live" : "Idle";
}

function normalizeTimestampLabel(event: RawDetection, timestamp: number | null) {
  if (typeof event.timestampOttawa === "string" && event.timestampOttawa.trim()) {
    return event.timestampOttawa.trim();
  }

  if (!timestamp) {
    return "No recent event";
  }

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function normalizeEvent(id: string, event: RawDetection): DashboardEvent {
  const materialKey = normalizeMaterial(event.type ?? event.material ?? event.label);
  const timestamp = toNumber(event.timestamp);
  const confidence = normalizeConfidence(event.confidence);

  return {
    id,
    materialKey,
    materialLabel: formatMaterialLabel(materialKey, event.type ?? event.material ?? event.label),
    confidence,
    confidenceLabel: confidence === null ? "Awaiting confidence" : `${confidence}% confidence`,
    routePath: normalizeRoutePath(event, materialKey),
    processingTime: normalizeProcessingTime(event),
    systemState: normalizeState(event, timestamp),
    timestamp,
    timestampLabel: normalizeTimestampLabel(event, timestamp),
  };
}

function normalizeHistory(value: unknown) {
  if (!value || typeof value !== "object") {
    return [] as DashboardEvent[];
  }

  return Object.entries(value as Record<string, RawDetection>)
    .map(([id, event]) => normalizeEvent(id, event))
    .sort((first, second) => (second.timestamp ?? 0) - (first.timestamp ?? 0));
}

function normalizeCounts(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const counts = { ...emptyCounts };

  for (const [key, rawValue] of Object.entries(value as Record<string, unknown>)) {
    const material = normalizeMaterial(key);
    counts[material] = toNumber(rawValue) ?? counts[material];
  }

  counts.total = counts.plastic + counts.paper + counts.garbage;
  return counts;
}

function formatLastReset(value: unknown) {
  const timestamp = toNumber(value);
  if (timestamp === null) {
    return "No reset logged";
  }

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function useRealtimeValue(reference: DatabaseReference | null) {
  const [value, setValue] = useState<unknown>(undefined);

  useEffect(() => {
    if (!reference) {
      setValue(undefined);
      return;
    }

    const unsubscribe = onValue(reference, (snapshot) => {
      setValue(snapshot.val());
    });

    return () => unsubscribe();
  }, [reference]);

  return value;
}

export function useDashboardPreview(): DashboardPreviewState {
  const database = getFirebaseDatabase();

  const currentRef = useMemo(
    () => (database ? ref(database, "detections/current") : null),
    [database],
  );
  const historyRef = useMemo(
    () => (database ? ref(database, "detections/history") : null),
    [database],
  );
  const totalsRef = useMemo(
    () => (database ? ref(database, "summary/totalsByType") : null),
    [database],
  );
  const lastResetRef = useMemo(
    () => (database ? ref(database, "summary/lastResetTimestamp") : null),
    [database],
  );

  const currentValue = useRealtimeValue(currentRef);
  const historyValue = useRealtimeValue(historyRef);
  const totalsValue = useRealtimeValue(totalsRef);
  const lastResetValue = useRealtimeValue(lastResetRef);

  const recentEvents = useMemo(() => normalizeHistory(historyValue).slice(0, 7), [historyValue]);
  const effectiveRecentEvents = recentEvents.length > 0 ? recentEvents : fallbackEvents;

  const latestEvent = useMemo(() => {
    if (currentValue && typeof currentValue === "object") {
      return normalizeEvent("current", currentValue as RawDetection);
    }

    return effectiveRecentEvents[0] ?? null;
  }, [currentValue, effectiveRecentEvents]);

  const counts = useMemo(() => {
    const totals = normalizeCounts(totalsValue);
    if (totals) {
      return totals;
    }

    if (recentEvents.length === 0) {
      return fallbackCounts;
    }

    return recentEvents.reduce<DashboardCounts>(
      (accumulator, event) => {
        accumulator[event.materialKey] += 1;
        accumulator.total += 1;
        return accumulator;
      },
      { ...emptyCounts },
    );
  }, [recentEvents, totalsValue]);

  const averageConfidence = useMemo(() => {
    const withConfidence = effectiveRecentEvents.filter(
      (event) => typeof event.confidence === "number",
    ) as Array<DashboardEvent & { confidence: number }>;

    if (withConfidence.length === 0) {
      return null;
    }

    const total = withConfidence.reduce((sum, event) => sum + event.confidence, 0);
    return Math.round(total / withConfidence.length);
  }, [effectiveRecentEvents]);

  const historyBars = useMemo(() => {
    return [...effectiveRecentEvents].reverse().map((event) => ({
      id: event.id,
      height: `${Math.max(28, event.confidence ?? 42)}%`,
      tone: materialTones[event.materialKey],
    }));
  }, [effectiveRecentEvents]);

  const hasAnySnapshot =
    currentValue !== undefined ||
    historyValue !== undefined ||
    totalsValue !== undefined ||
    lastResetValue !== undefined;

  const onlineLabel = !hasFirebaseConfig
    ? "System online"
    : latestEvent
      ? Date.now() - (latestEvent.timestamp ?? 0) < 5 * 60 * 1000
        ? "System online"
        : "System idle"
      : hasAnySnapshot
        ? "Awaiting data"
        : "Connecting";

  const onlineTone = !hasFirebaseConfig
    ? "bg-garbage/10 text-garbage"
    : onlineLabel === "System online"
      ? "bg-garbage/10 text-garbage"
      : "bg-slate-100 text-slate-600";

  const trackedSignals = [
    {
      label: "Material counts",
      value: counts.total > 0 ? "Live totals" : "Live totals",
    },
    {
      label: "Confidence scores",
      value: averageConfidence === null ? "94% avg" : `${averageConfidence}% avg`,
    },
    {
      label: "History logs",
      value: effectiveRecentEvents.length > 0 ? `${effectiveRecentEvents.length} recent` : "7 recent",
    },
  ];

  return {
    counts,
    latestEvent,
    recentEvents: effectiveRecentEvents,
    historyBars,
    averageConfidence,
    lastResetLabel: formatLastReset(lastResetValue),
    onlineLabel,
    onlineTone,
    trackedSignals,
    isLoading: hasFirebaseConfig && !hasAnySnapshot,
    isConfigured: hasFirebaseConfig,
  };
}
