'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Type, Layout, Grid, Shield, Download, Sparkles, Check, AlertCircle, Image, Palette, Wand2, Eraser, Loader2 } from 'lucide-react';
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
const ToolButton = ({ icon: Icon, label, badge, onClick, variant = 'default', disabled = false, isLoading = false }: { 
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

// Canvas Editor Component - FIXED
const CanvasEditor = ({ onSelectionChange }: { onSelectionChange: (hasSelection: boolean, meta: any) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any | null>(null);
  const canvasInstance = useRef<any>(null);
  const selectionCallbacksRef = useRef<(hasSelection: boolean, meta: any) => void>(onSelectionChange);

  // Update ref when prop changes (no effect re-run)
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

        const scale = Math.min(
          container.clientWidth / 1080,
          container.clientHeight / 1920,
          1
        );

        canvas.setDimensions({
          width: Math.round(1080 * scale),
          height: Math.round(1920 * scale),
        });

        canvas.setZoom(scale);
        canvas.renderAll();
      };

      // Selection handlers - FIXED: Use ref instead of prop
      canvas.on('selection:created', (e: any) => {
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

      canvas.on('selection:updated', (e: any) => {
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

      // Event Handlers
      const handleAddImage = async (ev: Event) => {
        const event = ev as CustomEvent<{ dataUrl: string; file?: File; name?: string }>;
        const { dataUrl, file, name } = event.detail;
        if (!dataUrl || !canvasInstance.current || !fabricRef.current) return;

        try {
          const FabricImage = fabricRef.current.Image;
          const isRemote = dataUrl.startsWith('http');

          const img = await FabricImage.fromURL(
            dataUrl,
            isRemote ? { crossOrigin: 'anonymous' } : undefined
          );

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
          img.setCoords(); // FIXED: Ensure proper rendering bounds
          canvasInstance.current.setActiveObject(img);
          canvasInstance.current.requestRenderAll(); // FIXED: Force async render
        } catch (error) {
          console.error('Error adding image:', error);
        }
      };

      const handleReplaceImage = async (ev: Event) => {
        const event = ev as CustomEvent<string>;
        const newDataUrl = event.detail;
        if (!newDataUrl || !canvasInstance.current || !fabricRef.current) return;

        const activeObj = canvasInstance.current.getActiveObject();
        if (!activeObj || activeObj.type !== 'image') return;

        try {
          const FabricImage = fabricRef.current.Image;
          const isRemote = newDataUrl.startsWith('http');

          const newImg = await FabricImage.fromURL(
            newDataUrl,
            isRemote ? { crossOrigin: 'anonymous' } : undefined
          );

          newImg.set({
            left: activeObj.left,
            top: activeObj.top,
            scaleX: activeObj.scaleX,
            scaleY: activeObj.scaleY,
            angle: activeObj.angle,
            originX: activeObj.originX,
            originY: activeObj.originY,
            cornerStyle: 'circle',
            cornerColor: '#a855f7',
            borderColor: '#a855f7',
            transparentCorners: false,
          });

          (newImg as any)._originalFile = (activeObj as any)._originalFile;
          (newImg as any)._originalUrl = newDataUrl;
          (newImg as any)._fileName = (activeObj as any)._fileName;

          canvasInstance.current.remove(activeObj);
          canvasInstance.current.add(newImg);
          newImg.setCoords(); // FIXED: Ensure proper rendering bounds
          canvasInstance.current.setActiveObject(newImg);
          canvasInstance.current.requestRenderAll(); // FIXED: Force async render
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
      
          // Save current visual state
          const originalBg = canvas.backgroundColor;
          const originalZoom = canvas.getZoom();
          const originalWidth = canvas.getWidth();
          const originalHeight = canvas.getHeight();
      
          // Reset to design resolution
          canvas.setZoom(1);
          canvas.setDimensions({ width: 1080, height: 1920 });
      
          // Transparent background for export
          canvas.backgroundColor = 'transparent';
          canvas.renderAll();
      
          const dataURL = canvas.toDataURL({
            format: 'png',
            multiplier: 2, // keep if you want 2x 1080x1920, or set to 1 for exact size
            quality: 1,
          });
      
          // Restore original state
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
        try {
          canvasInstance.current.dispose?.();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []); // FIXED: Empty deps - no re-init!

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-purple-50 p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-2xl shadow-2xl border-4 border-white"
        />
        <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          1080 × 1920
        </div>
      </div>
    </div>
  );
};

// Main App Component - FIXED
export default function CreativeGenStudio() {
  const [hasImageSelected, setHasImageSelected] = useState(false);
  const [selectedImageMeta, setSelectedImageMeta] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const showStatus = (message: string, type: 'success' | 'error' | 'info') => {
    setStatus(message);
    setStatusType(type);
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setStatus(null);
      setStatusType('info');
    }, 3000);
  };

  // FIXED: Stable callback with useCallback
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
          const dataUrl = reader.result as string;
          window.dispatchEvent(
            new CustomEvent('add-image-to-canvas', { 
              detail: { dataUrl, file, name: file.name } 
            })
          );
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
      
      // If no file, fetch from URL
      if (!fileToProcess && selectedImageMeta?.url) {
        const res = await fetch(selectedImageMeta.url);
        const blob = await res.blob();
        fileToProcess = new File(
          [blob], 
          selectedImageMeta.name || 'canvas-image.png', 
          { type: blob.type || 'image/png' }
        );
      }

      if (!fileToProcess) {
        throw new Error('Could not access selected image file.');
      }

      // Call the API
      const processed = await removeBackground(fileToProcess);
      const normalized = processed.startsWith('data:') 
        ? processed 
        : `data:image/png;base64,${processed}`;

      // Replace image on canvas
      window.dispatchEvent(
        new CustomEvent('replace-image-on-canvas', { detail: normalized })
      );

      showStatus('Background removed successfully!', 'success');
    } catch (err) {
      showStatus(err instanceof Error ? err.message : 'Background removal failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompliance = () => {
    window.dispatchEvent(
      new CustomEvent('compliance-result', {
        detail: {
          issues: 2,
          list: [
            'Text covers 34% of image (Meta limit: 20%)',
            'Contains "Lose weight fast" claim → prohibited',
          ],
        },
      })
    );
  };

  const handleExport = () => {
    window.dispatchEvent(new CustomEvent('export-canvas'));
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
          hasImageSelected={hasImageSelected}
          isProcessing={isProcessing}
        />

        <main className="flex-1 overflow-hidden">
          <CanvasEditor onSelectionChange={handleSelectionChange} />
        </main>

        <aside className="w-80 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto">
          <CompliancePanel />
        </aside>
      </div>
    </div>
  );
}
