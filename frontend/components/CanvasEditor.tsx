"use client";

import { useEffect, useRef } from "react";

type CanvasEditorProps = {
  onIssuesChange: (issues: string[]) => void;
};

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;
const SAFE_MARGIN = 40;
const MIN_FONT_SIZE = 20;

export default function CanvasEditor({ onIssuesChange }: CanvasEditorProps) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<any>(null); // will hold fabric.Canvas
  const fabricRef = useRef<any>(null); // will hold the fabric module
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // init Fabric canvas with dynamic import
  useEffect(() => {
    let disposed = false;

    (async () => {
      const fabricModule = await import("fabric");
      const fabric = (fabricModule as any).fabric || fabricModule; // handle both export styles
      fabricRef.current = fabric;

      if (!canvasElRef.current || disposed) return;

      const canvas = new fabric.Canvas(canvasElRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;
    })();

    return () => {
      disposed = true;
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  const getCanvas = () => {
    const c = fabricCanvasRef.current;
    if (!c) console.warn("Canvas not ready yet");
    return c;
  };

  const getFabric = () => {
    const f = fabricRef.current;
    if (!f) console.warn("Fabric not loaded yet");
    return f;
  };

  // ---- actions ----

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fabric = getFabric();
    const canvas = getCanvas();
    if (!fabric || !canvas) return;

    const url = URL.createObjectURL(file);

    fabric.Image.fromURL(url, (img: any) => {
      if (!img) return;

      img.scaleToWidth(CANVAS_WIDTH * 0.5);
      img.set({
        left: CANVAS_WIDTH / 3,
        top: CANVAS_HEIGHT / 2,
        originX: "center",
        originY: "center",
        selectable: true,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  const handleAddText = () => {
    const fabric = getFabric();
    const canvas = getCanvas();
    if (!fabric || !canvas) return;

    const text = new fabric.Textbox("Your headline here", {
      left: (CANVAS_WIDTH * 2) / 3,
      top: CANVAS_HEIGHT * 0.3,
      originX: "center",
      originY: "center",
      fontSize: 48,
      fill: "#000000",
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const applyLayout = (layoutId: 1 | 2) => {
    const canvas = getCanvas();
    if (!canvas) return;

    const objects = canvas.getObjects();
    const product = objects.find((o: any) => o.type === "image");
    const headline = objects.find((o: any) => o.type === "textbox") as
      | any
      | undefined;

    if (!product || !headline) {
      console.warn("Need at least an image and a text object");
      return;
    }

    let layout: any;
    if (layoutId === 1) {
      layout = {
        product: { x: 0.3, y: 0.5, scale: 0.8 },
        headline: { x: 0.75, y: 0.3 },
      };
    } else {
      layout = {
        product: { x: 0.5, y: 0.45, scale: 0.9 },
        headline: { x: 0.5, y: 0.85 },
      };
    }

    product.set({
      left: CANVAS_WIDTH * layout.product.x,
      top: CANVAS_HEIGHT * layout.product.y,
      originX: "center",
      originY: "center",
    });
    product.scale(layout.product.scale);

    headline.set({
      left: CANVAS_WIDTH * layout.headline.x,
      top: CANVAS_HEIGHT * layout.headline.y,
      originX: "center",
      originY: "center",
    });

    canvas.renderAll();
  };

  const runCompliance = () => {
    const canvas = getCanvas();
    if (!canvas) return;

    const issues: string[] = [];
    const objects = canvas.getObjects();

    objects.forEach((obj: any) => {
      const bounds = obj.getBoundingRect(true, true);

      // Safe margin check
      if (
        bounds.left < SAFE_MARGIN ||
        bounds.top < SAFE_MARGIN ||
        bounds.left + bounds.width > CANVAS_WIDTH - SAFE_MARGIN ||
        bounds.top + bounds.height > CANVAS_HEIGHT - SAFE_MARGIN
      ) {
        issues.push("Element too close to edge. Maintain safe margin.");
      }

      // Text size check
      if (obj.type === "textbox") {
        const fontSize = obj.fontSize ?? 0;
        if (fontSize < MIN_FONT_SIZE) {
          issues.push(
            `Text font size ${fontSize} is below minimum ${MIN_FONT_SIZE}.`
          );
        }
      }
    });

    if (issues.length === 0) {
      issues.push("No compliance issues detected.");
    }

    onIssuesChange(issues);
  };

  const handleExport = () => {
    const canvas = getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1.0,
    });

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "creative.png";
    a.click();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          onClick={handleUploadClick}
        >
          Upload Image
        </button>
        <button
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          onClick={handleAddText}
        >
          Add Text
        </button>
        <button
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          onClick={() => applyLayout(1)}
        >
          Apply Layout 1
        </button>
        <button
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          onClick={() => applyLayout(2)}
        >
          Apply Layout 2
        </button>
        <button
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          onClick={runCompliance}
        >
          Run Compliance
        </button>
        <button
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
          onClick={handleExport}
        >
          Export PNG
        </button>
      </div>

      {/* Hidden file input for upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Canvas */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg">
        <canvas ref={canvasElRef} />
      </div>
    </div>
  );
}
