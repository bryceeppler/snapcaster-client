'use client';

import * as React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure no hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'h-4 w-4 rounded-md border shadow-sm transition-transform',
            theme === 'dark'
              ? 'bg-slate-900'
              : theme === 'light'
              ? 'bg-slate-100'
              : 'bg-slate-500'
          )}
          aria-hidden="true"
        ></div>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium leading-none">Display Mode</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System'}
          </p>
        </div>
      </div>

      <RadioGroup
        value={theme}
        onValueChange={setTheme}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <div>
          <RadioGroupItem
            value="light"
            id="theme-light"
            className="peer sr-only"
          />
          <Label
            htmlFor="theme-light"
            className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 transition-all hover:scale-[1.02] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Sun className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Light</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem
            value="dark"
            id="theme-dark"
            className="peer sr-only"
          />
          <Label
            htmlFor="theme-dark"
            className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 transition-all hover:scale-[1.02] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Moon className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Dark</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem
            value="system"
            id="theme-system"
            className="peer sr-only"
          />
          <Label
            htmlFor="theme-system"
            className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 transition-all hover:scale-[1.02] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Laptop className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">System</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
