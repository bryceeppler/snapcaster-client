import { useEffect } from 'react';

export function useColorTheme() {
  useEffect(() => {
    // Load saved color preference from localStorage
    const savedColor = localStorage.getItem('primaryColor');

    if (savedColor) {
      const root = document.documentElement;

      // Update primary color
      root.style.setProperty('--primary', savedColor);

      // Update primary-light
      const [hue, saturation, lightness = '50%'] = savedColor.split(' ');
      const lighterValue = `${hue} ${saturation} ${Math.min(
        parseInt(lightness) + 8,
        100
      )}%`;
      root.style.setProperty('--primary-light', lighterValue);
    }
  }, []);

  return null;
}
