"use client";

type SidebarProps = {
  onUpload?: () => void;
  onAddText?: () => void;
  onApplyLayout1?: () => void;
  onApplyLayout2?: () => void;
  onCheckCompliance?: () => void;
  onExport?: () => void;
};

export default function Sidebar({
  onUpload,
  onAddText,
  onApplyLayout1,
  onApplyLayout2,
  onCheckCompliance,
  onExport,
}: SidebarProps) {
  return (
    <div className="flex flex-col gap-2 w-56">
      <button
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
        onClick={onUpload}
      >
        Upload Image
      </button>
      <button
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
        onClick={onAddText}
      >
        Add Text
      </button>
      <button
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
        onClick={onApplyLayout1}
      >
        Apply Layout 1
      </button>
      <button
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
        onClick={onApplyLayout2}
      >
        Apply Layout 2
      </button>
      <button
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
        onClick={onCheckCompliance}
      >
        Run Compliance
      </button>
      <button
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
        onClick={onExport}
      >
        Export PNG
      </button>
    </div>
  );
}
