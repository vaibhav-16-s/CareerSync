import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Html } from '@react-three/drei';
import { CatmullRomCurve3, Vector3 } from 'three';
import { useCssVarColor } from '@/hooks/use-css-var-color';

const clamp01 = (n) => Math.max(0, Math.min(1, n));

// Shared drag hint shown under every 3D chart so the interactivity is discoverable.
function DragHint() {
  return <p className="mt-1 text-center text-[10px] text-muted-foreground/70">Drag to rotate · scroll to zoom</p>;
}

function ChartLights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
    </>
  );
}

/** Vertical 3D bar chart — used for "Most active day". */
export function Bar3DChart({ data, height = 260, color = '#6366f1', highlightColor = '#22c55e' }) {
  const floorColor = useCssVarColor('--muted', '#f1f5f9');
  const max = Math.max(1, ...data.map((d) => d.value));
  const spacing = 1.15;
  const barSize = 0.58;
  const totalWidth = (data.length - 1) * spacing;
  const bestIndex = useMemo(
    () => data.reduce((bi, d, i) => (d.value > (data[bi]?.value ?? -1) ? i : bi), 0),
    [data]
  );

  return (
    <div style={{ height }} className="relative">
      <Canvas shadows camera={{ position: [0, 3.2, 5.4], fov: 38 }} dpr={[1, 2]}>
        <ChartLights />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[totalWidth + 2, 2.6]} />
          <meshStandardMaterial color={floorColor} />
        </mesh>
        {data.map((d, i) => {
          const x = i * spacing - totalWidth / 2;
          const h = Math.max(0.03, 1.8 * (d.value / max));
          const radius = Math.min(0.06, barSize / 3, h / 3);
          const barColor = d.value > 0 && i === bestIndex ? highlightColor : color;
          return (
            <group key={d.name}>
              <RoundedBox
                args={[barSize, h, barSize]}
                radius={radius}
                smoothness={4}
                position={[x, h / 2, 0]}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial color={barColor} roughness={0.35} metalness={0.15} />
              </RoundedBox>
              <Html position={[x, -0.22, 0.5]} center className="pointer-events-none">
                <span className="whitespace-nowrap text-[10px] text-muted-foreground">{d.name}</span>
              </Html>
              {d.value > 0 && (
                <Html position={[x, h + 0.24, 0]} center className="pointer-events-none">
                  <span className="whitespace-nowrap text-[10px] font-semibold text-foreground">{d.value}</span>
                </Html>
              )}
            </group>
          );
        })}
        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />
      </Canvas>
      <DragHint />
    </div>
  );
}

/** 3D ribbon/tube line chart — used for "Applications over time". */
export function Line3DChart({ data, height = 260, color = '#6366f1' }) {
  const floorColor = useCssVarColor('--muted', '#f1f5f9');
  const max = Math.max(1, ...data.map((d) => d.value));
  const spacing = 0.42;
  const totalWidth = (data.length - 1) * spacing;

  const curve = useMemo(() => {
    const points = data.map((d, i) => new Vector3(i * spacing - totalWidth / 2, 1.6 * (d.value / max), 0));
    return new CatmullRomCurve3(points, false, 'catmullrom', 0.25);
  }, [data, max, spacing, totalWidth]);

  // Thin out x-axis labels so 14 dates don't collide.
  const showEvery = Math.max(1, Math.ceil(data.length / 7));

  return (
    <div style={{ height }} className="relative">
      <Canvas shadows camera={{ position: [0, 2.5, 5.6], fov: 36 }} dpr={[1, 2]}>
        <ChartLights />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[totalWidth + 2, 2.6]} />
          <meshStandardMaterial color={floorColor} />
        </mesh>
        <mesh castShadow>
          <tubeGeometry args={[curve, Math.max(64, data.length * 8), 0.045, 12, false]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.3} />
        </mesh>
        {data.map(
          (d, i) =>
            (i % showEvery === 0 || i === data.length - 1) && (
              <Html key={d.name} position={[i * spacing - totalWidth / 2, -0.22, 0]} center className="pointer-events-none">
                <span className="whitespace-nowrap text-[9px] text-muted-foreground">{d.name}</span>
              </Html>
            )
        )}
        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.1}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
        />
      </Canvas>
      <DragHint />
    </div>
  );
}

/** Tilted 3D progress ring — used for "Hire rate". */
export function Gauge3D({ value, height = 220 }) {
  const trackColor = useCssVarColor('--muted-foreground', '#94a3b8');
  const primary = useCssVarColor('--primary', '#6366f1');
  const pct = clamp01(value / 100);
  const arc = Math.max(0.001, Math.PI * 2 * pct);

  return (
    <div style={{ height }} className="relative">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 32 }} dpr={[1, 2]}>
        <ChartLights />
        <group rotation={[0.65, 0, 0]}>
          <mesh>
            <torusGeometry args={[1.15, 0.15, 20, 96, Math.PI * 2]} />
            <meshStandardMaterial color={trackColor} roughness={0.7} metalness={0} transparent opacity={0.25} />
          </mesh>
          {pct > 0 && (
            <mesh>
              <torusGeometry args={[1.15, 0.16, 20, Math.max(4, Math.round(96 * pct)), arc]} />
              <meshStandardMaterial color={primary} roughness={0.3} metalness={0.35} />
            </mesh>
          )}
        </group>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.7}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{value}%</span>
      </div>
      <DragHint />
    </div>
  );
}

/** 3D staggered funnel — one extruded bar per stage, used for "Application funnel". */
export function Funnel3D({ data, total, height = 280 }) {
  const floorColor = useCssVarColor('--muted', '#f1f5f9');
  const maxLen = 2.1;
  const rowGap = 0.64;
  const startX = -0.35;
  const n = data.length;

  return (
    <div style={{ height }} className="relative">
      <Canvas shadows camera={{ position: [2.4, 2.7, 3.4], fov: 40 }} dpr={[1, 2]}>
        <ChartLights />
        <group position={[0, 0, -((n - 1) * rowGap) / 2]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[startX + maxLen / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[maxLen + 2, n * rowGap + 0.8]} />
            <meshStandardMaterial color={floorColor} />
          </mesh>
          {data.map((d, i) => {
            const pct = total ? d.value / total : 0;
            const len = Math.max(0.06, maxLen * pct);
            return (
              <group key={d.label} position={[0, 0, i * rowGap]}>
                <RoundedBox
                  args={[len, 0.3, 0.34]}
                  radius={Math.min(0.05, len / 4, 0.1)}
                  smoothness={4}
                  position={[startX + len / 2, 0.15, 0]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial color={d.color} roughness={0.35} metalness={0.15} />
                </RoundedBox>
                <Html position={[startX - 0.05, 0.6, 0]} center={false} className="pointer-events-none">
                  <div className="w-40 -translate-x-full text-right">
                    <div className="inline-flex items-center gap-1.5 text-xs text-foreground">
                      {d.label}
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {d.value} ({Math.round(pct * 100)}%)
                    </div>
                  </div>
                </Html>
              </group>
            );
          })}
        </group>
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={7}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.1}
          minAzimuthAngle={-Math.PI / 2.2}
          maxAzimuthAngle={Math.PI / 6}
        />
      </Canvas>
      <DragHint />
    </div>
  );
}
