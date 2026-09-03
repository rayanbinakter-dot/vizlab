import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const FN = {
  'sin·cos':    (x, y, a, t) => Math.sin(a*x + t) * Math.cos(a*y),
  'saddle':     (x, y, a)    => (x*x - y*y) * a * 0.15,
  'paraboloid': (x, y, a)    => (x*x + y*y) * a * 0.1 - 2,
  'ripple':     (x, y, a, t) => { const r = Math.hypot(x, y); return Math.sin(r * a * 2 - t * 2) * 1.4 / (1 + r * 0.35); },
};

export default function Surface({ params }) {
  const { fn = 'sin·cos', freq = 0.8, animate = true } = params;
  const mesh = useRef();
  const t = useRef(0);
  const N = 96, size = 9;

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, N, N);
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    if (animate) t.current += dt;
    const f = FN[fn] ?? FN['sin·cos'];
    const p = geo.attributes.position, c = geo.attributes.color;
    const col = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const z = f(p.getX(i), p.getY(i), freq, t.current);
      p.setZ(i, z);
      col.setHSL(0.62 - THREE.MathUtils.clamp((z + 2) / 4, 0, 1) * 0.45, 0.85, 0.34 + THREE.MathUtils.clamp((z+2)/4,0,1) * 0.22);
      c.setXYZ(i, col.r, col.g, col.b);
    }
    p.needsUpdate = true; c.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={mesh} geometry={geo}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.5} metalness={0.08} />
      </mesh>
      <mesh geometry={geo}>
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.07} />
      </mesh>
    </group>
  );
}
