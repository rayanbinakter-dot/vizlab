import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Tube, Text } from '@react-three/drei';
import * as THREE from 'three';

const PAIRS = [
  { a: 'A', b: 'T', color: '#ef4444' },
  { a: 'T', b: 'A', color: '#f59e0b' },
  { a: 'G', b: 'C', color: '#22c55e' },
  { a: 'C', b: 'G', color: '#3b82f6' },
];

export default function DNA({ params }) {
  const { twist = 0.55, unzip = 0 } = params;
  const root = useRef();
  const RUNGS = 32, RAD = 1.5, RISE = 0.36;

  const { strandA, strandB, rungs } = useMemo(() => {
    const A = [], B = [], R = [];
    for (let i = 0; i < RUNGS; i++) {
      const frac = i / RUNGS;
      const open = Math.max(0, unzip - frac) * 4;    // unzip from the top
      const ang = i * twist;
      const y = i * RISE - (RUNGS * RISE) / 2;
      const pa = new THREE.Vector3(Math.cos(ang) * RAD, y, Math.sin(ang) * RAD);
      const pb = new THREE.Vector3(Math.cos(ang + Math.PI) * RAD, y, Math.sin(ang + Math.PI) * RAD);
      pa.x += open; pb.x -= open;
      A.push(pa); B.push(pb);
      if (open < 0.15) R.push({ a: pa, b: pb, ...PAIRS[i % 4] });
    }
    return {
      strandA: new THREE.CatmullRomCurve3(A),
      strandB: new THREE.CatmullRomCurve3(B),
      rungs: R,
    };
  }, [twist, unzip]);

  useFrame((_, dt) => { if (root.current) root.current.rotation.y += dt * 0.35; });

  return (
    <group ref={root}>
      <Tube args={[strandA, 200, 0.18, 12, false]}>
        <meshStandardMaterial color="#fb923c" roughness={0.3} metalness={0.2} />
      </Tube>
      <Tube args={[strandB, 200, 0.18, 12, false]}>
        <meshStandardMaterial color="#22d3ee" roughness={0.3} metalness={0.2} />
      </Tube>
      {rungs.map((r, i) => {
        const dir = new THREE.Vector3().subVectors(r.b, r.a);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir.clone().normalize());
        const mid = r.a.clone().add(dir.clone().multiplyScalar(0.5));
        return (
          <mesh key={i} position={mid} quaternion={q}>
            <cylinderGeometry args={[0.09, 0.09, dir.length(), 10]} />
            <meshStandardMaterial color={r.color} emissive={r.color} emissiveIntensity={0.15} roughness={0.35} />
          </mesh>
        );
      })}
      <Text position={[0, -6.2, 0]} fontSize={0.3} color="#94a3b8">
        {unzip > 0.05 ? 'replication fork opening' : 'A–T · G–C base pairs'}
      </Text>
    </group>
  );
}
