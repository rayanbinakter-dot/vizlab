import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const ORGANELLES = [
  { name: 'Nucleus',      bn: 'নিউক্লিয়াস',  pos: [0, 0, 0],        r: 0.85, color: '#8b5cf6' },
  { name: 'Mitochondria', bn: 'মাইটোকন্ড্রিয়া', pos: [1.7, 0.6, 0.4],  r: 0.38, color: '#ef4444' },
  { name: 'Mitochondria', bn: 'মাইটোকন্ড্রিয়া', pos: [-1.5, -0.8, 0.9], r: 0.34, color: '#ef4444', hide: true },
  { name: 'Golgi body',   bn: 'গলজি বস্তু',   pos: [-1.6, 1.1, -0.4], r: 0.42, color: '#f59e0b' },
  { name: 'Ribosome',     bn: 'রাইবোজোম',     pos: [1.2, -1.3, -0.8], r: 0.2,  color: '#22c55e' },
  { name: 'Lysosome',     bn: 'লাইসোজোম',     pos: [0.4, 1.7, 1.0],   r: 0.28, color: '#06b6d4' },
  { name: 'Vacuole',      bn: 'ভ্যাকুওল',     pos: [-0.9, -1.6, -1.1], r: 0.45, color: '#3b82f6' },
];

export default function Cell({ params }) {
  const { explode = 0, cutaway = false } = params;
  const root = useRef();
  useFrame((_, dt) => { if (root.current) root.current.rotation.y += dt * 0.18; });

  const clip = useMemo(() => [new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)], []);

  return (
    <group ref={root}>
      {/* membrane */}
      <mesh>
        <sphereGeometry args={[3, 48, 48]} />
        <meshStandardMaterial
          color="#22d3ee" transparent opacity={cutaway ? 0.12 : 0.18}
          roughness={0.2} side={THREE.DoubleSide}
          clippingPlanes={cutaway ? clip : null}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.02, 48, 48]} />
        <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.09} />
      </mesh>

      {ORGANELLES.map((o, i) => {
        const p = new THREE.Vector3(...o.pos).multiplyScalar(1 + explode * 1.6);
        return (
          <group key={i} position={p.toArray()}>
            <mesh>
              <sphereGeometry args={[o.r, 28, 28]} />
              <meshStandardMaterial color={o.color} roughness={0.35} emissive={o.color} emissiveIntensity={0.12} />
            </mesh>
            {!o.hide && (
              <Html center distanceFactor={11} style={{ pointerEvents: 'none' }}>
                <div style={{
                  background: 'rgba(2,6,23,.82)', border: `1px solid ${o.color}`,
                  color: '#e2e8f0', fontSize: 11, padding: '2px 7px',
                  borderRadius: 5, whiteSpace: 'nowrap', transform: 'translateY(-28px)',
                  fontFamily: 'system-ui',
                }}>{o.name}</div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
