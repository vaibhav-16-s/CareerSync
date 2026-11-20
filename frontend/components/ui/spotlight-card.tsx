'use client';

import React, { useEffect, ReactNode } from 'react';

interface GlowCardProps {
  children?: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  /** When true, ignores `size` and uses width/height or className for sizing. */
  customSize?: boolean;
  /**
   * `dark` (default) is the original look — tuned for dark backdrops.
   * `light` retunes the spotlight for light pages: a white card face, no
   * brightness doubling, and a dimmed white hotspot so the glow stays visible
   * instead of washing out.
   */
  variant?: 'dark' | 'light';
}

const variantVars: Record<'dark' | 'light', Record<string, string>> = {
  dark: {
    '--backdrop': 'hsl(0 0% 60% / 0.12)',
  },
  light: {
    '--backdrop': 'hsl(0 0% 100% / 0.75)',
    '--border-brightness': '1',
    '--border-light-opacity': '0.12',
    '--border-spot-opacity': '0.85',
    '--bg-spot-opacity': '0.14',
  },
};

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
};

/**
 * The spotlight uses viewport coordinates together with `background-attachment: fixed`,
 * so a single set of pointer variables on <html> drives every card on the page.
 * One shared listener (ref-counted) instead of one per card keeps pointermove cheap.
 */
let pointerRefCount = 0;
let pointerHandler: ((e: PointerEvent) => void) | null = null;

function attachPointer() {
  if (pointerRefCount === 0) {
    const root = document.documentElement;
    pointerHandler = (e: PointerEvent) => {
      root.style.setProperty('--x', e.clientX.toFixed(2));
      root.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
      root.style.setProperty('--y', e.clientY.toFixed(2));
      root.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
    };
    document.addEventListener('pointermove', pointerHandler, { passive: true });
  }
  pointerRefCount += 1;
}

function detachPointer() {
  pointerRefCount -= 1;
  if (pointerRefCount <= 0 && pointerHandler) {
    document.removeEventListener('pointermove', pointerHandler);
    pointerHandler = null;
    pointerRefCount = 0;
  }
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  variant = 'dark',
}) => {
  useEffect(() => {
    attachPointer();
    return () => detachPointer();
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const sizeClasses = customSize ? '' : sizeMap[size];

  // Custom properties aren't part of React's CSSProperties, so build a loose
  // record and cast once at the end.
  const styles: Record<string, string | number> = {
    '--base': base,
    '--spread': spread,
    '--radius': '14',
    '--border': '3',
    '--backdrop': 'hsl(0 0% 60% / 0.12)',
    '--backup-border': 'var(--backdrop)',
    '--size': '200',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative',
    touchAction: 'none',
    // Variant overrides (--backdrop, brightness, spot opacities) come last so
    // they win over the defaults above.
    ...variantVars[variant],
  };

  if (width !== undefined) styles.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) styles.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      data-glow
      style={styles as React.CSSProperties}
      className={[
        sizeClasses,
        !customSize ? 'aspect-[3/4]' : '',
        'relative grid grid-rows-[1fr_auto] gap-4 rounded-2xl p-4 shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[5px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div data-glow />
      {children}
    </div>
  );
};

export { GlowCard };
export type { GlowCardProps };
