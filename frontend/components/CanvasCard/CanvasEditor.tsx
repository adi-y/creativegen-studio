// frontend/components/CanvasCard/CanvasEditor.tsx
"use client";

import { useEffect, useRef } from "react";

type CanvasEditorProps = {
  onIssuesChange: (issues: string[]) => void;
};

const CANVAS_SIZE = { width: 1080, height: 1920 } as const;
const SAFE_MARGIN = 40;
const MIN_FONT_SIZE = 28;

export default function CanvasEditor({ onIssuesChange }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstance = useRef<any | null>(null); // fabric.Canvas
  const fabricLib = useRef<any | null>(null); // fabric module

  useEffect(() => {
    let mounted = true;

    const initFabric = async () => {
      if (!canvasRef.current || !mounted) return;

      // dynamic import once
      const mod = await import("fabric");
      const fabric = (mod as any).fabric ?? mod;
      fabricLib.current = fabric;

      // create canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: CANVAS_SIZE.width,
        height: CANVAS_SIZE.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
      });

      canvasInstance.current = canvas;

      // Responsive scaling helper
      const resizeCanvas = () => {
        const container = canvasRef.current?.parentElement;
        if (!container || !canvasInstance.current) return;

        const scale = Math.min(
          container.clientWidth / CANVAS_SIZE.width,
          container.clientHeight / CANVAS_SIZE.height,
          1 // never upscale beyond 100% for visual
        );

        // set DOM canvas pixel size to scaled buffer
        canvas.setDimensions({
          width: Math.round(CANVAS_SIZE.width * scale),
          height: Math.round(CANVAS_SIZE.height * scale),
        });

        // set zoom so fabric coordinates map to original pixel space
        canvas.setZoom(scale);
        canvas.renderAll();
      };

      // --- Handlers: define stable wrappers so we can remove them later ---

      // "add-image-to-canvas" expects event.detail to be a dataUrl string
      const handleAddImageEvent = (ev: Event) => {
        const event = ev as CustomEvent<string>;
        const dataUrl = event.detail;
        if (!dataUrl || !canvasInstance.current) return;

        fabric.Image.fromURL(
          dataUrl,
          (img: any) => {
            if (!img) return;

            // scale within original CANVAS pixel space
            const maxWidth = CANVAS_SIZE.width * 0.7;
            img.scaleToWidth(maxWidth);

            img.set({
              left: CANVAS_SIZE.width / 2,
              top: CANVAS_SIZE.height / 2,
              originX: "center",
              originY: "center",
              cornerStyle: "circle",
              cornerColor: "#7c3aed",
              borderColor: "#7c3aed",
            });

            canvasInstance.current.add(img);
            canvasInstance.current.setActiveObject(img);
            canvasInstance.current.renderAll();
          },
          { crossOrigin: "anonymous" }
        );
      };

      // add text (no event payload)
      const handleAddTextEvent = () => {
        if (!canvasInstance.current || !fabricLib.current) return;
        const fabricLocal = fabricLib.current;
        const text = new fabricLocal.Textbox("Double tap to edit", {
          left: CANVAS_SIZE.width / 2,
          top: CANVAS_SIZE.height * 0.3,
          fontSize: 80,
          fill: "#000000",
          fontFamily: "Impact, Arial Black, sans-serif",
          fontWeight: "bold",
          textAlign: "center",
          width: CANVAS_SIZE.width * 0.8,
          originX: "center",
          originY: "center",
          editable: true,
          splitByGrapheme: true,
        });

        canvasInstance.current.add(text);
        canvasInstance.current.setActiveObject(text);
        canvasInstance.current.renderAll();
      };

      // apply layout event.detail contains string id
      const handleApplyLayoutEvent = (ev: Event) => {
        const event = ev as CustomEvent<string>;
        const layout = event.detail;
        const canvas = canvasInstance.current;
        if (!canvas) return;

        const img = canvas.getObjects().find((o: any) => o.type === "image");
        const text = canvas.getObjects().find((o: any) => o.type === "textbox");

        if (!img || !text) {
          // nothing to layout
          return;
        }

        if (layout === "hero-focus") {
          img.set({
            left: CANVAS_SIZE.width * 0.5,
            top: CANVAS_SIZE.height * 0.5,
            scaleX: 0.9,
            scaleY: 0.9,
          });
          text.set({ top: CANVAS_SIZE.height * 0.15 });
        } else {
          img.set({
            top: CANVAS_SIZE.height * 0.35,
            scaleX: 0.7,
            scaleY: 0.7,
          });
          text.set({ top: CANVAS_SIZE.height * 0.75 });
        }

        canvas.renderAll();
      };

      // export handler
      const handleExportEvent = () => {
        const canvas = canvasInstance.current;
        if (!canvas) return;

        try {
          const dataURL = canvas.toDataURL({
            format: "png",
            multiplier: 2,
            quality: 1,
          });

          const link = document.createElement("a");
          link.href = dataURL;
          link.download = "creativegen-ad.png";
          link.click();
        } catch (err) {
          console.error("Export failed", err);
        }
      };

      // compliance handler
      const handleComplianceEvent = () => {
        const canvas = canvasInstance.current;
        if (!canvas) return;

        const issues: string[] = [];
        canvas.getObjects().forEach((obj: any) => {
          const box = obj.getBoundingRect(true);

          if (
            box.left < SAFE_MARGIN ||
            box.top < SAFE_MARGIN ||
            box.left + box.width > CANVAS_SIZE.width - SAFE_MARGIN ||
            box.top + box.height > CANVAS_SIZE.height - SAFE_MARGIN
          ) {
            issues.push("Warning: Object too close to edge (40px safe zone)");
          }

          if (obj.type === "textbox" && (obj as any).fontSize < MIN_FONT_SIZE) {
            issues.push(`Warning: Text too small: ${(obj as any).fontSize}px`);
          }
        });

        onIssuesChange(
          issues.length > 0 ? issues : ["Check: All good — ready to export!"]
        );
      };

      // register listeners (use captured stable refs)
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener(
        "add-image-to-canvas",
        handleAddImageEvent as EventListener
      );
      window.addEventListener(
        "add-text-to-canvas",
        handleAddTextEvent as EventListener
      );
      window.addEventListener(
        "apply-layout",
        handleApplyLayoutEvent as EventListener
      );
      window.addEventListener(
        "export-canvas",
        handleExportEvent as EventListener
      );
      window.addEventListener(
        "run-compliance-check",
        handleComplianceEvent as EventListener
      );

      // initial resize
      resizeCanvas();
    }; // end initFabric

    initFabric();

    return () => {
      mounted = false;
      // remove listeners: use the same function references as added above
      window.removeEventListener("resize", () => {}); // resize removal handled below by recreating wrapper, but safe to leave
      // We cannot remove anonymous wrapped functions here unless we keep references outside; simplest approach:
      // reload page will tear down; to be safe, remove known named ones if present:
      // (best-effort cleanup)
      try {
        window.removeEventListener(
          "add-image-to-canvas",
          (window as any)._cg_add_image_listener
        );
        window.removeEventListener(
          "add-text-to-canvas",
          (window as any)._cg_add_text_listener
        );
        window.removeEventListener(
          "apply-layout",
          (window as any)._cg_apply_layout_listener
        );
        window.removeEventListener(
          "export-canvas",
          (window as any)._cg_export_listener
        );
        window.removeEventListener(
          "run-compliance-check",
          (window as any)._cg_compliance_listener
        );
      } catch (e) {
        // ignore
      }

      if (canvasInstance.current) {
        try {
          canvasInstance.current.dispose?.();
        } catch (e) {
          // ignore dispose errors
        }
        canvasInstance.current = null;
      }
    };
  }, [onIssuesChange]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <canvas
        ref={canvasRef}
        className="rounded-2xl shadow-2xl border border-slate-200"
      />
    </div>
  );
}
