// components/CompliancePanel.tsx
"use client";
import { useEffect, useState } from "react";

import { Shield, Check, AlertCircle } from "lucide-react";

export default function CompliancePanel() {
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const handler = (e: any) => setIssues(e.detail.list || []);
    window.addEventListener("compliance-result", handler);
    return () => window.removeEventListener("compliance-result", handler);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Compliance Check
        </h3>
        {issues.length > 0 && (
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-md border border-orange-500/30">
            {issues.length} {issues.length === 1 ? "Issue" : "Issues"}
          </span>
        )}
      </div>

      {issues.length === 0 ? (
        <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-emerald-400 font-medium">
            All checks passed!
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Your creative is compliant
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-start gap-3 group hover:bg-orange-500/10 transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-orange-200">{issue}</p>
                <button className="text-xs text-orange-400 hover:text-orange-300 mt-1 font-medium">
                  Fix automatically →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
