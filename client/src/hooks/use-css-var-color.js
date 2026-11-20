import { useEffect, useState } from 'react';

/**
 * Resolves a shadcn HSL css variable (stored as bare channels, e.g. "222 47% 11%")
 * into a colour string THREE.Color can parse. three.js cannot resolve `var()`,
 * so passing "hsl(var(--foreground))" straight to a material silently renders
 * white — we read the computed value instead and re-read it on theme changes.
 */
export function useCssVarColor(varName, fallback = '#475569') {
  const [color, setColor] = useState(fallback);
  useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (!raw) return;
      const parts = raw.split(/\s+/);
      setColor(parts.length >= 3 ? `hsl(${parts[0]}, ${parts[1]}, ${parts[2]})` : raw);
    };
    read();
    // The theme toggle swaps a class on <html>; re-read so the scene follows it.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    return () => observer.disconnect();
  }, [varName]);
  return color;
}
