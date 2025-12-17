import { useEffect, useRef } from "react";

type CanvasEditorProps = {
  onSelectionChange?: (hasSelection: boolean, objectType: string | null) => void;
};

const CANVAS_SIZE = { width: 1080, height: 1920 } as const;

export default function CanvasEditor({ onSelectionChange }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstance = useRef<any | null>(null);
  const fabricLib = useRef<any | null>(null);
  const pendingImages = useRef<string[]>([]);

  // helper to add image using current fabric & canvas refs
  const addImageFromDataUrl = (dataUrl?: string) => {
    const fabric = fabricLib.current;
    const canvas = canvasInstance.current;
    if (!fabric || !canvas || !dataUrl) {
      console.warn('addImageFromDataUrl: missing fabric, canvas or dataUrl');
      return;
    }

    fabric.Image.fromURL(
      dataUrl,
      (img: any) => {
        if (!img) {
          console.error('❌ Failed to create image from URL');
          return;
        }

        // Scale to fit canvas
        const maxWidth = CANVAS_SIZE.width * 0.7;
        img.scaleToWidth(maxWidth);

        img.set({
          left: CANVAS_SIZE.width / 2,
          top: CANVAS_SIZE.height / 2,
          originX: 'center',
          originY: 'center',
          cornerStyle: 'circle',
          cornerColor: '#a855f7',
          borderColor: '#a855f7',
          transparentCorners: false,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();

        console.log('✅ Image added to canvas');
      },
      { crossOrigin: 'anonymous' }
    );
  };

  // event handlers that use refs so we can attach/remove reliably
  const earlyAddImageHandler = (ev: Event) => {
    const event = ev as CustomEvent<string>;
    const dataUrl = event?.detail;
    if (!dataUrl) return;
    // buffer if canvas isn't ready
    if (!canvasInstance.current || !fabricLib.current) {
      pendingImages.current.push(dataUrl);
      console.log('⏳ Buffered incoming image (canvas not ready yet)');
    } else {
      addImageFromDataUrl(dataUrl);
    }
  };

  const handleAddImage = (ev: Event) => {
    const event = ev as CustomEvent<string>;
    addImageFromDataUrl(event.detail);
  };

  const handleReplaceImage = (ev: Event) => {
    const event = ev as CustomEvent<string>;
    const dataUrl = event.detail;
    const canvas = canvasInstance.current;
    const fabric = fabricLib.current;
    if (!canvas || !fabric) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj || activeObj.type !== 'image') {
      console.log('⚠️ No image selected to replace');
      return;
    }

    console.log('🔄 Replacing selected image...');

    fabric.Image.fromURL(
      dataUrl,
      (newImg: any) => {
        if (!newImg) {
          console.error('❌ Failed to create replacement image');
          return;
        }

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

        canvas.remove(activeObj);
        canvas.add(newImg);
        canvas.setActiveObject(newImg);
        canvas.renderAll();

        console.log('✅ Image replaced successfully');
      },
      { crossOrigin: 'anonymous' }
    );
  };

  const handleAddText = () => {
    const canvas = canvasInstance.current;
    const fabric = fabricLib.current;
    if (!canvas || !fabric) return;

    console.log('📝 Adding text to canvas...');

    const text = new fabric.Textbox('Double tap to edit', {
      left: CANVAS_SIZE.width / 2,
      top: CANVAS_SIZE.height * 0.3,
      fontSize: 80,
      fill: '#000000',
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontWeight: 'bold',
      textAlign: 'center',
      width: CANVAS_SIZE.width * 0.8,
      originX: 'center',
      originY: 'center',
      editable: true,
      splitByGrapheme: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    console.log('✅ Text added');
  };

  const handleExport = () => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    try {
      const dataURL = canvas.toDataURL({
        format: 'png',
        multiplier: 2,
        quality: 1,
      });

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `creativegen-ad-${Date.now()}.png`;
      link.click();

      console.log('✅ Export successful');
    } catch (err) {
      console.error('❌ Export failed', err);
    }
  };

  const resizeCanvas = () => {
    const container = canvasRef.current?.parentElement;
    const canvas = canvasInstance.current;
    if (!container || !canvas) return;

    const scale = Math.min(
      container.clientWidth / CANVAS_SIZE.width,
      container.clientHeight / CANVAS_SIZE.height,
      1
    );

    canvas.setDimensions({
      width: Math.round(CANVAS_SIZE.width * scale),
      height: Math.round(CANVAS_SIZE.height * scale),
    });

    canvas.setZoom(scale);
    canvas.renderAll();
  };

  useEffect(() => {
    let mounted = true;

    // attach early listener to buffer events dispatched before Fabric is ready
    window.addEventListener('add-image-to-canvas', earlyAddImageHandler as EventListener);

    const initFabric = async () => {
      if (!canvasRef.current || !mounted) return;

      try {
        // Dynamic import of fabric
        const mod = await import("fabric");
        const fabric = (mod as any).fabric ?? mod;
        fabricLib.current = fabric;

        console.log('🎨 Initializing Fabric.js canvas...');

        // Create canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: CANVAS_SIZE.width,
          height: CANVAS_SIZE.height,
          backgroundColor: "#ffffff",
          preserveObjectStacking: true,
        });

        canvasInstance.current = canvas;
        console.log('✅ Canvas initialized');

        // Selection tracking
        canvas.on('selection:created', (e: any) => {
          const obj = e.selected?.[0];
          if (onSelectionChange) {
            onSelectionChange(true, obj?.type || null);
          }
          console.log('✓ Object selected:', obj?.type);
        });

        canvas.on('selection:updated', (e: any) => {
          const obj = e.selected?.[0];
          if (onSelectionChange) {
            onSelectionChange(true, obj?.type || null);
          }
        });

        canvas.on('selection:cleared', () => {
          if (onSelectionChange) {
            onSelectionChange(false, null);
          }
          console.log('✓ Selection cleared');
        });

        // Register event listeners
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('add-image-to-canvas', handleAddImage as EventListener);
        window.addEventListener('replace-image-on-canvas', handleReplaceImage as EventListener);
        window.addEventListener('add-text-to-canvas', handleAddText as EventListener);
        window.addEventListener('export-canvas', handleExport as EventListener);

        // Initial resize
        resizeCanvas();

        // process any buffered images that arrived early
        if (pendingImages.current.length > 0) {
          pendingImages.current.forEach((url) => addImageFromDataUrl(url));
          pendingImages.current = [];
        }

        console.log('✅ Canvas ready');
      } catch (error) {
        console.error('❌ Failed to initialize canvas:', error);
      }
    };

    initFabric();

    return () => {
      mounted = false;
      window.removeEventListener('add-image-to-canvas', earlyAddImageHandler as EventListener);
      window.removeEventListener('resize', resizeCanvas as EventListener);
      window.removeEventListener('add-image-to-canvas', handleAddImage as EventListener);
      window.removeEventListener('replace-image-on-canvas', handleReplaceImage as EventListener);
      window.removeEventListener('add-text-to-canvas', handleAddText as EventListener);
      window.removeEventListener('export-canvas', handleExport as EventListener);

      if (canvasInstance.current) {
        try {
          canvasInstance.current.dispose?.();
        } catch (e) {
          console.error('Canvas disposal error:', e);
        }
        canvasInstance.current = null;
      }
    };
  }, [onSelectionChange]);

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
}