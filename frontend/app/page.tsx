"use client";

import { useState } from "react";
import CanvasEditor from "../components/CanvasEditor";
import CompliancePanel from "../components/CompliancePanel";

export default function Home() {
  const [issues, setIssues] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <h1 className="text-2xl font-semibold mb-4">CreativeGen Studio</h1>
      <div className="flex gap-4">
        <CanvasEditor onIssuesChange={setIssues} />
        <CompliancePanel issues={issues} />
      </div>
    </main>
  );
}
