import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/** Build a point cloud sampling |ψ|² for hydrogen-like orbitals. */
function useCloud(type, n = 9000) {
  return useMemo(() => {
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const c1 = new THREE.Color('#38bdf8'), c2 = new THREE.Color('#f97316');
    let i = 0, guard = 0;
    while (i < n && guard < n * 200) {
      guard++;
      const r = Math.pow(Math.random(), 0.4) * 5;
      const th = Math.acos(2 * Math.random() - 1);
      const ph = Math.random() * Math.PI * 2;
      const x = r * Math.sin(th) * Math.cos(ph);
      const y = r * Math.cos(th);
      const z = r * Math.sin(th) * Math.sin(ph);
      const radial = Math.exp(-r / 2.2);
      let ang = 1;
      if (type === 's')    ang = 1;
      if (type === 'px')   ang = x / (r || 1);
      if (type === 'py')   ang = y / (r || 1);
      if (type === 'pz')   ang = z / (r || 1);
      if (type === 'dz2')  ang = (3*(z/(r||1))**2 - 1) / 2;
      if (type === 'dxy')  ang = (x*y) / ((r||1)**2) * 2;
      const psi = radial * ang;
      if (Math.random() > psi * psi * 6) continue;
      pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
      const c = ang >= 0 ? c1 : c2;
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
      i++;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos.slice(0, i*3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col.slice(0, i*3), 3));
    return geo;
  }, [type, n]);
}

export default function Orbital({ params }) {
  const { type = 'pz' } = params;
  const geo = useCloud(type);
  const ref = useRef();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.2; });
  return (
    <group ref={ref}>
      <points geometry={geo}>
        <pointsMaterial size={0.07} vertexColors transparent opacity={0.75} sizeAttenuation />
      </points>
      <axesHelper args={[5]} />
      <Text position={[0, -5.5, 0]} fontSize={0.5} color="#e2e8f0">{`${type} orbital`}</Text>
      <Text position={[0, -6.2, 0]} fontSize={0.26} color="#64748b">blue = +phase · orange = −phase</Text>
    </group>
  );
}
