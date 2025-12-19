'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { removeBackground } from '@/lib/api';
// Modern Header Component
const Header = () => (
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
      <button className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 text-sm font-medium backdrop-blur-sm">
        Settings
      </button>
      <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold hover:from-purple-400 hover:to-fuchsia-400 transition-all duration-200 shadow-lg shadow-purple-500/50">
        Upload Assets
      </button>
    </div>
  </header>
);

// Tool Button Component
const ToolButton = ({ 
  icon: Icon, 
  label, 
  badge, 
  onClick, 
  variant = 'default', 
  disabled = false, 
  isLoading = false 
}: { 
  icon: React.ElementType; 
  label: string; 
  badge?: string; 
  onClick: () => void; 
  variant?: 'default' | 'primary' | 'success' | 'warning';
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  const variants = {
    default: 'bg-gray-800/70 hover:bg-gray-700 border-gray-700',
    primary: 'bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 hover:from-purple-500/20 hover:to-fuchsia-500/20 border-purple-500/30',
    success: 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 border-emerald-500/30',
    warning: 'bg-gradient-to-br from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border-orange-500/30'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 border ${variants[variant]} group disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div className="p-2 rounded-lg bg-gray-900/50 group-hover:bg-gray-900 transition-colors">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
        ) : (
          <Icon className="w-4 h-4 text-gray-300 group-hover:text-white" />
        )}
      </div>
      <span className="text-sm text-gray-200">{label}</span>
      {badge && (
        <span className="ml-auto text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md border border-purple-500/30">
          {badge}
        </span>
      )}
    </button>
  );
};

// Left Sidebar Component
const LeftSidebar = ({ 
  onUpload, 
  onAddText, 
  onRemoveBackground,
  onApplyLayout1, 
  onApplyLayout2, 
  onCheckCompliance, 
  onExport,
  onGenerateAILayout,
  hasImageSelected,
  isProcessing 
}: {
  onUpload: () => void;
  onAddText: () => void;
  onRemoveBackground: () => void;
  onApplyLayout1: () => void;
  onApplyLayout2: () => void;
  onCheckCompliance: () => void;
  onExport: () => void;
  onGenerateAILayout: () => void;
  hasImageSelected: boolean;
  isProcessing: boolean;
}) => (
  <aside className="w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/10 border-r border-gray-800 flex flex-col">
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      {/* Creative Tools Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Wand2 className="w-3.5 h-3.5" />
          Creative Tools
        </h3>
        <div className="space-y-2">
          <ToolButton icon={Upload} label="Upload Image" onClick={onUpload} variant="primary" />
          <ToolButton icon={Type} label="Add Text" onClick={onAddText} variant="default" />
          <ToolButton 
            icon={Eraser} 
            label={isProcessing ? "Removing..." : "Remove Background"} 
            variant="default" 
            badge="AI" 
            onClick={onRemoveBackground}
            disabled={!hasImageSelected}
            isLoading={isProcessing}
          />
          <ToolButton icon={Palette} label="Color Palette" variant="default" onClick={() => {}} />
        </div>
      </div>

      {/* Smart Layouts Section */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layout className="w-3.5 h-3.5" />
          Smart Layouts
        </h3>
        <div className="space-y-2">
          <ToolButton 
            icon={Layout} 
            label="Hero Focus" 
            onClick={onApplyLayout1} 
            variant="success"
            badge="Recommended"
          />
          <ToolButton icon={Grid} label="Split Grid" onClick={onApplyLayout2} variant="default" />
          <ToolButton 
            icon={Sparkles} 
            label="AI Layout Generator" 
            onClick={onGenerateAILayout}
            variant="primary"
            badge="AI"
            disabled={!hasImageSelected}
          />
        </div>
      </div>

      {/* Compliance Check */}
      <ToolButton 
        icon={Shield} 
        label="Run Compliance Check" 
        onClick={onCheckCompliance} 
        variant="warning"
      />
    </div>

    {/* Export Button */}
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

// Compliance Panel Component
const CompliancePanel = () => {
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const handler = (e: CustomEvent) => setIssues(e.detail.list || []);
    window.addEventListener("compliance-result", handler as EventListener);
    return () => window.removeEventListener("compliance-result", handler as EventListener);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Compliance Check
        </h3>
        {issues.length > 0 && (
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-md border border-orange-500/30">
            {issues.length} {issues.length === 1 ? 'Issue' : 'Issues'}
          </span>
        )}
      </div>

      {issues.length === 0 ? (
        <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-sm text-emerald-400 font-medium">All checks passed!</p>
          <p className="text-xs text-gray-500 mt-1">Your creative is compliant</p>
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-start gap-3 group hover:bg-orange-500/10 transition-colors"
            >
              <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-orange-200">{issue}</p>
                <button className="text-xs text-orange-400 hover:text-orange-300 mt-1 font-medium">
                  Fix automatically →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Status Message Component
const StatusMessage = ({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) => {
  const styles = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    error: 'border-red-500/40 bg-red-500/10 text-red-200',
    info: 'border-blue-500/40 bg-blue-500/10 text-blue-200'
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300 text-lg">Generating creative options...</p>
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
                      ? 'border-purple-500 shadow-xl shadow-purple-500/40'
                      : 'border-gray-700 hover:border-purple-400'
                  }`}
                  onClick={() => setSelected(idx)}
                >
                  <div className={`${getAspectRatioClass()} bg-gray-800 flex items-center justify-center p-2`}>
                    <img
                      src={img}
                      alt={`Layout option ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 bg-gray-900/80 flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Option {idx + 1}</span>
                    <div className="bg-purple-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                      {selected === idx ? 'Selected' : 'Select'}
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
  canvasInstance 
}: { 
  onSelectionChange: (hasSelection: boolean, meta: any) => void;
  fabricRef: React.RefObject<any>;
  canvasInstance: React.RefObject<any>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectionCallbacksRef = useRef(onSelectionChange);

  useEffect(() => {
    selectionCallbacksRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    let mounted = true;
    const initFabric = async () => {
      if (!canvasRef.current || !mounted) return;
      const mod = await import('fabric');
      const fabric = (mod as any).fabric ?? mod;
      fabricRef.current = fabric;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 1080,
        height: 1920,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
      });
      canvasInstance.current = canvas;

      const resizeCanvas = () => {
        const container = canvasRef.current?.parentElement;
        if (!container || !canvasInstance.current) return;
        const scale = Math.min(container.clientWidth / 1080, container.clientHeight / 1920, 1);
        canvas.setDimensions({ width: Math.round(1080 * scale), height: Math.round(1920 * scale) });
        canvas.setZoom(scale);
        canvas.renderAll();
      };

      canvas.on('selection:created selection:updated', (e: any) => {
        const obj = e.selected?.[0];
        if (obj?.type === 'image') {
          selectionCallbacksRef.current(true, {
            file: (obj as any)._originalFile,
            url: (obj as any)._originalUrl,
            name: (obj as any)._fileName,
          });
        } else {
          selectionCallbacksRef.current(false, null);
        }
      });

      canvas.on('selection:cleared', () => {
        selectionCallbacksRef.current(false, null);
      });

      const handleAddImage = async (ev: Event) => {
        const event = ev as CustomEvent<{ dataUrl: string; file?: File; name?: string }>;
        const { dataUrl, file, name } = event.detail;
        if (!dataUrl || !canvasInstance.current || !fabricRef.current) return;
        try {
          const FabricImage = fabricRef.current.Image;
          const isRemote = dataUrl.startsWith('http');
          const img = await FabricImage.fromURL(dataUrl, isRemote ? { crossOrigin: 'anonymous' } : undefined);
          const maxWidth = 1080 * 0.7;
          img.scaleToWidth(maxWidth);
          img.set({
            left: 1080 / 2,
            top: 1920 / 2,
            originX: 'center',
            originY: 'center',
            cornerStyle: 'circle',
            cornerColor: '#a855f7',
            borderColor: '#a855f7',
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
            file: file,
            url: dataUrl,
            name: name || file?.name,
          });
        } catch (error) {
          console.error('Error adding image:', error);
        }
      };

      const handleReplaceImage = async (ev: Event) => {
        const event = ev as CustomEvent<{ dataUrl: string; file?: File; name?: string }>;
        const { dataUrl, file, name } = event.detail;
        if (!dataUrl || !canvasInstance.current || !fabricRef.current) return;
        const activeObj = canvasInstance.current.getActiveObject();
        if (!activeObj || activeObj.type !== 'image') return;
        try {
          const FabricImage = fabricRef.current.Image;
          const isRemote = dataUrl.startsWith('http');
          const newImg = await FabricImage.fromURL(dataUrl, isRemote ? { crossOrigin: 'anonymous' } : undefined);
          newImg.set({ 
            ...activeObj.toObject(), 
            _originalFile: file || (activeObj as any)._originalFile,
            _originalUrl: dataUrl,
            _fileName: name || (activeObj as any)._fileName 
          });
          canvasInstance.current.remove(activeObj);
          canvasInstance.current.add(newImg);
          newImg.setCoords();
          canvasInstance.current.setActiveObject(newImg);
          canvasInstance.current.requestRenderAll();
        } catch (error) {
          console.error('Error replacing image:', error);
        }
      };

      const handleAddText = () => {
        if (!canvasInstance.current || !fabricRef.current) return;
        const text = new fabricRef.current.Textbox('Double tap to edit', {
          left: 1080 / 2,
          top: 1920 * 0.3,
          fontSize: 80,
          fill: '#000000',
          fontFamily: 'Impact, Arial Black, sans-serif',
          fontWeight: 'bold',
          textAlign: 'center',
          width: 1080 * 0.8,
          originX: 'center',
          originY: 'center',
          editable: true,
        });
        canvasInstance.current.add(text);
        canvasInstance.current.setActiveObject(text);
        canvasInstance.current.renderAll();
      };

      const handleExport = () => {
        if (!canvasInstance.current) return;
        try {
          const canvas = canvasInstance.current;
          const originalBg = canvas.backgroundColor;
          const originalZoom = canvas.getZoom();
          const originalWidth = canvas.getWidth();
          const originalHeight = canvas.getHeight();

          canvas.setZoom(1);
          canvas.setDimensions({ width: 1080, height: 1920 });
          canvas.backgroundColor = 'transparent';
          canvas.renderAll();

          const dataURL = canvas.toDataURL({ format: 'png', multiplier: 2, quality: 1 });

          canvas.backgroundColor = originalBg;
          canvas.setDimensions({ width: originalWidth, height: originalHeight });
          canvas.setZoom(originalZoom);
          canvas.renderAll();

          const link = document.createElement('a');
          link.href = dataURL;
          link.download = 'creativegen-ad.png';
          link.click();
        } catch (err) {
          console.error('Export failed', err);
        }
      };

      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('add-image-to-canvas', handleAddImage as EventListener);
      window.addEventListener('replace-image-on-canvas', handleReplaceImage as EventListener);
      window.addEventListener('add-text-to-canvas', handleAddText as EventListener);
      window.addEventListener('export-canvas', handleExport as EventListener);

      resizeCanvas();
    };

    initFabric();

    return () => {
      mounted = false;
      if (canvasInstance.current) {
        try { canvasInstance.current.dispose?.(); } catch {}
      }
    };
  }, [fabricRef, canvasInstance]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-purple-50 p-8">
      <div className="relative">
        <canvas ref={canvasRef} className="rounded-2xl shadow-2xl border-4 border-white" />
        <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          1080 × 1920
        </div>
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
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [isAILayoutModalOpen, setIsAILayoutModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [layoutVariations, setLayoutVariations] = useState<string[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null); //  new state
  const fabricRef = useRef<any>(null);
  const canvasInstance = useRef<any>(null);

  const [aiInputs, setAiInputs] = useState({
    category: '',
    primaryColor: 'blue',
    textColor: 'white',
    platform: 'instagram_story',
  });

  const showStatus = (message: string, type: 'success' | 'error' | 'info') => {
    setStatus(message);
    setStatusType(type);
    setTimeout(() => {
      setStatus(null);
      setStatusType('info');
    }, 3000);
  };

  const handleSelectionChange = useCallback((hasSelection: boolean, meta: any) => {
    setHasImageSelected(hasSelection);
    setSelectedImageMeta(meta);
  }, []);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setStatus(null);
        const reader = new FileReader();
        reader.onload = () => {
          window.dispatchEvent(new CustomEvent('add-image-to-canvas', { detail: { dataUrl: reader.result, file, name: file.name } }));
          showStatus('Image added to canvas', 'success');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddText = () => {
    window.dispatchEvent(new CustomEvent('add-text-to-canvas'));
  };

  const handleRemoveBackground = async () => {
    if (!hasImageSelected) {
      showStatus('Please select an image on the canvas first', 'error');
      return;
    }

    setIsProcessing(true);
    showStatus('Removing background...', 'info');

    try {
      let fileToProcess = selectedImageMeta?.file;
      if (!fileToProcess && selectedImageMeta?.url) {
        const res = await fetch(selectedImageMeta.url);
        const blob = await res.blob();
        fileToProcess = new File([blob], selectedImageMeta.name || 'canvas-image.png', { type: blob.type || 'image/png' });
      }

      if (!fileToProcess) throw new Error('Could not access selected image file.');

      const processed = await removeBackground(fileToProcess);

      const base64Data = processed.startsWith('data:') 
        ? processed.split(',')[1] 
        : processed;
      const byteString = atob(base64Data);
      const arrayBuffer = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        arrayBuffer[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], { type: 'image/png' });
      const newFileName = (selectedImageMeta.name?.replace(/\.[^/.]+$/, "") || 'product') + '-nobg.png';
      const newFile = new File([blob], newFileName, { type: 'image/png' });

      window.dispatchEvent(new CustomEvent('replace-image-on-canvas', { 
        detail: { dataUrl: `image/png;base64,${base64Data}`, file: newFile, name: newFileName } 
      }));
      showStatus('Background removed successfully!', 'success');
    } catch (err) {
      showStatus(err instanceof Error ? err.message : 'Background removal failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompliance = () => {
    window.dispatchEvent(new CustomEvent('compliance-result', {
      detail: {
        issues: 2,
        list: [
          'Text covers 34% of image (Meta limit: 20%)',
          'Contains "Lose weight fast" claim → prohibited',
        ],
      },
    }));
  };

  const handleExport = () => {
    window.dispatchEvent(new CustomEvent('export-canvas'));
  };

  const handleGenerateAILayout = () => {
    if (!hasImageSelected) {
      showStatus('Please upload and select a product image first', 'error');
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

      const imageObjects = canvasInstance.current.getObjects().filter((obj: any) => obj.type === 'image');
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
      canvasInstance.current.backgroundColor = 'transparent';
      canvasInstance.current.renderAll();

      const imgCanvas = fabricRef.current.util.createCanvasElement();
      imgCanvas.width = Math.round(imgObj.getScaledWidth());
      imgCanvas.height = Math.round(imgObj.getScaledHeight());
      const imgCtx = imgCanvas.getContext('2d');
      if (imgCtx && imgObj._element) {
        imgCtx.drawImage(imgObj._element, 0, 0, imgCanvas.width, imgCanvas.height);
      }

      imgCanvas.toBlob((blob: Blob | null) => {
        canvasInstance.current.backgroundColor = originalBg;
        canvasInstance.current.setDimensions({ width: originalWidth, height: originalHeight });
        canvasInstance.current.setZoom(originalZoom);
        canvasInstance.current.renderAll();

        if (blob) {
          resolve(new File([blob], 'canvas-product.png', { type: 'image/png' }));
        } else {
          resolve(null);
        }
      }, 'image/png');
    });
  };

  const handleAILayoutSubmit = async () => {
    setAiGenerating(true);
    setIsAILayoutModalOpen(false);

    let productFile = selectedImageMeta?.file;
    if (!productFile) {
      showStatus('Reconstructing image from canvas...', 'info');
      productFile = await getCanvasImageAsFile();
      if (!productFile) {
        showStatus('Could not retrieve product image. Please re-upload.', 'error');
        setAiGenerating(false);
        return;
      }
    }

const formData = new FormData();
formData.append('product_image', productFile);
if (logoFile) {
  formData.append('logo_image', logoFile);
}
formData.append('product_name', aiInputs.category); 
formData.append('primary_color', aiInputs.primaryColor);
formData.append('text_color', aiInputs.textColor);
formData.append('platform', aiInputs.platform);
formData.append('num_variations', '3');

    try {
      const response = await fetch('http://localhost:8000/generate-layout', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let msg = 'Failed to generate layouts';
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
      showStatus(err instanceof Error ? err.message : 'Generation failed', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleDownloadSelectedLayout = (index: number) => {
    const dataUrl = layoutVariations[index];
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `creativegen-layout-${index + 1}-${aiInputs.platform}.png`;
    a.click();
    setIsPreviewOpen(false);
    setLayoutVariations([]);
    showStatus('Layout downloaded!', 'success');
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
          onRemoveBackground={handleRemoveBackground}
          onApplyLayout1={() => {}}
          onApplyLayout2={() => {}}
          onCheckCompliance={handleCompliance}
          onExport={handleExport}
          onGenerateAILayout={handleGenerateAILayout}
          hasImageSelected={hasImageSelected}
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
              <h3 className="text-lg font-bold text-white">AI Layout Generator</h3>
              <button onClick={() => setIsAILayoutModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">Customize your AI-generated ad layout</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Product Name</label>
                <input
                  type="text"
                  value={aiInputs.category}
                  onChange={(e) => setAiInputs({ ...aiInputs, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="e.g., shoes, perfume, Shampoo, Airpods"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Primary Brand Color</label>
                <input
                  type="text"
                  value={aiInputs.primaryColor}
                  onChange={(e) => setAiInputs({ ...aiInputs, primaryColor: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="e.g., pink or #ff69b4"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Text Color</label>
                <input
                  type="text"
                  value={aiInputs.textColor}
                  onChange={(e) => setAiInputs({ ...aiInputs, textColor: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="e.g., white or #ffffff"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Platform</label>
                <select
                  value={aiInputs.platform}
                  onChange={(e) => setAiInputs({ ...aiInputs, platform: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="instagram_story">Instagram Story</option>
                  <option value="instagram_square">Instagram Square</option>
                  <option value="facebook_feed">Facebook Feed</option>
                  <option value="google_display">Google Display</option>
                </select>
              </div>

              {/* 🔹 Logo Upload */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Brand Logo (Optional)</label>
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
                    />
                  </label>
                  {logoFile && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {logoFile.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG with transparency recommended</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
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
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Generate Layouts
              </button>
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