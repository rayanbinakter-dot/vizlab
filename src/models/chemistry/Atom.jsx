import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';

const SHELL_CAP = [2, 8, 8, 2];
const SHELL_NAME = ['K', 'L', 'M', 'N'];

function distribute(z) {
  const out = [];
  let left = z;
  for (const cap of SHELL_CAP) {
    if (left <= 0) break;
    out.push(Math.min(cap, left));
    left -= cap;
  }
  return out;
}

export default function Atom({ params }) {
  const { protons = 11, spin = 0.8 } = params;
  const shells = useMemo(() => distribute(protons), [protons]);
  const group = useRef([]);

  useFrame((_, dt) => {
    group.current.forEach((g, i) => {
      if (g) g.rotation.y += dt * spin * (1 / (i + 1.4)) * 2;
    });
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>
      <Text position={[0, -1.05, 0]} fontSize={0.3} color="#f87171">{`Z = ${protons}`}</Text>

      {shells.map((count, si) => {
        const r = 1.6 + si * 1.15;
        const ring = [];
        for (let i = 0; i <= 90; i++) {
          const a = (i / 90) * Math.PI * 2;
          ring.push([Math.cos(a) * r, 0, Math.sin(a) * r]);
        }
        return (
          <group key={si} rotation={[Math.PI / 2.6 - si * 0.35, 0, si * 0.5]}>
            <Line points={ring} color="#334155" lineWidth={1} />
            <group ref={(el) => (group.current[si] = el)}>
              {Array.from({ length: count }).map((_, i) => {
                const a = (i / count) * Math.PI * 2;
                return (
                  <mesh key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
                    <sphereGeometry args={[0.15, 20, 20]} />
                    <meshStandardMaterial color="#38bdf8" emissive="#0369a1" emissiveIntensity={0.6} />
                  </mesh>
                );
              })}
            </group>
            <Text position={[r + 0.4, 0, 0]} fontSize={0.28} color="#64748b">
              {`${SHELL_NAME[si]}:${count}`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
