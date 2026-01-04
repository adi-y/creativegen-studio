"use client";

import { useState } from "react";
import {
  Upload,
  Type,
  Layout,
  Grid,
  Shield,
  Download,
  Image,
  Palette,
  Wand2,
  Info,
  Loader2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { GOOGLE_FONTS } from "@/lib/fonts";
import { PREMIUM_COLORS } from "@/lib/colors";

import ToolButton from "./ToolButton";
import { Eraser, Trash2 } from "lucide-react";

type LeftSidebarProps = {
  onUpload?: () => void;
  onAddText?: () => void;
  onRemoveBackground?: () => void;
  onCheckCompliance?: () => void;
  onExport?: () => void;
  onGenerateAILayout?: () => void;
  onClear?: () => void;
  onChangeFont?: (font: string) => void;
  onChangeColor?: (color: string) => void;
  isProcessing?: boolean;
  hasImageSelected?: boolean;
  isImagePresent?: boolean;
  selectedObjectType?: string | null;
};

export default function LeftSidebar({
  onUpload,
  onAddText,
  onChangeFont,
  onRemoveBackground,
  onCheckCompliance,
  onExport,
  onGenerateAILayout,
  onClear,
  onChangeColor,
  isProcessing = false,
  hasImageSelected = false,
  isImagePresent = false,
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
            <ToolButton
              icon={Upload}
              label="Upload Image"
              onClick={onUpload || (() => {})}
              variant="primary"
            />
            <ToolButton
              icon={Type}
              label="Add Text"
              onClick={onAddText || (() => {})}
              variant="default"
            />

            {/* Background Removal with Info */}
            <div className="relative">
              <ToolButton
                icon={Eraser}
                label={isProcessing ? "Removing..." : "Remove Background"}
                variant="default"
                badge="AI"
                onClick={onRemoveBackground || (() => {})}
                disabled={!isImagePresent || isProcessing}
                isLoading={isProcessing}
              />
              <button
                onClick={() => setShowBgInfo(!showBgInfo)}
                className="absolute top-3 right-3 p-1 hover:bg-gray-700 rounded-lg transition-colors z-10"
              >
                <Info className="w-3 h-3 text-gray-500" />
              </button>
            </div>

            {showBgInfo && (
              <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-xs text-blue-300 font-medium mb-2">
                  How to use:
                </p>
                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Upload an image</li>
                  <li>Select the image on canvas</li>
                  <li>Click "Remove Background"</li>
                  <li>Wait for AI to process</li>
                </ol>
              </div>
            )}

            <div className="pt-2">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2 px-1">
                <Palette className="w-3 h-3" />
                Color Palette
              </h4>
              <div className="grid grid-cols-6 gap-2 bg-gray-800/40 p-3 rounded-xl border border-white/5">
                {/* Custom Color Picker Button */}
                <div className="relative">
                  <button
                    onClick={() =>
                      document.getElementById("customColorPicker")?.click()
                    }
                    className="w-full aspect-square rounded-lg shadow-sm hover:scale-110 active:scale-95 transition-transform border border-dashed border-white/30 flex items-center justify-center bg-gray-800"
                    title="Custom Color"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500" />
                  </button>
                  <input
                    id="customColorPicker"
                    type="color"
                    onChange={(e) => onChangeColor?.(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer hidden"
                  />
                </div>

                {PREMIUM_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onChangeColor?.(color.value)}
                    className="w-full aspect-square rounded-lg shadow-sm hover:scale-110 active:scale-95 transition-transform border border-white/10"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <ToolButton
              icon={Trash2}
              label="Clear Canvas"
              variant="default"
              onClick={onClear || (() => {})}
            />
          </div>
        </div>

        {/* Font Selection - Only show when text is selected */}
        {(selectedObjectType === "textbox" ||
          selectedObjectType === "text") && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Type className="w-3.5 h-3.5" />
              Text Style
            </h3>
            <div className="bg-gray-800/50 border border-purple-500/20 rounded-xl p-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">
                Font Family
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {GOOGLE_FONTS.map((font) => (
                  <button
                    key={font}
                    onClick={() => onChangeFont?.(font)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors border border-transparent hover:border-purple-500/20"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Smart Layouts */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layout className="w-3.5 h-3.5" />
            Smart Layouts
          </h3>
          <div className="space-y-2">
            <ToolButton
              icon={Sparkles}
              label="AI Layout Generator"
              onClick={onGenerateAILayout || (() => {})}
              variant="primary"
              badge="AI"
              disabled={!isImagePresent}
            />
          </div>
        </div>

        {/* Compliance Check */}
        <ToolButton
          icon={Shield}
          label="Run Compliance Check"
          onClick={onCheckCompliance || (() => {})}
          variant="warning"
        />
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
