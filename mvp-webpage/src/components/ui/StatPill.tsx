type StatPillProps = {
  label: string;
  value: string;
  tone: string;
};

function StatPill({ label, value, tone }: StatPillProps) {
  return (
    <div className={`rounded-full border px-4 py-3 shadow-soft ${tone}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

export default StatPill;
