'use client';

import { Palette, Monitor } from 'lucide-react';

import ColorSelector from '@/components/color-selector';
import ThemeSelector from '@/components/theme-selector';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';


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

        <Separator className="my-6" />

        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium">Colors</h3>
          </div>
          <div className="">
            <ColorSelector />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
