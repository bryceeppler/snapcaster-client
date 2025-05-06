'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define our color palette options
const colorOptions = [
  { name: 'Blue', value: '221 76% 62%', class: 'bg-[hsl(221,76%,62%)]' },
  { name: 'Purple', value: '262 80% 60%', class: 'bg-[hsl(262,80%,60%)]' },
  { name: 'Green', value: '142 76% 36%', class: 'bg-[hsl(142,76%,36%)]' },
  { name: 'Red', value: '355 78% 56%', class: 'bg-[hsl(355,78%,56%)]' },
  { name: 'Orange', value: '16 90% 50%', class: 'bg-[hsl(16,90%,50%)]' },
  { name: 'Teal', value: '180 70% 40%', class: 'bg-[hsl(180,70%,40%)]' }
];

export default function ColorSelector() {
  const { theme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Load saved color preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      setPrimaryColor(savedColor);
      updateCssVariables(savedColor);
    } else {
      // Default to the first color if none is saved
      setPrimaryColor(colorOptions[0].value);
      updateCssVariables(colorOptions[0].value);
    }
  }, []);

  // Update CSS variables based on the selected color
  const updateCssVariables = (colorValue: string) => {
    const root = document.documentElement;

    // Update for light mode
    root.style.setProperty('--primary', colorValue);

    // Also update primary-light for light mode
    const [hue, saturation, lightness] = colorValue.split(' ');
    const lighterValue = `${hue} ${saturation} ${Math.min(
      parseInt(lightness) + 8,
      100
    )}%`;
    root.style.setProperty('--primary-light', lighterValue);

    // Store the selection in localStorage
    localStorage.setItem('primaryColor', colorValue);
  };

  const handleColorChange = (value: string) => {
    setPrimaryColor(value);
    updateCssVariables(value);
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!mounted) return null;

  const selectedColor = colorOptions.find((c) => c.value === primaryColor);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'h-4 w-4 rounded-full border shadow-sm transition-transform',
            selectedColor?.class
          )}
          aria-hidden="true"
        ></div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium leading-none">Theme Color</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {selectedColor?.name || 'Select a color'}
          </p>
        </div>
      </div>

      <TooltipProvider delayDuration={300}>
        <RadioGroup
          value={primaryColor}
          onValueChange={handleColorChange}
          className="flex flex-wrap gap-2"
        >
          {colorOptions.map((color) => (
            <Tooltip key={color.value}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <RadioGroupItem
                    value={color.value}
                    id={`color-${color.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`color-${color.value}`}
                    className="flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200 
                    hover:scale-110 hover:shadow-md peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-foreground peer-data-[state=checked]:ring-offset-1"
                  >
                    <div className={`h-5 w-5 rounded-full ${color.class}`} />

                    {primaryColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                      </div>
                    )}

                    <span className="sr-only">{color.name}</span>
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs font-medium">
                {color.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </RadioGroup>
      </TooltipProvider>
    </div>
  );
}
