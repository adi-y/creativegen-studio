// components/modal.tsx
"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]}
          bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl
          animate-in slide-in-from-bottom-4 duration-300
          max-h-[90vh] flex flex-col
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-gray-800">
            <div className="flex-1">
              {title && (
                <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-gray-400">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-gray-800 rounded-lg transition-colors ml-4"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-800 p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Confirmation Modal
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
}) {
  const variantStyles = {
    default: "bg-purple-500 hover:bg-purple-600",
    danger: "bg-red-500 hover:bg-red-600",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 ${variantStyles[variant]} rounded-lg text-white font-medium transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="py-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Modal>
  );
}

// Image Preview Modal
export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
    >
      <div className="flex items-center justify-center bg-gray-950 rounded-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={title || "Preview"}
          className="max-w-full max-h-[70vh] object-contain"
        />
      </div>
    </Modal>
  );
}

// Loading Modal
export function LoadingModal({
  isOpen,
  message = "Loading...",
  description,
}: {
  isOpen: boolean;
  message?: string;
  description?: string;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      showCloseButton={false}
      closeOnOverlayClick={false}
      size="sm"
    >
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-white font-semibold mb-2">{message}</p>
        {description && (
          <p className="text-gray-400 text-sm text-center">{description}</p>
        )}
      </div>
    </Modal>
  );
}

// Form Modal Template
export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  isSubmitting = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-gray-200 font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {submitText}
          </button>
        </div>
      }
    >
      {children}
    </Modal>
  );
}