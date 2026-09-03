import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Wave({ params }) {
  const { amplitude = 1, wavelength = 4, speed = 1 } = params;
  const ref = useRef();
  const marker = useRef();
  const t = useRef(0);
  const N = 220, span = 16;

  const geom = useMemo(() => new THREE.BufferGeometry(), []);
  const pos = useMemo(() => new Float32Array(N * 3), []);

  useFrame((_, dt) => {
    t.current += dt * speed;
    const k = (2 * Math.PI) / wavelength;
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1)) * span - span / 2;
      pos[i*3] = x;
      pos[i*3+1] = amplitude * Math.sin(k * x - t.current * 2);
      pos[i*3+2] = 0;
    }
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.attributes.position.needsUpdate = true;
    geom.computeBoundingSphere();
    if (marker.current) {
      marker.current.position.set(0, amplitude * Math.sin(-t.current*2), 0);
    }
  });

  return (
    <group>
      <line ref={ref} geometry={geom}>
        <lineBasicMaterial color="#38bdf8" linewidth={2} />
      </line>
      <Line points={[[-8,0,0],[8,0,0]]} color="#334155" lineWidth={1} />
      <Line points={[[0,-2.6,0],[0,2.6,0]]} color="#334155" lineWidth={1} />
      {/* amplitude bracket */}
      <Line points={[[-7.4,0,0],[-7.4,amplitude,0]]} color="#fbbf24" lineWidth={2} />
      <Text position={[-6.9, amplitude/2, 0]} fontSize={0.32} color="#fbbf24" anchorX="left">A</Text>
      {/* wavelength bracket */}
      <Line points={[[0,-amplitude-0.5,0],[wavelength,-amplitude-0.5,0]]} color="#a78bfa" lineWidth={2} />
      <Text position={[wavelength/2, -amplitude-0.9, 0]} fontSize={0.32} color="#a78bfa">λ</Text>
      <mesh ref={marker}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#fb7185" emissive="#7f1d1d" />
      </mesh>
    </group>
  );
}
