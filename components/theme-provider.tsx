'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { useColorTheme } from '@/hooks/useColorTheme';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Initialize color theme
  useColorTheme();

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
