// app/page.tsx
"use client";

import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import CanvasEditor from "@/components/CanvasCard/CanvasEditor";
import CompliancePanel from "@/components/CompliancePanel";

export default function Home() {
  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        window.dispatchEvent(
          new CustomEvent("add-image-to-canvas", { detail: url })
        );
      }
    };
    input.click();
  };

  const handleAddText = () => {
    window.dispatchEvent(
      new CustomEvent("add-text-to-canvas", {
        detail: { text: "Double tap to edit", fontSize: 80, color: "#ffffff" },
      })
    );
  };

  const handleApplyLayout1 = () => {
    window.dispatchEvent(
      new CustomEvent("apply-layout", { detail: "hero-focus" })
    );
  };

  const handleApplyLayout2 = () => {
    window.dispatchEvent(
      new CustomEvent("apply-layout", { detail: "split-grid" })
    );
  };

  const handleCompliance = () => {
    window.dispatchEvent(
      new CustomEvent("compliance-result", {
        detail: {
          issues: 2,
          list: [
            "Text covers 34% of image (Meta limit: 20%)",
            "Contains 'Lose weight fast' claim → prohibited",
          ],
        },
      }) // ← THIS CLOSING BRACKET WAS MISSING!
    );
  };

  const handleExport = () => {
    window.dispatchEvent(new CustomEvent("export-canvas"));
  };

  const handleIssuesChange = (issues: string[]) => {
    window.dispatchEvent(new CustomEvent("issues-change", { detail: issues }));
  };

  return (
    <div className="h-screen w-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          onUpload={handleUpload}
          onAddText={handleAddText}
          onApplyLayout1={handleApplyLayout1}
          onApplyLayout2={handleApplyLayout2}
          onCheckCompliance={handleCompliance}
          onExport={handleExport}
        />

        <main className="flex-1 flex items-center justify-center p-8 bg-[#0f0f1a]">
          <div className="w-full max-w-5xl aspect-[9/16] bg-white rounded-3xl shadow-2xl shadow-black/60 border border-slate-700 overflow-hidden">
            <CanvasEditor onIssuesChange={handleIssuesChange} />
          </div>
        </main>

        <aside className="w-80 bg-black/60 backdrop-blur-xl border-l border-slate-800 p-6">
          <CompliancePanel />
        </aside>
      </div>
    </div>
  );
}
