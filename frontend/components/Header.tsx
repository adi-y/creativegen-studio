// components/Header.tsx
"use client";
import React from "react";

import { Grid, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 border-b border-gray-800 bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/50">
            CG
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">CreativeGen Studio</h1>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            AI-Powered Creative Builder
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Placeholder for future user actions if needed */}
      </div>
    </header>
  );
}
