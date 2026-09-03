import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Grid } from '@react-three/drei';

export default function Solids({ params }) {
  const { shape = 'cylinder', radius = 1.5, height = 3 } = params;
  const ref = useRef();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.35; });

  const V = {
    cube:     radius * 2 * radius * 2 * height,
    cylinder: Math.PI * radius * radius * height,
    cone:     (Math.PI * radius * radius * height) / 3,
    sphere:   (4 / 3) * Math.PI * radius ** 3,
  }[shape];

  const S = {
    cube:     `V = a²h = ${V.toFixed(2)}`,
    cylinder: `V = πr²h = ${V.toFixed(2)}`,
    cone:     `V = ⅓πr²h = ${V.toFixed(2)}`,
    sphere:   `V = 4/3 πr³ = ${V.toFixed(2)}`,
  }[shape];

  return (
    <group>
      <Grid args={[16, 16]} cellColor="#1e293b" sectionColor="#334155" position={[0, -height/2 - 0.01, 0]} infiniteGrid fadeDistance={30} />
      <group ref={ref}>
        {/* ghost cylinder to compare the cone against */}
        {shape === 'cone' && (
          <mesh>
            <cylinderGeometry args={[radius, radius, height, 48]} />
            <meshStandardMaterial color="#64748b" transparent opacity={0.13} />
          </mesh>
        )}
        <mesh>
          {shape === 'cube'     && <boxGeometry args={[radius*2, height, radius*2]} />}
          {shape === 'cylinder' && <cylinderGeometry args={[radius, radius, height, 48]} />}
          {shape === 'cone'     && <coneGeometry args={[radius, height, 48]} />}
          {shape === 'sphere'   && <sphereGeometry args={[radius, 40, 40]} />}
          <meshStandardMaterial color="#a855f7" roughness={0.35} metalness={0.15} />
        </mesh>
        <mesh>
          {shape === 'cube'     && <boxGeometry args={[radius*2, height, radius*2]} />}
          {shape === 'cylinder' && <cylinderGeometry args={[radius, radius, height, 48]} />}
          {shape === 'cone'     && <coneGeometry args={[radius, height, 48]} />}
          {shape === 'sphere'   && <sphereGeometry args={[radius, 40, 40]} />}
          <meshBasicMaterial wireframe color="#e9d5ff" transparent opacity={0.18} />
        </mesh>
      </group>
      <Text position={[0, -height/2 - 0.9, 0]} fontSize={0.36} color="#e9d5ff">{S}</Text>
      {shape === 'cone' && (
        <Text position={[0, -height/2 - 1.45, 0]} fontSize={0.26} color="#94a3b8">
          grey ghost = the cylinder it fits inside, exactly 3×
        </Text>
      )}
    </group>
  );
}
