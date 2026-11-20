import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { useCssVarColor } from "@/hooks/use-css-var-color";
const Globe = ({ rotationSpeed, radius, color, opacity }) => {
    const groupRef = useRef(null);
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += rotationSpeed;
            groupRef.current.rotation.x += rotationSpeed * 0.3;
            groupRef.current.rotation.z += rotationSpeed * 0.1;
        }
    });
    return (<group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]}/>
        <meshBasicMaterial color={color} transparent opacity={opacity} wireframe/>
      </mesh>
    </group>);
};
const DotGlobeHero = React.forwardRef(({ rotationSpeed = 0.005, globeRadius = 1, colorVar = "--primary", opacity = 0.25, className, children, ...props }, ref) => {
    const color = useCssVarColor(colorVar);
    return (<div ref={ref} className={cn("relative w-full overflow-hidden bg-background", className)} {...props}>
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <Canvas frameloop="always" dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={75}/>
            <ambientLight intensity={0.5}/>
            <pointLight position={[10, 10, 10]} intensity={1}/>
            <Globe rotationSpeed={rotationSpeed} radius={globeRadius} color={color} opacity={opacity}/>
          </Canvas>
        </div>

        <div className="relative z-10">{children}</div>
      </div>);
});
DotGlobeHero.displayName = "DotGlobeHero";
export { DotGlobeHero };
