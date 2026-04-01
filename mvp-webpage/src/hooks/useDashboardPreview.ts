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
  routePath: string | null;
  processingTime: string | null;
  systemState: string | null;
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
  sourceLabel: string;
  lastUpdatedLabel: string;
  errorLabel: string | null;
};

function buildTrackedSignals(
  counts: DashboardCounts,
  averageConfidence: number | null,
  historyEventCount: number,
  latestEvent: DashboardEvent | null,
) {
  return [
    {
      label: "Event volume",
      value: counts.total > 0 ? `${counts.total} logged` : "No events yet",
    },
    {
      label: "Confidence average",
      value: averageConfidence === null ? "No score yet" : `${averageConfidence}% avg`,
    },
    {
      label: "Latest material",
      value: latestEvent?.materialLabel ?? "Awaiting event",
    },
    {
      label: "History entries",
      value: historyEventCount > 0 ? `${historyEventCount} stored` : "No history yet",
    },
  ];
}

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
    return null;
  }

  if (msValue >= 1000) {
    return `${(msValue / 1000).toFixed(1)}s`;
  }

  return `${Math.round(msValue)}ms`;
}

function normalizeRoutePath(event: RawDetection) {
  const rawValue = event.routePath ?? event.route ?? event.path;
  if (typeof rawValue === "string" && rawValue.trim()) {
    return rawValue.trim();
  }
  return null;
}

function normalizeState(event: RawDetection) {
  const rawValue = event.state ?? event.status;
  if (typeof rawValue === "string" && rawValue.trim()) {
    return rawValue.trim();
  }
  return null;
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
    routePath: normalizeRoutePath(event),
    processingTime: normalizeProcessingTime(event),
    systemState: normalizeState(event),
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

function formatLastUpdated(timestamp: number | null) {
  if (!timestamp) {
    return "No live event yet";
  }

  const elapsedMs = Date.now() - timestamp;
  if (elapsedMs < 60_000) {
    return "Updated just now";
  }

  const elapsedMinutes = Math.round(elapsedMs / 60_000);
  if (elapsedMinutes < 60) {
    return `Updated ${elapsedMinutes}m ago`;
  }

  return `Updated ${new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp)}`;
}

function formatFirebaseError(error: unknown) {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : "";
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code ?? "")
      : "";

  if (code.includes("permission-denied") || message.toLowerCase().includes("permission")) {
    return "Firebase connected, but database reads are blocked by your Realtime Database rules.";
  }

  return "Unable to read live Firebase data right now.";
}

function useRealtimeValue(reference: DatabaseReference | null) {
  const [value, setValue] = useState<unknown>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setValue(undefined);
      setError(null);
      return;
    }

    const unsubscribe = onValue(
      reference,
      (snapshot) => {
        setValue(snapshot.val());
        setError(null);
      },
      (firebaseError) => {
        setError(formatFirebaseError(firebaseError));
      },
    );

    return () => unsubscribe();
  }, [reference]);

  return { value, error };
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

  const { value: currentValue, error: currentError } = useRealtimeValue(currentRef);
  const { value: historyValue, error: historyError } = useRealtimeValue(historyRef);
  const { value: totalsValue, error: totalsError } = useRealtimeValue(totalsRef);
  const { value: lastResetValue, error: lastResetError } = useRealtimeValue(lastResetRef);
  const isUsingDemoData = !hasFirebaseConfig;

  const historyEvents = useMemo(() => normalizeHistory(historyValue), [historyValue]);
  const recentEvents = useMemo(() => historyEvents.slice(0, 7), [historyEvents]);
  const effectiveRecentEvents =
    recentEvents.length > 0 ? recentEvents : isUsingDemoData ? fallbackEvents : [];

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

    if (historyEvents.length === 0) {
      return isUsingDemoData ? fallbackCounts : { ...emptyCounts };
    }

    return historyEvents.reduce<DashboardCounts>(
      (accumulator, event) => {
        accumulator[event.materialKey] += 1;
        accumulator.total += 1;
        return accumulator;
      },
      { ...emptyCounts },
    );
  }, [historyEvents, isUsingDemoData, totalsValue]);

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

  const errorLabel = currentError ?? historyError ?? totalsError ?? lastResetError;

  const onlineLabel = !hasFirebaseConfig
    ? "System online"
    : errorLabel
      ? "Read blocked"
    : latestEvent
      ? Date.now() - (latestEvent.timestamp ?? 0) < 5 * 60 * 1000
        ? "System online"
        : "System idle"
      : hasAnySnapshot
        ? "Awaiting data"
        : "Connecting";

  const onlineTone = !hasFirebaseConfig
    ? "bg-garbage/10 text-garbage"
    : errorLabel
      ? "bg-paper/10 text-paper"
    : onlineLabel === "System online"
      ? "bg-garbage/10 text-garbage"
      : "bg-slate-100 text-slate-600";

  const trackedSignals = buildTrackedSignals(
    counts,
    averageConfidence,
    historyEvents.length,
    latestEvent,
  );

  const sourceLabel = !hasFirebaseConfig
    ? "Demo data"
    : errorLabel
      ? "Firebase error"
    : historyEvents.length > 0 || currentValue
      ? "Firebase live data"
      : hasAnySnapshot
        ? "Firebase connected"
        : "Connecting to Firebase";

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
    sourceLabel,
    lastUpdatedLabel: formatLastUpdated(latestEvent?.timestamp ?? null),
    errorLabel,
  };
}
