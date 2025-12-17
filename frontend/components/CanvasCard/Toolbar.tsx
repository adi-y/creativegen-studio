// components/Toolbar.tsx
"use client";

import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Circle, 
  Move, 
  Trash2, 
  Copy, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Layers
} from "lucide-react";
import { useState } from "react";

interface ToolbarProps {
  onAddText?: () => void;
  onAddImage?: () => void;
  onAddShape?: (shape: "rectangle" | "circle") => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onAlign?: (alignment: "left" | "center" | "right") => void;
  hasSelection?: boolean;
}

export default function Toolbar({
  onAddText,
  onAddImage,
  onAddShape,
  onDelete,
  onDuplicate,
  onAlign,
  hasSelection = false,
}: ToolbarProps) {
  const [activeTextStyle, setActiveTextStyle] = useState<string[]>([]);

  const toggleTextStyle = (style: string) => {
    setActiveTextStyle((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const ToolButton = ({
    icon: Icon,
    label,
    onClick,
    disabled = false,
    active = false,
    variant = "default",
  }: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
    variant?: "default" | "danger";
  }) => {
    const baseClasses = "p-2 rounded-lg transition-all duration-200 group relative";
    const variantClasses = {
      default: active
        ? "bg-purple-500/20 border-purple-500/50"
        : "hover:bg-gray-700 border-transparent",
      danger: "hover:bg-red-500/20 border-transparent",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${disabled ? "opacity-40 cursor-not-allowed" : ""}
          border
        `}
        title={label}
      >
        <Icon
          className={`w-4 h-4 ${
            variant === "danger"
              ? "text-red-400"
              : active
              ? "text-purple-400"
              : "text-gray-300"
          }`}
        />
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {label}
        </div>
      </button>
    );
  };

  const Divider = () => <div className="w-px h-6 bg-gray-700" />;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
      <div className="flex items-center gap-2">
        {/* Add Elements Section */}
        <div className="flex items-center gap-1 px-2">
          <ToolButton
            icon={Type}
            label="Add Text (T)"
            onClick={onAddText}
          />
          <ToolButton
            icon={ImageIcon}
            label="Add Image (I)"
            onClick={onAddImage}
          />
          <ToolButton
            icon={Square}
            label="Add Rectangle (R)"
            onClick={() => onAddShape?.("rectangle")}
          />
          <ToolButton
            icon={Circle}
            label="Add Circle (C)"
            onClick={() => onAddShape?.("circle")}
          />
        </div>

        <Divider />

        {/* Selection Tools */}
        <div className="flex items-center gap-1 px-2">
          <ToolButton
            icon={Move}
            label="Move (V)"
            active={true}
          />
          <ToolButton
            icon={Copy}
            label="Duplicate (Ctrl+D)"
            onClick={onDuplicate}
            disabled={!hasSelection}
          />
          <ToolButton
            icon={Trash2}
            label="Delete (Del)"
            onClick={onDelete}
            disabled={!hasSelection}
            variant="danger"
          />
        </div>

        <Divider />

        {/* Text Formatting (visible when text is selected) */}
        {hasSelection && (
          <>
            <div className="flex items-center gap-1 px-2">
              <ToolButton
                icon={Bold}
                label="Bold (Ctrl+B)"
                active={activeTextStyle.includes("bold")}
                onClick={() => toggleTextStyle("bold")}
              />
              <ToolButton
                icon={Italic}
                label="Italic (Ctrl+I)"
                active={activeTextStyle.includes("italic")}
                onClick={() => toggleTextStyle("italic")}
              />
              <ToolButton
                icon={Underline}
                label="Underline (Ctrl+U)"
                active={activeTextStyle.includes("underline")}
                onClick={() => toggleTextStyle("underline")}
              />
            </div>

            <Divider />

            {/* Alignment */}
            <div className="flex items-center gap-1 px-2">
              <ToolButton
                icon={AlignLeft}
                label="Align Left"
                onClick={() => onAlign?.("left")}
              />
              <ToolButton
                icon={AlignCenter}
                label="Align Center"
                onClick={() => onAlign?.("center")}
              />
              <ToolButton
                icon={AlignRight}
                label="Align Right"
                onClick={() => onAlign?.("right")}
              />
            </div>

            <Divider />
          </>
        )}

        {/* Additional Tools */}
        <div className="flex items-center gap-1 px-2 ml-auto">
          <ToolButton
            icon={Palette}
            label="Color Picker"
            onClick={() => {}}
          />
          <ToolButton
            icon={Layers}
            label="Layers"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

// Compact Toolbar Variant (for smaller screens)
export function CompactToolbar({ 
  onAddText, 
  onAddImage, 
  hasSelection 
}: Pick<ToolbarProps, "onAddText" | "onAddImage" | "hasSelection">) {
  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onAddText}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium text-gray-200 transition-colors flex items-center gap-2"
          >
            <Type className="w-3.5 h-3.5" />
            Text
          </button>
          <button
            onClick={onAddImage}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium text-gray-200 transition-colors flex items-center gap-2"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image
          </button>
        </div>

        {hasSelection && (
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}