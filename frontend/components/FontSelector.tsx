import React from 'react';
import { Type } from 'lucide-react';
import { GOOGLE_FONTS } from '@/lib/fonts';

interface FontSelectorProps {
  currentFont: string;
  onFontChange: (fontFamily: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ currentFont, onFontChange }) => {
  // Strip extra quotes if present
  const cleanFont = currentFont.replace(/['"]/g, '');

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
        <Type className="w-3.5 h-3.5" />
        Font Family
      </label>
      <div className="relative">
        <select
          value={cleanFont}
          onChange={(e) => onFontChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
        >
          {GOOGLE_FONTS.map((font) => (
            <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>
              {font.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
