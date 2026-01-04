"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload,
  Type,
  Layout,
  Grid,
  Shield,
  Download,
  Sparkles,
  Check,
  AlertCircle,
  Palette,
  Wand2,
  Eraser,
  Loader2,
  X,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { removeBackground } from "@/lib/api";
import { dispatchCompliance } from "@/lib/compliance/scanner";
import { extractTextFromImage } from "@/lib/ocr";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import CompliancePanel from "@/components/CompliancePanel";
import ToolButton from "@/components/ToolButton";
import { GOOGLE_FONTS } from "@/lib/fonts";
import { PREMIUM_COLORS } from "@/lib/colors";
import { Bold, Italic, ChevronDown } from "lucide-react";

// Status Message Component
const StatusMessage = ({
  message,
  type,
}: {
  message: string;
  type: "success" | "error" | "info";
}) => {
  const styles = {
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    error: "border-red-500/40 bg-red-500/10 text-red-200",
    info: "border-blue-500/40 bg-blue-500/10 text-blue-200",
  };

  return (
    <div className={`text-xs px-3 py-2 rounded-lg border ${styles[type]}`}>
      {message}
    </div>
  );
};

// Layout Preview Modal (Improved)
const LayoutPreviewModal = ({
  isOpen,
  onClose,
  variations,
  onDownload,
  isLoading,
  platform = "instagram_story",
}: {
  isOpen: boolean;
  onClose: () => void;
  variations: string[];
  onDownload: (index: number) => void;
  isLoading: boolean;
  platform?: string;
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const getAspectRatioClass = () => {
    switch (platform) {
      case "instagram_square":
      case "facebook_feed":
      case "google_display":
        return "aspect-square";
      default:
        return "aspect-[9/16]";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Choose Your Layout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300 text-lg">
                Generating creative options...
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {variations.map((img, idx) => (
                <div
                  key={idx}
                  className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    selected === idx
                      ? "border-purple-500 shadow-xl shadow-purple-500/40"
                      : "border-gray-700 hover:border-purple-400"
                  }`}
                  onClick={() => setSelected(idx)}
                >
                  <div
                    className={`${getAspectRatioClass()} bg-gray-800 flex items-center justify-center p-2`}
                  >
                    <img
                      src={img}
                      alt={`Layout option ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 bg-gray-900/80 flex justify-between items-center">
                    <span className="text-gray-300 text-sm">
                      Option {idx + 1}
                    </span>
                    <div className="bg-purple-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {selected === idx ? "Selected" : "Select"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selected !== null && onDownload(selected)}
            disabled={selected === null || isLoading}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Selected
          </button>
        </div>
      </div>
    </div>
  );
};

// Canvas Editor Component
const CanvasEditor = ({
  onSelectionChange,
  fabricRef,
  canvasInstance,
}: {
  onSelectionChange: (hasSelection: boolean, meta: any) => void;
  fabricRef: React.RefObject<any>;
  canvasInstance: React.RefObject<any>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCallbacksRef = useRef(onSelectionChange);
  const [hoveredObject, setHoveredObject] = useState<any>(null);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const isOverToolbarRef = useRef(false);
  const hideTimeoutRef = useRef<any>(null);

  useEffect(() => {
    selectionCallbacksRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    let mounted = true;
    const resizeCanvas = () => {
      const container = canvasRef.current?.parentElement;
      if (!container || !canvasInstance.current) return;
      const scale = Math.min(
        container.clientWidth / 1080,
        container.clientHeight / 1920,
        1
      );
      canvasInstance.current.setDimensions({
        width: Math.round(1080 * scale),
        height: Math.round(1920 * scale),
      });
      canvasInstance.current.setZoom(scale);
      canvasInstance.current.renderAll();
    };
    const initFabric = async () => {
      if (!canvasRef.current || !mounted) return;
      const mod = await import("fabric");
      const fabric = (mod as any).fabric ?? mod;
      fabricRef.current = fabric;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 1080,
        height: 1920,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
      });
      canvasInstance.current = canvas;

      canvas.on("selection:created selection:updated", (e: any) => {
        const obj = e.selected?.[0];
        if (
          obj?.type === "image" ||
          obj?.type === "textbox" ||
          obj?.type === "text"
        ) {
          selectionCallbacksRef.current(true, {
            type: obj.type,
            file: (obj as any)._originalFile,
            url: (obj as any)._originalUrl,
            name: (obj as any)._fileName,
          });
        } else {
          selectionCallbacksRef.current(false, null);
        }
      });

      canvas.on("selection:cleared", () => {
        selectionCallbacksRef.current(false, null);
      });

      canvas.on("mouse:over", (e: any) => {
        const obj = e.target;
        if (obj && (obj.type === "textbox" || obj.type === "text")) {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
          }
          setHoveredObject(obj);
          // Position toolbar above the object
          const bound = obj.getBoundingRect();
          const zoom = canvas.getZoom();
          setToolbarPos({
            top: bound.top / zoom - 50,
            left: bound.left / zoom + bound.width / (2 * zoom),
          });
        }
      });

      canvas.on("mouse:out", (e: any) => {
        hideTimeoutRef.current = setTimeout(() => {
          if (!isOverToolbarRef.current) {
            setHoveredObject(null);
            setShowFontDropdown(false);
          }
        }, 150);
      });

      const handleAddImage = async (ev: Event) => {
        const event = ev as CustomEvent<{
          dataUrl: string;
          file?: File;
          name?: string;
        }>;
        const { dataUrl, file, name } = event.detail;
        if (!dataUrl || !canvasInstance.current || !fabricRef.current) return;
        try {
          const FabricImage = fabricRef.current.Image;
          const isRemote = dataUrl.startsWith("http");
          const img = await FabricImage.fromURL(
            dataUrl,
            isRemote ? { crossOrigin: "anonymous" } : undefined
          );
          const maxWidth = 1080 * 0.7;
          img.scaleToWidth(maxWidth);
          img.set({
            left: 1080 / 2,
            top: 1920 / 2,
            originX: "center",
            originY: "center",
            cornerStyle: "circle",
            cornerColor: "#a855f7",
            borderColor: "#a855f7",
            transparentCorners: false,
          });
          (img as any)._originalUrl = dataUrl;
          if (file) {
            (img as any)._originalFile = file;
            (img as any)._fileName = name || file.name;
          }
          canvasInstance.current.add(img);
          img.setCoords();
          canvasInstance.current.setActiveObject(img);
          canvasInstance.current.requestRenderAll();

          selectionCallbacksRef.current(true, {
            type: "image",
            file: file,
            url: dataUrl,
            name: name || file?.name,
          });

          // Run OCR on the uploaded image asynchronously
          (async () => {
            try {
              console.log("Running OCR on uploaded image...");
              const ocrText = await extractTextFromImage(dataUrl);
              (img as any)._ocrText = ocrText;
              if (ocrText) {
                console.log("OCR extracted text from image:", ocrText);
                window.dispatchEvent(
                  new CustomEvent("image-text-extracted", {
                    detail: { text: ocrText },
                  })
                );
              } else {
                console.log("No text found in image");
              }
            } catch (ocrError) {
              console.error("OCR failed:", ocrError);
            }
          })();
        } catch (error) {
          console.error("Error adding image:", error);
        }
      };

      const handleReplaceImage = async (ev: Event) => {
  const event = ev as CustomEvent<{
    dataUrl: string;
    file?: File;
    name?: string;
  }>;
  const { dataUrl, file, name } = event.detail;
  if (!dataUrl || !canvasInstance.current || !fabricRef.current) return;
  const activeObj = canvasInstance.current.getActiveObject();
  if (!activeObj || activeObj.type !== "image") return;
  try {
    const FabricImage = fabricRef.current.Image;
    const isRemote = dataUrl.startsWith("http");
    const newImg = await FabricImage.fromURL(
      dataUrl,
      isRemote ? { crossOrigin: "anonymous" } : undefined
    );
    newImg.set({
      ...activeObj.toObject(),
      _originalFile: file || (activeObj as any)._originalFile,
      _originalUrl: dataUrl,
      _fileName: name || (activeObj as any)._fileName,
    });
    canvasInstance.current.remove(activeObj);
    canvasInstance.current.add(newImg);
    newImg.setCoords();
    canvasInstance.current.setActiveObject(newImg);
    canvasInstance.current.requestRenderAll();
    
    // Trigger selection callback after replacement
    selectionCallbacksRef.current(true, {
      type: "image",
      file: file || (activeObj as any)._originalFile,
      url: dataUrl,
      name: name || (activeObj as any)._fileName,
    });
  } catch (error) {
    console.error("Error replacing image:", error);
  }
};

      const handleAddText = () => {
        if (!canvasInstance.current || !fabricRef.current) return;
        const text = new fabricRef.current.Textbox("Double tap to edit", {
          left: 1080 / 2,
          top: 1920 / 2, // Centered
          fontSize: 48,
          fill: "#000000",
          fontFamily: "Impact, Arial Black, sans-serif",
          fontWeight: "bold",
          textAlign: "center",
          width: 1080 * 0.8,
          originX: "center",
          originY: "center",
          editable: true,
        });
        canvasInstance.current.add(text);
        canvasInstance.current.setActiveObject(text);
        canvasInstance.current.renderAll();
      };

      const handleChangeFont = (ev: Event) => {
        const event = ev as CustomEvent<{ fontFamily: string }>;
        const { fontFamily } = event.detail;
        if (!canvasInstance.current) return;
        const activeObj = canvasInstance.current.getActiveObject();
        if (
          activeObj &&
          (activeObj.type === "textbox" || activeObj.type === "text")
        ) {
          activeObj.set("fontFamily", fontFamily);
          canvasInstance.current.renderAll();
        }
      };

      const handleExport = () => {
        if (!canvasInstance.current) return;
        try {
          window.dispatchEvent(new CustomEvent("export-started"));
          const canvas = canvasInstance.current;
          const originalBg = canvas.backgroundColor;
          const originalZoom = canvas.getZoom();
          const originalWidth = canvas.getWidth();
          const originalHeight = canvas.getHeight();

          // Prepare canvas for high-quality export
          canvas.setZoom(1);
          canvas.setDimensions({ width: 1080, height: 1920 });

          // NOTE: We no longer force transparency here to preserve user selected color
          canvas.renderAll();

          const dataURL = canvas.toDataURL({
            format: "png",
            multiplier: 2,
            quality: 1,
          });

          // Restore canvas state
          canvas.backgroundColor = originalBg;
          canvas.setDimensions({
            width: originalWidth,
            height: originalHeight,
          });
          canvas.setZoom(originalZoom);
          canvas.renderAll();

          const link = document.createElement("a");
          link.href = dataURL;
          link.download = `creativegen-ad-${Date.now()}.png`;
          document.body.appendChild(link); // Better browser compatibility
          link.click();
          document.body.removeChild(link);

          window.dispatchEvent(
            new CustomEvent("export-finished", { detail: { success: true } })
          );
        } catch (err) {
          console.error("Export failed", err);
          window.dispatchEvent(
            new CustomEvent("export-finished", {
              detail: { success: false, error: err },
            })
          );
        }
      };

      const handleClear = () => {
        console.log("CanvasEditor: Received clear-canvas event");
        if (!canvasInstance.current) {
          console.error("CanvasEditor: No canvas instance found");
          return;
        }
        console.log("CanvasEditor: Clearing canvas...");
        canvasInstance.current.clear();
        canvasInstance.current.backgroundColor = "#ffffff";
        canvasInstance.current.renderAll();
        selectionCallbacksRef.current(false, null);
        console.log("CanvasEditor: Canvas cleared.");
      };

      window.addEventListener("resize", resizeCanvas);
      window.addEventListener(
        "add-image-to-canvas",
        handleAddImage as EventListener
      );
      window.addEventListener(
        "replace-image-on-canvas",
        handleReplaceImage as EventListener
      );
      window.addEventListener(
        "add-text-to-canvas",
        handleAddText as EventListener
      );
      window.addEventListener(
        "change-font-on-canvas",
        handleChangeFont as EventListener
      );
      window.addEventListener("export-canvas", handleExport as EventListener);
      window.addEventListener("clear-canvas", handleClear as EventListener);

      resizeCanvas();
    };

    initFabric();

    return () => {
      mounted = false;
      if (canvasInstance.current) {
        try {
          canvasInstance.current.dispose?.();
        } catch {}
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [fabricRef, canvasInstance]);

  const toggleStyle = (styleType: "bold" | "italic") => {
    if (!hoveredObject || !canvasInstance.current) return;
    const canvas = canvasInstance.current;

    if (styleType === "bold") {
      const isBold = hoveredObject.fontWeight === "bold";
      hoveredObject.set("fontWeight", isBold ? "normal" : "bold");
    } else if (styleType === "italic") {
      const isItalic = hoveredObject.fontStyle === "italic";
      hoveredObject.set("fontStyle", isItalic ? "normal" : "italic");
    }

    canvas.renderAll();
    // Use a counter or simple boolean to force a re-render of the toolbar
    // without breaking the Fabric object reference
    selectionCallbacksRef.current(true, {
      type: hoveredObject.type,
      file: hoveredObject._originalFile,
      url: hoveredObject._originalUrl,
      name: hoveredObject._fileName,
    });
  };

  const changeFont = (fontFamily: string) => {
    if (!hoveredObject || !canvasInstance.current) return;
    const canvas = canvasInstance.current;
    hoveredObject.set("fontFamily", fontFamily);
    canvas.renderAll();
    setHoveredObject({ ...hoveredObject });
    setShowFontDropdown(false);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-purple-50 p-8 relative">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-2xl shadow-2xl border-4 border-white"
        />
        <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          1080 × 1920
        </div>

        {/* Floating Toolbar */}
        {hoveredObject && (
          <div
            className="absolute z-50 flex items-center gap-1 p-1.5 bg-gray-900/90 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200"
            style={{
              top: `${toolbarPos.top}px`,
              left: `${toolbarPos.left}px`,
              transform: "translateX(-50%)",
            }}
            onMouseEnter={() => {
              isOverToolbarRef.current = true;
              if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
              }
            }}
            onMouseLeave={() => {
              isOverToolbarRef.current = false;
              setHoveredObject(null);
              setShowFontDropdown(false);
            }}
          >
            {/* Font Dropdown */}
            <div className="relative group/font">
              <button
                onClick={() => setShowFontDropdown(!showFontDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 h-9 min-w-[120px] bg-white/10 hover:bg-white/20 text-gray-200 rounded-md transition-colors text-xs font-medium border border-white/5"
              >
                <span
                  className="truncate max-w-[80px]"
                  style={{ fontFamily: hoveredObject.fontFamily }}
                >
                  {hoveredObject.fontFamily || "Impact"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showFontDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showFontDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 max-h-64 overflow-y-auto bg-gray-900 border border-white/10 rounded-lg shadow-2xl custom-scrollbar z-[60] py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {GOOGLE_FONTS.map((font) => (
                    <button
                      key={font}
                      onClick={() => changeFont(font)}
                      className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:text-white hover:bg-purple-500/20 transition-colors"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-white/10 mx-1"></div>

            <button
              onClick={() => toggleStyle("bold")}
              className={`p-2 rounded-md transition-colors ${
                hoveredObject.fontWeight === "bold"
                  ? "bg-purple-500 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleStyle("italic")}
              className={`p-2 rounded-md transition-colors ${
                hoveredObject.fontStyle === "italic"
                  ? "bg-purple-500 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function CreativeGenStudio() {
  const [hasImageSelected, setHasImageSelected] = useState(false);
  const [selectedImageMeta, setSelectedImageMeta] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isAILayoutModalOpen, setIsAILayoutModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [layoutVariations, setLayoutVariations] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null); //  new state
  const [isScanning, setIsScanning] = useState(false);
  const [isImagePresent, setIsImagePresent] = useState(false);
  const fabricRef = useRef<any>(null);
  const canvasInstance = useRef<any>(null);

  const [aiInputs, setAiInputs] = useState({
    category: "",
    primaryColor: "blue",
    textColor: "white",
    platform: "instagram_story",
  });

  const showStatus = (message: string, type: "success" | "error" | "info") => {
    setStatus(message);
    setStatusType(type);
    setTimeout(() => {
      setStatus(null);
      setStatusType("info");
    }, 1500);
  };

  const handleSelectionChange = useCallback(
    (hasSelection: boolean, meta: any) => {
      // Check if the selected object is an image
      const isImage = hasSelection && meta?.type === "image";
      setHasImageSelected(isImage);
      setSelectedImageMeta(meta);

      // Check if there's at least one image on the canvas
      if (canvasInstance.current) {
        const images = canvasInstance.current
          .getObjects()
          .filter((obj: any) => obj.type === "image");
        setIsImagePresent(images.length > 0);
      }

      console.log("Selection changed:", {
        hasSelection,
        isImage,
        isImagePresent: true,
        metaType: meta?.type,
      });
    },
    []
  );

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setStatus(null);
        const reader = new FileReader();
        reader.onload = () => {
          window.dispatchEvent(
            new CustomEvent("add-image-to-canvas", {
              detail: { dataUrl: reader.result, file, name: file.name },
            })
          );
          showStatus("Image added to canvas", "success");
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddText = () => {
    window.dispatchEvent(new CustomEvent("add-text-to-canvas"));
  };

  const handleChangeFont = (fontFamily: string) => {
    window.dispatchEvent(
      new CustomEvent("change-font-on-canvas", { detail: { fontFamily } })
    );
  };

  const handleRemoveBackground = async () => {
    let targetMeta = selectedImageMeta;

    // If no image is selected, try to find the first one on the canvas
    if (!hasImageSelected && canvasInstance.current) {
      const images = canvasInstance.current
        .getObjects()
        .filter((obj: any) => obj.type === "image");
      if (images.length > 0) {
        const img = images[0];
        targetMeta = {
          type: "image",
          file: img._originalFile,
          url: img._originalUrl,
          name: img._fileName,
        };
        // Auto-select it for visual feedback
        canvasInstance.current.setActiveObject(img);
        canvasInstance.current.requestRenderAll();
        setHasImageSelected(true);
        setSelectedImageMeta(targetMeta);
      }
    }

    if (!targetMeta) {
      showStatus("Please upload an image to the canvas first", "error");
      return;
    }

    setIsProcessing(true);
    showStatus("Removing background...", "info");

    try {
      let fileToProcess = targetMeta?.file;
      if (!fileToProcess && targetMeta?.url) {
        const res = await fetch(targetMeta.url);
        const blob = await res.blob();
        fileToProcess = new File(
          [blob],
          targetMeta.name || "canvas-image.png",
          { type: blob.type || "image/png" }
        );
      }

      if (!fileToProcess)
        throw new Error("Could not access selected image file.");

      const processed = await removeBackground(fileToProcess);

      const base64Data = processed.startsWith("data:")
        ? processed.split(",")[1]
        : processed;
      const byteString = atob(base64Data);
      const arrayBuffer = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: "image/png" });
      const newFileName =
        (selectedImageMeta.name?.replace(/\.[^/.]+$/, "") || "product") +
        "-nobg.png";
      const newFile = new File([blob], newFileName, { type: "image/png" });

      window.dispatchEvent(
        new CustomEvent("replace-image-on-canvas", {
          detail: {
            dataUrl: `data:image/png;base64,${base64Data}`,
            file: newFile,
            name: newFileName,
          },
        })
      );
      showStatus("Background removed successfully!", "success");
    } catch (err) {
      showStatus(
        err instanceof Error ? err.message : "Background removal failed",
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompliance = () => {
    if (!canvasInstance.current) {
      showStatus("No canvas content to check", "error");
      return;
    }

    try {
      const canvas = canvasInstance.current;
      const objects = canvas.getObjects();

      // Extract text from textbox objects
      const textboxText = objects
        .filter((obj: any) => obj.type === "textbox" || obj.type === "text")
        .map((obj: any) => obj.text || "")
        .join(" ");

      // Extract OCR text from image objects
      const ocrText = objects
        .filter((obj: any) => obj.type === "image")
        .map((obj: any) => (obj as any)._ocrText || "")
        .join(" ");

      // Combine all text
      const allText = `${textboxText} ${ocrText}`.trim();

      if (!allText) {
        showStatus("No text found to check", "info");
        return;
      }

      // Use the dispatchCompliance helper (handles scan + dispatch)
      dispatchCompliance(allText);

      showStatus("Compliance check complete", "info");
    } catch (err) {
      console.error("Compliance check error:", err);
      showStatus("Compliance check failed", "error");
    }
  };

  const handleExport = () => {
    window.dispatchEvent(new CustomEvent("export-canvas"));
  };

  useEffect(() => {
    const onExportStarted = () =>
      showStatus("Generating high-quality PNG...", "info");
    const onExportFinished = (e: any) => {
      if (e.detail?.success) {
        showStatus("Export successful!", "success");
      } else {
        showStatus("Export failed. Please try again.", "error");
      }
    };

    window.addEventListener("export-started", onExportStarted);
    window.addEventListener(
      "export-finished",
      onExportFinished as EventListener
    );

    return () => {
      window.removeEventListener("export-started", onExportStarted);
      window.removeEventListener(
        "export-finished",
        onExportFinished as EventListener
      );
    };
  }, []);

  const handleClear = () => {
    console.log("Main: Dispatching clear-canvas event");
    window.dispatchEvent(new CustomEvent("clear-canvas"));
    setHasImageSelected(false);
    setSelectedImageMeta(null);
    setIsImagePresent(false);
    showStatus("Canvas cleared", "info");
  };

  const handleColorChange = (color: string) => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    const activeObject = canvas.getActiveObject();

    if (
      activeObject &&
      (activeObject.type === "textbox" || activeObject.type === "text")
    ) {
      activeObject.set("fill", color);
      canvas.requestRenderAll();
    } else {
      canvas.backgroundColor = color;
      canvas.requestRenderAll();
    }
  };

  const handleGenerateAILayout = () => {
    if (!isImagePresent) {
      showStatus("Please upload a product image first", "error");
      return;
    }
    setIsAILayoutModalOpen(true);
  };

  const getCanvasImageAsFile = (): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!fabricRef.current || !canvasInstance.current) {
        resolve(null);
        return;
      }

      const imageObjects = canvasInstance.current
        .getObjects()
        .filter((obj: any) => obj.type === "image");
      if (imageObjects.length === 0) {
        resolve(null);
        return;
      }

      const imgObj = imageObjects[0];
      const originalZoom = canvasInstance.current.getZoom();
      const originalWidth = canvasInstance.current.getWidth();
      const originalHeight = canvasInstance.current.getHeight();
      const originalBg = canvasInstance.current.backgroundColor;

      canvasInstance.current.setZoom(1);
      canvasInstance.current.setDimensions({ width: 1080, height: 1920 });
      canvasInstance.current.backgroundColor = "transparent";
      canvasInstance.current.renderAll();

      const imgCanvas = fabricRef.current.util.createCanvasElement();
      imgCanvas.width = Math.round(imgObj.getScaledWidth());
      imgCanvas.height = Math.round(imgObj.getScaledHeight());
      const imgCtx = imgCanvas.getContext("2d");
      if (imgCtx && imgObj._element) {
        imgCtx.drawImage(
          imgObj._element,
          0,
          0,
          imgCanvas.width,
          imgCanvas.height
        );
      }

      imgCanvas.toBlob((blob: Blob | null) => {
        canvasInstance.current.backgroundColor = originalBg;
        canvasInstance.current.setDimensions({
          width: originalWidth,
          height: originalHeight,
        });
        canvasInstance.current.setZoom(originalZoom);
        canvasInstance.current.renderAll();

        if (blob) {
          resolve(
            new File([blob], "canvas-product.png", { type: "image/png" })
          );
        } else {
          resolve(null);
        }
      }, "image/png");
    });
  };

  const handleAILayoutSubmit = async () => {
    setAiGenerating(true);

    let productFile = selectedImageMeta?.file;
    if (!productFile) {
      showStatus("Reconstructing image from canvas...", "info");
      productFile = await getCanvasImageAsFile();
      if (!productFile) {
        showStatus(
          "Could not retrieve product image. Please re-upload.",
          "error"
        );
        setAiGenerating(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("product_image", productFile);
    if (logoFile) {
      formData.append("logo_image", logoFile);
    }
    formData.append("product_name", aiInputs.category);
    formData.append("primary_color", aiInputs.primaryColor);
    formData.append("text_color", aiInputs.textColor);
    formData.append("platform", aiInputs.platform);
    formData.append("num_variations", "3");

    try {
      const response = await fetch("http://localhost:8000/generate-layout", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let msg = "Failed to generate layouts";
        try {
          const err = JSON.parse(errorText);
          msg = err.detail || msg;
        } catch {}
        throw new Error(msg);
      }

      const result = await response.json();
      setLayoutVariations(result.variations || []);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error(err);
      showStatus(
        err instanceof Error ? err.message : "Generation failed",
        "error"
      );
    } finally {
      setAiGenerating(false);
      setIsAILayoutModalOpen(false);
    }
  };

  const handleDownloadSelectedLayout = (index: number) => {
    const dataUrl = layoutVariations[index];
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `creativegen-layout-${index + 1}-${aiInputs.platform}.png`;
    a.click();
    setIsPreviewOpen(false);
    setLayoutVariations([]);
    showStatus("Layout downloaded!", "success");
  };

  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
      <Header />

      {status && (
        <div className="px-6 pt-3">
          <StatusMessage message={status} type={statusType} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          onUpload={handleUpload}
          onAddText={handleAddText}
          onChangeFont={handleChangeFont}
          onChangeColor={handleColorChange}
          onRemoveBackground={handleRemoveBackground}
          onCheckCompliance={handleCompliance}
          onExport={handleExport}
          onGenerateAILayout={handleGenerateAILayout}
          onClear={handleClear}
          hasImageSelected={hasImageSelected}
          isImagePresent={isImagePresent}
          selectedObjectType={selectedImageMeta?.type}
          isProcessing={isProcessing}
        />

        <main className="flex-1 overflow-hidden">
          <CanvasEditor
            onSelectionChange={handleSelectionChange}
            fabricRef={fabricRef}
            canvasInstance={canvasInstance}
          />
        </main>

        <aside className="w-80 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto">
          <CompliancePanel />
        </aside>
      </div>

      {/* AI Layout Input Modal */}
      {isAILayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-md p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                AI Layout Generator
              </h3>
              <button
                onClick={() => setIsAILayoutModalOpen(false)}
                className="text-gray-400 hover:text-white"
                disabled={aiGenerating} // Prevent closing during generation
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Customize your AI-generated ad layout
            </p>

            {!aiGenerating ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={aiInputs.category}
                    onChange={(e) =>
                      setAiInputs({ ...aiInputs, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    placeholder="e.g., shoes, perfume, Shampoo, Airpods"
                    disabled={aiGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-md border-2 border-gray-600 cursor-pointer transition-all hover:border-purple-400"
                        style={{ backgroundColor: aiInputs.primaryColor }}
                        onClick={() =>
                          document.getElementById("primaryColorPicker")?.click()
                        }
                        title="Click to choose color"
                      />
                      <span className="text-xs text-gray-400">
                        Click to pick
                      </span>
                    </div>

                    <input
                      id="primaryColorPicker"
                      type="color"
                      value={aiInputs.primaryColor}
                      onChange={(e) =>
                        setAiInputs({
                          ...aiInputs,
                          primaryColor: e.target.value,
                        })
                      }
                      className="w-0 h-0 opacity-0 absolute"
                      disabled={aiGenerating}
                    />

                    <input
                      type="text"
                      value={aiInputs.primaryColor}
                      onChange={(e) =>
                        setAiInputs({
                          ...aiInputs,
                          primaryColor: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      disabled={aiGenerating}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-md border-2 border-gray-600 cursor-pointer transition-all hover:border-purple-400"
                        style={{ backgroundColor: aiInputs.textColor }}
                        onClick={() =>
                          document.getElementById("textColorPicker")?.click()
                        }
                        title="Click to choose color"
                      />
                      <span className="text-xs text-gray-400">
                        Click to pick
                      </span>
                    </div>

                    <input
                      id="textColorPicker"
                      type="color"
                      value={aiInputs.textColor}
                      onChange={(e) =>
                        setAiInputs({ ...aiInputs, textColor: e.target.value })
                      }
                      className="w-0 h-0 opacity-0 absolute"
                      disabled={aiGenerating}
                    />

                    <input
                      type="text"
                      value={aiInputs.textColor}
                      onChange={(e) =>
                        setAiInputs({ ...aiInputs, textColor: e.target.value })
                      }
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                      placeholder="#ffffff"
                      disabled={aiGenerating}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Platform
                  </label>
                  <select
                    value={aiInputs.platform}
                    onChange={(e) =>
                      setAiInputs({ ...aiInputs, platform: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                    disabled={aiGenerating}
                  >
                    <option value="instagram_story">Instagram Story</option>
                    <option value="instagram_square">Instagram Square</option>
                    <option value="facebook_feed">Facebook Feed</option>
                    <option value="google_display">Google Display</option>
                  </select>
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Brand Logo (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg border border-gray-700">
                      <ImageIcon className="w-4 h-4" />
                      <span>Choose Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setLogoFile(file);
                        }}
                        className="hidden"
                        disabled={aiGenerating}
                      />
                    </label>
                    {logoFile && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {logoFile.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG with transparency recommended
                  </p>
                </div>
              </div>
            ) : (
              /* PROCESSING STATE */
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                <h3 className="text-white font-medium">
                  Generating layouts...
                </h3>
                <p className="text-gray-400 text-sm mt-1 text-center">
                  Creating 3 unique designs for "
                  {aiInputs.category || "your product"}"
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              {!aiGenerating ? (
                <>
                  <button
                    onClick={() => {
                      setIsAILayoutModalOpen(false);
                      setLogoFile(null);
                    }}
                    className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAILayoutSubmit}
                    disabled={aiGenerating}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg font-medium flex items-center gap-2"
                  >
                    Generate Layouts
                  </button>
                </>
              ) : (
                /* Disable all actions during processing */
                <button
                  disabled
                  className="px-6 py-2 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  Please wait...
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Preview Modal */}
      <LayoutPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setLayoutVariations([]);
        }}
        variations={layoutVariations}
        onDownload={handleDownloadSelectedLayout}
        isLoading={aiGenerating}
        platform={aiInputs.platform}
      />
    </div>
  );
}
