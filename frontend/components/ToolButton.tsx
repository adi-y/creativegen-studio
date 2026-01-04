"use client";
import React from "react";
import { Loader2 } from "lucide-react";
type ToolButtonProps = {
  icon: React.ElementType;
  label: string;
  badge?: string;
  onClick: () => void;
  variant?: "default" | "primary" | "success" | "warning";
  disabled?: boolean;
  isLoading?: boolean;
};
const ToolButton = ({
  icon: Icon,
  label,
  badge,
  onClick,
  variant = "default",
  disabled = false,
  isLoading = false,
}: ToolButtonProps) => {
  const variants = {
    default:
      "bg-gray-800/50 hover:bg-gray-700/80 border-gray-700 text-gray-300",
    primary:
      "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300",
    success:
      "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
    warning:
      "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 text-orange-300",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border font-medium transition-all duration-200 group relative disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      <div className="flex items-center gap-3">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
        ) : (
          <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
        )}
        <span className="text-sm">{label}</span>
      </div>
      {badge && !isLoading && (
        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 font-bold tracking-tighter">
          {badge}
        </span>
      )}
    </button>
  );
};
export default ToolButton;
