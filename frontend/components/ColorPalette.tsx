import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';

interface ColorPaletteProps {
  onColorSelect: (color: string) => void;
  currentColor?: string;
}

// Brand color presets
const BRAND_COLORS = [
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Fuchsia', hex: '#D946EF' },
  { name: 'Orange', hex: '#F59E0B' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({ onColorSelect, currentColor }) => {
  const [customColor, setCustomColor] = useState('#8B5CF6');

  const handleColorClick = (color: string) => {
    onColorSelect(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onColorSelect(newColor);
  };

  return (
    <div className="mt-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-4 h-4 text-purple-400" />
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand Colors</h4>
      </div>

      {/* Preset Colors Grid */}
      <div className="grid grid-cols-6 gap-2">
        {BRAND_COLORS.map((color) => (
          <button
            key={color.hex}
            onClick={() => handleColorClick(color.hex)}
            className="group relative w-full aspect-square rounded-lg border-2 border-gray-600 hover:border-purple-400 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {currentColor === color.hex && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check 
                  className="w-4 h-4 drop-shadow-lg" 
                  style={{ 
                    color: color.hex === '#FFFFFF' || color.hex === '#FBBF24' ? '#000000' : '#FFFFFF' 
                  }} 
                />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Color Picker */}
      <div className="pt-3 border-t border-gray-700">
        <label className="text-xs font-medium text-gray-400 mb-2 block">Custom Color</label>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg border-2 border-gray-600 cursor-pointer hover:border-purple-400 transition-colors flex-shrink-0"
            style={{ backgroundColor: customColor }}
            onClick={() => document.getElementById('customColorInput')?.click()}
            title="Click to pick custom color"
          />
          <input
            id="customColorInput"
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-0 h-0 opacity-0 absolute"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                setCustomColor(val);
                if (val.length === 7) {
                  onColorSelect(val);
                }
              }
            }}
            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono"
            placeholder="#8B5CF6"
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 italic">
        Select an object on canvas to apply color
      </div>
    </div>
  );
};
