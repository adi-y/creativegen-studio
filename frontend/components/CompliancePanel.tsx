// components/CompliancePanel.tsx
"use client";
import { useEffect, useState } from "react";

export default function CompliancePanel() {
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      setIssues(e.detail.list || []);
    };
    window.addEventListener("compliance-result", handler);
    return () => window.removeEventListener("compliance-result", handler);
  }, []);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Compliance Issues
      </h3>
      {issues.length === 0 ? (
        <p className="text-emerald-400 text-sm">No issues detected yet.</p>
      ) : (
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="text-orange-400 text-sm bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-800"
            >
              {issue}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
