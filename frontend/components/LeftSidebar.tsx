"use client";

import { useState } from 'react';
import { Upload, Type, Layout, Grid, Shield, Download, Image, Palette, Wand2, Info, Loader2, Sparkles } from 'lucide-react';

type LeftSidebarProps = {
  onUpload?: () => void;
  onAddText?: () => void;
  onRemoveBackground?: () => void;
  onApplyLayout1?: () => void;
  onApplyLayout2?: () => void;
  onCheckCompliance?: () => void;
  onExport?: () => void;
  onGenerateAILayout?: () => void;
  isProcessing?: boolean;
  hasImageSelected?: boolean;
  selectedObjectType?: string | null;
};

export default function LeftSidebar({
  onUpload,
  onAddText,
  onRemoveBackground,
  onApplyLayout1,
  onApplyLayout2,
  onCheckCompliance,
  onExport,
  onGenerateAILayout,
  isProcessing = false,
  hasImageSelected = false,
  selectedObjectType = null,
}: LeftSidebarProps) {
  const [showBgInfo, setShowBgInfo] = useState(false);

  return (
    <aside className="w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/10 border-r border-gray-800 flex flex-col">
      {/* Scrollable tools area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Creative Tools */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5" />
            Creative Tools
          </h3>
          <div className="space-y-2">
            <button
              onClick={onUpload}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 hover:from-purple-500/20 hover:to-fuchsia-500/20 border border-purple-500/30 rounded-xl text-left font-medium transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-gray-900/50 group-hover:bg-gray-900 transition-colors">
                <Upload className="w-4 h-4 text-gray-300 group-hover:text-white" />
              </div>
              <span className="text-sm text-gray-200">Upload Image</span>
            </button>

            <button
              onClick={onAddText}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/70 hover:bg-gray-700 border border-gray-700 rounded-xl text-left font-medium transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-gray-900/50 group-hover:bg-gray-900 transition-colors">
                <Type className="w-4 h-4 text-gray-300 group-hover:text-white" />
              </div>
              <span className="text-sm text-gray-200">Add Text</span>
            </button>

            {/* Background Removal with Info */}
            <div className="relative">
              <button
                onClick={onRemoveBackground}
                disabled={!hasImageSelected || isProcessing}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/70 hover:bg-gray-700 border border-gray-700 rounded-xl text-left font-medium transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-2 rounded-lg bg-gray-900/50 group-hover:bg-gray-900 transition-colors">
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
                  ) : (
                    <Image className="w-4 h-4 text-gray-300 group-hover:text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-200">
                  {isProcessing ? 'Removing...' : 'Remove Background'}
                </span>
                <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md border border-purple-500/30">
                  AI
                </span>
              </button>
              <button
                onClick={() => setShowBgInfo(!showBgInfo)}
                className="absolute top-3 right-3 p-1 hover:bg-gray-700 rounded-lg transition-colors z-10"
              >
                <Info className="w-3 h-3 text-gray-500" />
              </button>
            </div>

            {showBgInfo && (
              <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300 font-medium mb-2">How to use:</p>
                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Upload an image</li>
                  <li>Select the image on canvas</li>
                  <li>Click "Remove Background"</li>
                  <li>Wait for AI to process</li>
                </ol>
              </div>
            )}

            <button
              onClick={() => {}}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/70 hover:bg-gray-700 border border-gray-700 rounded-xl text-left font-medium transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-gray-900/50 group-hover:bg-gray-900 transition-colors">
                <Palette className="w-4 h-4 text-gray-300 group-hover:text-white" />
              </div>
              <span className="text-sm text-gray-200">Color Palette</span>
            </button>
          </div>
        </div>

        {/* Smart Layouts */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layout className="w-3.5 h-3.5" />
            Smart Layouts
          </h3>
          <div className="space-y-2">
            <button
              onClick={onApplyLayout1}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-br from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 border border-emerald-500/30 rounded-xl font-medium text-emerald-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-900/50">
                  <Layout className="w-4 h-4" />
                </div>
                <span className="text-sm">Hero Focus</span>
              </div>
              <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-500/30">
                Recommended
              </span>
            </button>

            <button
              onClick={onApplyLayout2}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/70 hover:bg-gray-700 border border-gray-700 rounded-xl text-left font-medium transition-all duration-200 group"
            >
              <div className="p-2 rounded-lg bg-gray-900/50 group-hover:bg-gray-900 transition-colors">
                <Grid className="w-4 h-4 text-gray-300 group-hover:text-white" />
              </div>
              <span className="text-sm text-gray-200">Split Grid</span>
            </button>

            {/* AI Layout Generator */}
            <button
              onClick={onGenerateAILayout}
              disabled={!hasImageSelected}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 hover:from-purple-500/20 hover:to-fuchsia-500/20 border border-purple-500/30 rounded-xl font-medium text-purple-300 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-900/50">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm">AI Layout Generator</span>
              </div>
              <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-md border border-purple-500/30">
                AI
              </span>
            </button>
          </div>
        </div>

        {/* Compliance Check */}
        <button
          onClick={onCheckCompliance}
          className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border border-orange-500/30 rounded-xl font-medium text-orange-300 transition-all duration-200 group"
        >
          <div className="p-2 rounded-lg bg-gray-900/50 group-hover:bg-gray-900 transition-colors">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-sm">Run Compliance Check</span>
        </button>
      </div>

      {/* Fixed Export Button at Bottom */}
      <div className="p-6 border-t border-gray-800 bg-gray-900/50">
        <button
          onClick={onExport}
          className="w-full py-4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-xl font-bold text-white text-base shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-200 flex items-center justify-center gap-3 group"
        >
          <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
          Export as PNG
        </button>
      </div>
    </aside>
  );
}