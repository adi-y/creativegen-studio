// components/LeftSidebar.tsx
"use client";

type LeftSidebarProps = {
  onUpload?: () => void;
  onAddText?: () => void;
  onApplyLayout1?: () => void;
  onApplyLayout2?: () => void;
  onCheckCompliance?: () => void;
  onExport?: () => void;
};

export default function LeftSidebar({
  onUpload,
  onAddText,
  onApplyLayout1,
  onApplyLayout2,
  onCheckCompliance,
  onExport,
}: LeftSidebarProps) {
  return (
    <aside className="w-80 bg-black/80 backdrop-blur-xl border-r border-slate-800 flex flex-col">
      {/* Scrollable tools area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Creative Tools
          </h3>
          <div className="space-y-3">
            <button
              onClick={onUpload}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/70 hover:bg-violet-500/20 rounded-xl text-left font-medium transition"
            >
              Upload Upload Image
            </button>
            <button
              onClick={onAddText}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/70 hover:bg-purple-500/20 rounded-xl text-left font-medium transition"
            >
              Text Add Text
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Smart Layouts
          </h3>
          <div className="space-y-3">
            <button
              onClick={onApplyLayout1}
              className="w-full flex justify-between items-center px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl font-medium text-emerald-300 transition"
            >
              <span>Layout 1 – Hero Focus</span>
              <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded">
                Recommended
              </span>
            </button>
            <button
              onClick={onApplyLayout2}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/70 hover:bg-sky-500/20 rounded-xl text-left font-medium transition"
            >
              Grid Layout 2 – Split Grid
            </button>
          </div>
        </div>

        <button
          onClick={onCheckCompliance}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/40 rounded-xl font-medium text-orange-300 transition"
        >
          Shield Run Compliance Check
        </button>
      </div>

      {/* Fixed Export Button at Bottom */}
      <div className="p-6 border-t border-slate-800">
        <button
          onClick={onExport}
          className="w-full py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl font-bold text-white text-lg shadow-lg hover:shadow-purple-500/50 hover:shadow-purple-500/70 transition-all flex items-center justify-center gap-3 group"
        >
          <span className="group-hover:-translate-y-0.5 transition-transform">
            Download
          </span>
          Export as PNG
        </button>
      </div>
    </aside>
  );
}
