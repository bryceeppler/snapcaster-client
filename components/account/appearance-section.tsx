'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import ThemeSelector from '@/components/theme-selector';

export function AppearanceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks on your device.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeSelector />
      </CardContent>
    </Card>
  );
}
