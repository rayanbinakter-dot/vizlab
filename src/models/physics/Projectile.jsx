import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

const G = 9.8;

export default function Projectile({ params }) {
  const { speed = 10, angle = 45, showVectors = true } = params;
  const ball = useRef();
  const vArrow = useRef();
  const gArrow = useRef();
  const [trail, setTrail] = useState([[0, 0, 0]]);
  const t = useRef(0);

  const rad = (angle * Math.PI) / 180;
  const flight = (2 * speed * Math.sin(rad)) / G;
  const range = (speed * speed * Math.sin(2 * rad)) / G;
  const scale = Math.min(1, 12 / Math.max(range, 6));

  // full ideal path, drawn faintly
  const path = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const tt = (i / 80) * flight;
      pts.push([
        (speed * Math.cos(rad) * tt) * scale - 5,
        (speed * Math.sin(rad) * tt - 0.5 * G * tt * tt) * scale,
        0,
      ]);
    }
    return pts;
  }, [speed, rad, flight, scale]);

  useFrame((_, dt) => {
    t.current = (t.current + dt * 0.7) % flight;
    const tt = t.current;
    const x = speed * Math.cos(rad) * tt * scale - 5;
    const y = (speed * Math.sin(rad) * tt - 0.5 * G * tt * tt) * scale;
    if (ball.current) ball.current.position.set(x, y, 0);

    if (tt < 0.05) setTrail([[x, y, 0]]);
    else setTrail((p) => (p.length > 300 ? p : [...p, [x, y, 0]]));

    if (showVectors) {
      const vx = speed * Math.cos(rad);
      const vy = speed * Math.sin(rad) - G * tt;
      const v = new THREE.Vector3(vx, vy, 0);
      if (vArrow.current) {
        vArrow.current.position.set(x, y, 0);
        vArrow.current.setDirection(v.clone().normalize());
        vArrow.current.setLength(Math.max(v.length() * 0.18, 0.4), 0.3, 0.18);
      }
      if (gArrow.current) gArrow.current.position.set(x, y, 0);
    }
  });

  return (
    <group>
      <Grid args={[24, 24]} cellColor="#1e293b" sectionColor="#334155"
            position={[0, 0, 0]} fadeDistance={40} infiniteGrid />
      <Line points={path} color="#334155" lineWidth={1} dashed dashSize={0.2} gapSize={0.15} />
      {trail.length > 1 && <Line points={trail} color="#fbbf24" lineWidth={3} />}

      <mesh ref={ball}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color="#fb7185" emissive="#7f1d1d" roughness={0.3} />
      </mesh>

      {showVectors && (
        <>
          <arrowHelper ref={vArrow} args={[new THREE.Vector3(1,0,0), new THREE.Vector3(), 2, 0x38bdf8, 0.3, 0.18]} />
          <arrowHelper ref={gArrow} args={[new THREE.Vector3(0,-1,0), new THREE.Vector3(), 1.3, 0xef4444, 0.3, 0.18]} />
        </>
      )}

      <Text position={[-5, -0.6, 0]} fontSize={0.3} color="#64748b">launch</Text>
      <Text position={[range * scale - 5, -0.6, 0]} fontSize={0.3} color="#64748b">
        {`R = ${range.toFixed(1)} m`}
      </Text>
    </group>
  );
}
