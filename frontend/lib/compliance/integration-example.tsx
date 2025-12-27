// Example integration for CanvasCard.tsx
// This shows how to integrate compliance scanning into canvas text changes

import { useEffect, useRef } from "react";
import { dispatchCompliance } from "@/lib/compliance/scanner";

// Debounce helper
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Example Component Integration
export function CanvasCardExample() {
  const debouncedScanRef = useRef(
    debounce((text: string) => {
      dispatchCompliance(text);
    }, 400)
  );

  const handleCanvasChange = (text: string) => {
    // Trigger debounced compliance scan
    debouncedScanRef.current(text);
  };

  // Example: listening to canvas text updates
  useEffect(() => {
    const handleTextUpdate = (e: CustomEvent<{ text: string }>) => {
      handleCanvasChange(e.detail.text);
    };

    window.addEventListener("canvas-text-updated", handleTextUpdate as EventListener);
    
    return () => {
      window.removeEventListener("canvas-text-updated", handleTextUpdate as EventListener);
    };
  }, []);

  return null; // This is just an example
}

// ============================================
// INTEGRATION PATTERN FOR EXISTING CANVAS
// ============================================

/*
In your existing CanvasCard or page.tsx, add this:

1. Import:
   import { dispatchCompliance } from "@/lib/compliance/scanner";

2. Create debounced scanner:
   const debouncedScan = useRef(
     debounce((text: string) => {
       dispatchCompliance(text);
     }, 400)
   );

3. On text change (e.g., Fabric.js text:changed event):
   canvas.on('text:changed', (e) => {
     const obj = e.target;
     if (obj?.type === 'textbox' || obj?.type === 'text') {
       // Extract all text from canvas
       const allText = canvas.getObjects()
         .filter(o => o.type === 'textbox' || o.type === 'text')
         .map(o => o.text || '')
         .join(' ');
       
       debouncedScan.current(allText);
     }
   });

4. CompliancePanel will automatically receive and display the results!
*/
