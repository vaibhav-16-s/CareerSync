"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface DotGlobeHeroProps {
  rotationSpeed?: number;
  globeRadius?: number;
  /** Tailwind/shadcn CSS variable to colour the globe with (e.g. "--primary"). */
  colorVar?: string;
  /** Wireframe opacity, 0–1. */
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Resolves a shadcn HSL css variable (stored as bare channels, e.g. "222 47% 11%")
 * into a colour string THREE.Color can parse. three.js cannot resolve `var()`,
 * so passing "hsl(var(--foreground))" straight to a material silently renders
 * white — we read the computed value instead and re-read it on theme changes.
 */
function useCssVarColor(varName: string, fallback = "#475569") {
  const [color, setColor] = React.useState(fallback);

  React.useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      if (!raw) return;
      const parts = raw.split(/\s+/);
      setColor(parts.length >= 3 ? `hsl(${parts[0]}, ${parts[1]}, ${parts[2]})` : raw);
    };

    read();
    // The theme toggle swaps a class on <html>; re-read so the globe follows it.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, [varName]);

  return color;
}

const Globe: React.FC<{
  rotationSpeed: number;
  radius: number;
  color: string;
  opacity: number;
}> = ({ rotationSpeed, radius, color, opacity }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x += rotationSpeed * 0.3;
      groupRef.current.rotation.z += rotationSpeed * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} wireframe />
      </mesh>
    </group>
  );
};

const DotGlobeHero = React.forwardRef<HTMLDivElement, DotGlobeHeroProps>(
  (
    {
      rotationSpeed = 0.005,
      globeRadius = 1,
      colorVar = "--primary",
      opacity = 0.25,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const color = useCssVarColor(colorVar);

    return (
      <div
        ref={ref}
        className={cn("relative w-full overflow-hidden bg-background", className)}
        {...props}
      >
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <Canvas frameloop="always" dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={75} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Globe
              rotationSpeed={rotationSpeed}
              radius={globeRadius}
              color={color}
              opacity={opacity}
            />
          </Canvas>
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

DotGlobeHero.displayName = "DotGlobeHero";

export { DotGlobeHero, type DotGlobeHeroProps };
