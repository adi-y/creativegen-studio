// components/Header.tsx
"use client";
import React from "react";

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-black/80 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          CG
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">CreativeGen Studio</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI-powered ad creative builder
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/70 text-slate-400 hover:bg-slate-800 transition text-sm font-medium">
          Settings
        </button>
        <button className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:from-violet-400 hover:to-fuchsia-400 transition shadow-lg">
          Upload Snapshot
        </button>
      </div>
    </header>
  );
}
