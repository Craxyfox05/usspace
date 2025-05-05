"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore, PageTheme } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Predefined themes
const PREDEFINED_THEMES = [
  { name: "Rose", primary: "#e11d48", secondary: "#fb7185", isGradient: true },
  { name: "Amber", primary: "#f59e0b", secondary: "#fbbf24", isGradient: true },
  { name: "Light Pink", primary: "#ec4899", secondary: "#f9a8d4", isGradient: true },
  { name: "Light Blue", primary: "#3b82f6", secondary: "#93c5fd", isGradient: true },
  { name: "Gradient Sunset", primary: "#f97316", secondary: "#ec4899", isGradient: true },
];

// Routes with pages
const ROUTES = [
  { path: "/couples", name: "Dashboard" },
  { path: "/memories", name: "Memories" },
  { path: "/events", name: "Events" },
  { path: "/listen-together", name: "Listen Together" },
  { path: "/chat", name: "Chat" },
  { path: "/games", name: "Games" },
];

const PageThemeSelector = () => {
  const { pageThemes, addPageTheme, deletePageTheme, getPageTheme } = useStore();
  const pathname = usePathname();
  
  // State for the current route being configured
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0].path);
  
  // State for theme configuration
  const [themeType, setThemeType] = useState<"predefined" | "custom">("predefined");
  const [selectedPredefinedTheme, setSelectedPredefinedTheme] = useState("Rose");
  const [customPrimaryColor, setCustomPrimaryColor] = useState("#e11d48");
  const [customSecondaryColor, setCustomSecondaryColor] = useState("#fb7185");
  const [isGradient, setIsGradient] = useState(true);
  const [customCssInput, setCustomCssInput] = useState("");
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  
  // Preview state
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});
  
  // Load existing theme for the selected route
  useEffect(() => {
    const existingTheme = getPageTheme(selectedRoute);
    if (existingTheme) {
      // If the existing theme matches a predefined one, select it
      const matchingPredefined = PREDEFINED_THEMES.find(
        t => t.primary === existingTheme.primaryColor && 
             t.secondary === existingTheme.secondaryColor
      );
      
      if (matchingPredefined) {
        setThemeType("predefined");
        setSelectedPredefinedTheme(matchingPredefined.name);
      } else {
        setThemeType("custom");
        setCustomPrimaryColor(existingTheme.primaryColor);
        setCustomSecondaryColor(existingTheme.secondaryColor || "");
        setIsGradient(existingTheme.isGradient || false);
        
        // Try to reconstruct custom CSS
        if (existingTheme.isGradient) {
          setCustomCssInput(`linear-gradient(to right, ${existingTheme.primaryColor}, ${existingTheme.secondaryColor})`);
        } else {
          setCustomCssInput(existingTheme.primaryColor);
        }
      }
    } else {
      // Reset to defaults if no theme exists for this route
      setThemeType("predefined");
      setSelectedPredefinedTheme("Rose");
      setCustomPrimaryColor("#e11d48");
      setCustomSecondaryColor("#fb7185");
      setIsGradient(true);
      setCustomCssInput("");
    }
  }, [selectedRoute, getPageTheme]);
  
  // Update preview when settings change
  useEffect(() => {
    if (themeType === "predefined") {
      const theme = PREDEFINED_THEMES.find(t => t.name === selectedPredefinedTheme);
      if (theme) {
        if (theme.isGradient) {
          setPreviewStyle({
            background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
          });
        } else {
          setPreviewStyle({
            background: theme.primary,
          });
        }
      }
    } else if (themeType === "custom") {
      if (customCssInput) {
        try {
          // Check if it's a valid color or CSS value
          if (customCssInput.startsWith('#') || 
              customCssInput.startsWith('rgb') || 
              customCssInput.startsWith('hsl') ||
              CSS.supports('color', customCssInput)) {
            setPreviewStyle({ background: customCssInput });
          } else if (customCssInput.includes('gradient')) {
            setPreviewStyle({ background: customCssInput });
          } else {
            // Invalid CSS - fallback to selected colors
            updatePreviewFromSelectedColors();
          }
        } catch (e) {
          updatePreviewFromSelectedColors();
        }
      } else {
        updatePreviewFromSelectedColors();
      }
    }
  }, [themeType, selectedPredefinedTheme, customPrimaryColor, customSecondaryColor, isGradient, customCssInput]);
  
  const updatePreviewFromSelectedColors = () => {
    if (isGradient && customSecondaryColor) {
      setPreviewStyle({
        background: `linear-gradient(to right, ${customPrimaryColor}, ${customSecondaryColor})`,
      });
    } else {
      setPreviewStyle({
        background: customPrimaryColor,
      });
    }
  };
  
  const handleSaveTheme = () => {
    const pageTheme: PageTheme = {
      route: selectedRoute,
      themeName: themeType === "predefined" ? selectedPredefinedTheme : "Custom",
      primaryColor: themeType === "predefined" 
        ? PREDEFINED_THEMES.find(t => t.name === selectedPredefinedTheme)?.primary || "#e11d48"
        : customPrimaryColor,
      secondaryColor: themeType === "predefined"
        ? PREDEFINED_THEMES.find(t => t.name === selectedPredefinedTheme)?.secondary 
        : customSecondaryColor,
      isGradient: themeType === "predefined"
        ? PREDEFINED_THEMES.find(t => t.name === selectedPredefinedTheme)?.isGradient || false
        : isGradient
    };
    
    addPageTheme(pageTheme);
    toast.success(`Theme saved for ${ROUTES.find(r => r.path === selectedRoute)?.name || selectedRoute}`);
  };
  
  const handleResetTheme = () => {
    deletePageTheme(selectedRoute);
    setSelectedPredefinedTheme("Rose");
    setCustomPrimaryColor("#e11d48");
    setCustomSecondaryColor("#fb7185");
    setIsGradient(true);
    setCustomCssInput("");
    toast.success(`Theme reset for ${ROUTES.find(r => r.path === selectedRoute)?.name || selectedRoute}`);
  };
  
  const handleCustomCssChange = (value: string) => {
    setCustomCssInput(value);
    
    // Try to extract colors if it's a linear gradient
    if (value.includes("linear-gradient")) {
      const colorMatch = value.match(/linear-gradient\(to .+?, (.+?), (.+?)\)/);
      if (colorMatch && colorMatch.length === 3) {
        setCustomPrimaryColor(colorMatch[1]);
        setCustomSecondaryColor(colorMatch[2]);
        setIsGradient(true);
      }
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>Select Page</Label>
        <Select 
          value={selectedRoute}
          onValueChange={setSelectedRoute}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            {ROUTES.map((route) => (
              <SelectItem key={route.path} value={route.path}>
                {route.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <Label>Theme Type</Label>
        <RadioGroup 
          value={themeType} 
          onValueChange={(value) => setThemeType(value as "predefined" | "custom")}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="predefined" id="predefined" />
            <Label htmlFor="predefined">Predefined Theme</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Custom Theme</Label>
          </div>
        </RadioGroup>
      </div>
      
      {themeType === "predefined" ? (
        <div className="space-y-4">
          <Label>Predefined Theme</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PREDEFINED_THEMES.map((theme) => (
              <div 
                key={theme.name}
                onClick={() => setSelectedPredefinedTheme(theme.name)}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPredefinedTheme === theme.name 
                  ? "border-rose-500 ring-2 ring-rose-300" 
                  : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div 
                  className="h-20 w-full"
                  style={{
                    background: theme.isGradient
                      ? `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`
                      : theme.primary
                  }}
                />
                <div className="p-2 text-center text-sm font-medium">
                  {theme.name}
                  {selectedPredefinedTheme === theme.name && (
                    <Check className="h-4 w-4 inline-block ml-1 text-rose-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Custom Theme</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-10 w-10 rounded border cursor-pointer"
                    style={{ backgroundColor: customPrimaryColor }}
                    onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
                  />
                  <Input 
                    value={customPrimaryColor}
                    onChange={(e) => setCustomPrimaryColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                {showPrimaryPicker && (
                  <div className="mt-2">
                    <HexColorPicker 
                      color={customPrimaryColor}
                      onChange={setCustomPrimaryColor}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Secondary Color (for gradient)</Label>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="isGradient"
                      checked={isGradient}
                      onChange={(e) => setIsGradient(e.target.checked)}
                      className="mr-2"
                    />
                    <Label htmlFor="isGradient" className="text-sm font-normal">Use Gradient</Label>
                  </div>
                </div>
                
                {isGradient && (
                  <>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-10 w-10 rounded border cursor-pointer"
                        style={{ backgroundColor: customSecondaryColor }}
                        onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
                      />
                      <Input 
                        value={customSecondaryColor}
                        onChange={(e) => setCustomSecondaryColor(e.target.value)}
                        className="flex-1"
                        disabled={!isGradient}
                      />
                    </div>
                    {showSecondaryPicker && (
                      <div className="mt-2">
                        <HexColorPicker 
                          color={customSecondaryColor}
                          onChange={setCustomSecondaryColor}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Custom CSS (Optional)</Label>
            <Input 
              value={customCssInput}
              onChange={(e) => handleCustomCssChange(e.target.value)}
              placeholder="e.g. #ff99cc or linear-gradient(to right, #ff7e5f, #feb47b)"
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Enter a valid CSS color or gradient string
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Preview</Label>
        <div className="h-40 rounded-lg overflow-hidden" style={previewStyle}>
          <div className="h-full w-full flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-white font-semibold text-shadow">
              {ROUTES.find(r => r.path === selectedRoute)?.name || "Preview"}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handleResetTheme}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset to Default
        </Button>
        
        <Button onClick={handleSaveTheme}>
          Save Theme
        </Button>
      </div>
      
      <style jsx global>{`
        .text-shadow {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default PageThemeSelector; 