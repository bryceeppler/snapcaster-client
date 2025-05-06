'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import ThemeSelector from '@/components/theme-selector';
import ColorSelector from '@/components/color-selector';
import { Separator } from '@/components/ui/separator';

export function AppearanceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks on your device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <ThemeSelector />
        </div>

        <Separator />

        <div>
          <ColorSelector />
        </div>
      </CardContent>
    </Card>
  );
}
