import { useMemo } from 'react';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Vectors({ params }) {
  const { angle = 60, showCross = true } = params;
  const rad = (angle * Math.PI) / 180;
  const A = useMemo(() => new THREE.Vector3(3, 0, 0), []);
  const B = useMemo(() => new THREE.Vector3(3*Math.cos(rad), 3*Math.sin(rad), 0), [rad]);
  const C = useMemo(() => new THREE.Vector3().crossVectors(A, B), [A, B]);
  const dot = A.dot(B);

  const arc = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 40; i++) {
      const a = (i/40) * rad;
      p.push([Math.cos(a), Math.sin(a), 0]);
    }
    return p;
  }, [rad]);

  return (
    <group>
      <axesHelper args={[4]} />
      <arrowHelper args={[A.clone().normalize(), new THREE.Vector3(), A.length(), 0x38bdf8, 0.35, 0.2]} />
      <arrowHelper args={[B.clone().normalize(), new THREE.Vector3(), B.length(), 0x22c55e, 0.35, 0.2]} />
      {showCross && C.length() > 0.01 && (
        <arrowHelper args={[C.clone().normalize(), new THREE.Vector3(), Math.min(C.length()/2.2, 4), 0xf97316, 0.35, 0.2]} />
      )}
      <Line points={arc} color="#94a3b8" lineWidth={2} />
      <Text position={[3.4,0,0]} fontSize={0.35} color="#38bdf8">A</Text>
      <Text position={[B.x*1.15, B.y*1.15, 0]} fontSize={0.35} color="#22c55e">B</Text>
      {showCross && <Text position={[0,0,Math.min(C.length()/2.2,4)+0.4]} fontSize={0.3} color="#f97316">A×B</Text>}
      <Text position={[1.3, 0.35, 0]} fontSize={0.26} color="#94a3b8">{`${angle}°`}</Text>
      <Text position={[0,-2.4,0]} fontSize={0.3} color="#cbd5e1">
        {`A·B = ${dot.toFixed(2)}    |A×B| = ${C.length().toFixed(2)}`}
      </Text>
    </group>
  );
}
