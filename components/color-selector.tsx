'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const colorOptions = [
  // Default color first
  { name: 'Blue', value: '221 76% 62%', class: 'bg-[hsl(221,76%,62%)]' },
  { name: 'Red', value: '355 78% 56%', class: 'bg-[hsl(355,78%,56%)]' },
  { name: 'Rose', value: '350 89% 60%', class: 'bg-[hsl(350,89%,60%)]' },
  { name: 'Orange', value: '16 90% 50%', class: 'bg-[hsl(16,90%,50%)]' },
  { name: 'Green', value: '142 76% 36%', class: 'bg-[hsl(142,76%,36%)]' },
  { name: 'Yellow', value: '38 92% 50%', class: 'bg-[hsl(38,92%,50%)]' },
  { name: 'Violet', value: '262 80% 60%', class: 'bg-[hsl(262,80%,60%)]' }
];

export default function ColorSelector() {
  const [primaryColor, setPrimaryColor] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop based on window width
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    // Check initially
    checkIfDesktop();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfDesktop);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  // Load saved color preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      setPrimaryColor(savedColor);
      updateCssVariables(savedColor);
    } else {
      // Default to the first color if none is saved
      setPrimaryColor(colorOptions[0]?.value || '221 76% 62%');
      updateCssVariables(colorOptions[0]?.value || '221 76% 62%');
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
      parseInt(lightness || '0') + 8,
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

  return (
    <div className="space-y-3">
      <RadioGroup
        value={primaryColor}
        onValueChange={handleColorChange}
        className={
          isDesktop
            ? 'flex flex-wrap gap-3'
            : 'grid grid-cols-4 justify-items-center gap-4'
        }
      >
        {colorOptions.map((color) => {
          // Direct click handler for the color option
          const handleClick = () => {
            handleColorChange(color.value);
          };

          return (
            <div key={color.value} className="relative">
              <RadioGroupItem
                value={color.value}
                id={`color-${color.value}`}
                className={`peer sr-only`}
              />
              {isDesktop ? (
                // Desktop view: Pill-shaped buttons with color + text
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClick}
                  className={`flex h-auto items-center border-2 bg-card px-4 py-2 transition-all ${
                    primaryColor === color.value
                      ? 'border-gray-400 shadow-md'
                      : 'border-gray-200'
                  } ${isDesktop ? 'w-24' : ''}`}
                >
                  <div
                    className={`h-5 w-5 rounded-full ${color.class} mr-2 flex flex-shrink-0 items-center justify-center`}
                  >
                    {primaryColor === color.value && (
                      <Check className="h-3 w-3 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{color.name}</span>
                </Button>
              ) : (
                // Mobile view: Just the color circles
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleClick}
                  className={`flex items-center justify-center border-2 bg-card transition-all ${
                    primaryColor === color.value
                      ? 'border-gray-400 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full ${color.class} flex flex-shrink-0 items-center justify-center`}
                  >
                    {primaryColor === color.value && (
                      <Check className="h-3 w-3 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                    )}
                  </div>
                </Button>
              )}
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
