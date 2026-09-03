import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function Orbit({ params }) {
  const { eccentricity = 0.4, showAreas = true } = params;
  const planet = useRef();
  const theta = useRef(0);
  const a = 4, e = eccentricity, b = a * Math.sqrt(1 - e*e), c = a*e;

  const ellipse = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i/200) * Math.PI * 2;
      p.push([a*Math.cos(t) - c, 0, b*Math.sin(t)]);
    }
    return p;
  }, [a, b, c]);

  const [sweep, setSweep] = useState([]);

  useFrame((_, dt) => {
    // Kepler's 2nd law: angular speed ∝ 1/r²
    const r = Math.hypot(a*Math.cos(theta.current) - c + c, b*Math.sin(theta.current));
    const rr = Math.hypot(a*Math.cos(theta.current), b*Math.sin(theta.current));
    const dist = Math.hypot(a*Math.cos(theta.current)-c - (-c), b*Math.sin(theta.current));
    theta.current += dt * (2.2 / Math.max(dist*dist*0.1, 0.25));
    const x = a*Math.cos(theta.current) - c;
    const z = b*Math.sin(theta.current);
    if (planet.current) planet.current.position.set(x, 0, z);
    if (showAreas) setSweep([[-c,0,0],[x,0,z]]);
  });

  return (
    <group>
      <Line points={ellipse} color="#475569" lineWidth={1.5} />
      <mesh position={[-c, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.7} />
      </mesh>
      <pointLight position={[-c,0,0]} intensity={2} distance={30} color="#fbbf24" />
      <mesh ref={planet}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.4} />
      </mesh>
      {showAreas && sweep.length === 2 && (
        <Line points={sweep} color="#f97316" lineWidth={2} />
      )}
    </group>
  );
}
