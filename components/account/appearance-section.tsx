'use client';

import { Monitor, Palette } from 'lucide-react';

import ThemeSelector from '@/components/theme-selector';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export function AppearanceSection() {
  return (
    <Card className="duration-500 animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Palette className="h-6 w-6 text-primary" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how the application looks on your device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium">Display</h3>
          </div>
          <div className="">
            <ThemeSelector />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
