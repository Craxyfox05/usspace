import React, { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import Image from "next/image";

type DoodleStyleType = 'classic' | 'minimal' | 'playful';

const DOODLE_STYLES = [
  { id: "classic" as DoodleStyleType, label: "Classic", icons: ["❤️", "🧸", "💌"] },
  { id: "minimal" as DoodleStyleType, label: "Minimal", icons: ["🤍", "📎", "📱"] },
  { id: "playful" as DoodleStyleType, label: "Playful", icons: ["🎮", "🎯", "🎪"] },
];

const ACCENT_COLORS = [
  { id: "red", color: "bg-red-500", hex: "#e11d48" },
  { id: "pink", color: "bg-pink-500", hex: "#ec4899" },
  { id: "purple", color: "bg-purple-500", hex: "#a855f7" },
  { id: "blue", color: "bg-blue-500", hex: "#3b82f6" },
  { id: "green", color: "bg-green-500", hex: "#22c55e" },
];

const DOODLE_PREVIEWS = {
  classic: "/doodles/classic1.svg",
  minimal: "/doodles/minimal1.svg",
  playful: "/doodles/playful1.svg",
};

export default function ThemeSelector() {
  const { themes, currentTheme, setCurrentTheme, addTheme } = useStore();
  const currentThemeObject = themes.find(t => t.id === currentTheme) || themes[0];
  
  // Initialize state with current theme values
  const [selectedStyle, setSelectedStyle] = useState<DoodleStyleType>(currentThemeObject.doodleStyle);
  const [selectedColor, setSelectedColor] = useState("red"); // Default
  const [previewTheme, setPreviewTheme] = useState(false);
  
  // Set the initial color based on the current theme's primaryColor
  useEffect(() => {
    const colorMatch = ACCENT_COLORS.find(c => c.hex === currentThemeObject.primaryColor);
    if (colorMatch) {
      setSelectedColor(colorMatch.id);
    }
  }, [currentTheme, currentThemeObject.primaryColor]);

  // Apply theme immediately when selecting style or color
  useEffect(() => {
    if (previewTheme) {
      applyTheme(false);
    }
  }, [selectedStyle, selectedColor, previewTheme]);

  const applyTheme = (showToast = true) => {
    // Determine the primary and secondary colors based on the selected color
    const selectedColorObj = ACCENT_COLORS.find(c => c.id === selectedColor) || ACCENT_COLORS[0];
    const primaryColor = selectedColorObj.hex;
    
    // Generate secondary color (lighter shade)
    let secondaryColor;
    switch(selectedColor) {
      case "red": secondaryColor = "#f9a8d4"; break; // Pink-300
      case "pink": secondaryColor = "#fbcfe8"; break; // Pink-200
      case "purple": secondaryColor = "#c4b5fd"; break; // Purple-300
      case "blue": secondaryColor = "#bfdbfe"; break; // Blue-200
      case "green": secondaryColor = "#bbf7d0"; break; // Green-200
      default: secondaryColor = "#f9a8d4"; // Default pink
    }
    
    // Create a new theme by combining current theme name with selected style and color
    const newThemeName = `${selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)} ${selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}`;
    
    // Create a unique ID for the new theme
    const newThemeId = `${selectedStyle}-${selectedColor}`;
    
    // Check if this theme already exists
    const existingTheme = themes.find(t => t.id === newThemeId);
    
    if (existingTheme) {
      // Use existing theme
      setCurrentTheme(existingTheme.id);
      if (showToast) {
        toast.success(`Theme updated to ${existingTheme.name}`);
      }
    } else {
      // Create and add new theme
      addTheme({
        name: newThemeName,
        primaryColor,
        secondaryColor,
        doodleStyle: selectedStyle,
      });
      
      // Set the new theme as current
      setCurrentTheme(newThemeId);
      if (showToast) {
        toast.success(`New theme "${newThemeName}" created and applied!`);
      }
    }
  };

  const handleSave = () => {
    applyTheme(true);
  };
  
  // Toggle theme preview
  const togglePreview = () => {
    setPreviewTheme(!previewTheme);
    if (!previewTheme) {
      // When enabling preview, apply theme immediately
      applyTheme(false);
    } else {
      // When disabling preview, revert to original theme
      setCurrentTheme(currentTheme);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-bold mb-6">Doodle Theme</h2>
      
      <div className="mb-6">
        <label className="relative inline-flex items-center cursor-pointer mb-4">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={previewTheme}
            onChange={togglePreview}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">Live Preview</span>
        </label>
      </div>
      
      <div className="mb-8">
        <div className="mb-2 font-semibold">Doodle Style</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DOODLE_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelectedStyle(style.id)}
              className={`border rounded-lg p-4 flex flex-col items-center transition-all
                ${selectedStyle === style.id
                  ? "ring-2 ring-red-500 bg-red-50 border-red-400"
                  : "bg-white border-gray-200 hover:bg-gray-50"}
              `}
            >
              <div className="font-semibold mb-2">{style.label}</div>
              <div className="flex space-x-2 text-2xl">
                {style.icons.map((icon) => (
                  <span key={icon}>{icon}</span>
                ))}
              </div>
              <div className="mt-2 h-12 w-12 relative overflow-hidden">
                <Image 
                  src={DOODLE_PREVIEWS[style.id]}
                  alt={`${style.label} preview`}
                  width={48}
                  height={48}
                  className={`object-contain ${style.id === 'minimal' ? 'opacity-40' : style.id === 'playful' ? 'opacity-80' : 'opacity-70'}`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <div className="mb-2 font-semibold">Accent Color</div>
        <div className="flex space-x-4">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedColor(c.id)}
              className={`w-10 h-10 rounded-full border-2 transition-all
                ${selectedColor === c.id
                  ? "ring-2 ring-red-500 border-red-500"
                  : "border-gray-200"}
                ${c.color}
              `}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-4 text-sm text-gray-500">
        {previewTheme ? (
          <p>Theme preview active: <strong>{selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)} {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}</strong></p>
        ) : (
          <p>Current theme: <strong>{currentThemeObject.name}</strong> ({currentThemeObject.doodleStyle})</p>
        )}
      </div>
      
      <button
        onClick={handleSave}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition"
      >
        Save Theme
      </button>
    </div>
  );
} 