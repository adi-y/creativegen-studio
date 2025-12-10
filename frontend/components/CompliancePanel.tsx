"use client";

type CompliancePanelProps = {
  issues: string[];
};

export default function CompliancePanel({ issues }: CompliancePanelProps) {
  return (
    <div className="w-64 h-[1080px] bg-slate-900 border border-slate-700 rounded-lg p-3">
      <h2 className="font-semibold mb-2 text-sm">Compliance Issues</h2>
      {issues.length === 0 ? (
        <p className="text-slate-500 text-sm">No issues yet.</p>
      ) : (
        <ul className="space-y-1 text-sm text-red-300">
          {issues.map((issue, idx) => (
            <li key={idx}>• {issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
