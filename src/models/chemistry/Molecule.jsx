import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

const ATOM = {
  C: { color: '#374151', r: 0.55 },
  H: { color: '#e5e7eb', r: 0.3  },
  O: { color: '#ef4444', r: 0.5  },
  N: { color: '#3b82f6', r: 0.52 },
};

const GEOMETRY = {
  CH4: { center: 'C', ligands: 'H', angle: '109.5°', pos: [[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]], d: 1.8 },
  H2O: { center: 'O', ligands: 'H', angle: '104.5°', pos: [[Math.sin(0.911),Math.cos(0.911),0],[-Math.sin(0.911),Math.cos(0.911),0]], d: 1.6 },
  NH3: { center: 'N', ligands: 'H', angle: '107°',   pos: [[1,-0.4,0],[-0.5,-0.4,0.866],[-0.5,-0.4,-0.866]], d: 1.7 },
  CO2: { center: 'C', ligands: 'O', angle: '180°',   pos: [[1,0,0],[-1,0,0]], d: 1.9 },
};

function Bond({ from, to }) {
  const ref = useRef();
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir.clone().normalize());
    return { pos: a.clone().add(dir.clone().multiplyScalar(0.5)), quat: q, len: dir.length() };
  }, [from, to]);
  return (
    <mesh ref={ref} position={pos} quaternion={quat}>
      <cylinderGeometry args={[0.1, 0.1, len, 16]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.4} />
    </mesh>
  );
}

export default function Molecule({ params }) {
  const { molecule = 'CH4', showBondAngle = true } = params;
  const g = GEOMETRY[molecule] ?? GEOMETRY.CH4;
  const root = useRef();
  useFrame((_, dt) => { if (root.current) root.current.rotation.y += dt * 0.3; });

  const positions = useMemo(
    () => g.pos.map((p) => new THREE.Vector3(...p).normalize().multiplyScalar(g.d).toArray()),
    [g]
  );
  const cSpec = ATOM[g.center], lSpec = ATOM[g.ligands];

  return (
    <group ref={root}>
      <mesh>
        <sphereGeometry args={[cSpec.r, 32, 32]} />
        <meshStandardMaterial color={cSpec.color} roughness={0.28} metalness={0.15} />
      </mesh>
      <Text position={[0, cSpec.r + 0.35, 0]} fontSize={0.34} color="#f1f5f9">{g.center}</Text>

      {positions.map((p, i) => (
        <group key={i}>
          <Bond from={[0,0,0]} to={p} />
          <mesh position={p}>
            <sphereGeometry args={[lSpec.r, 32, 32]} />
            <meshStandardMaterial color={lSpec.color} roughness={0.28} metalness={0.1} />
          </mesh>
          <Text position={[p[0]*1.28, p[1]*1.28, p[2]*1.28]} fontSize={0.28} color="#cbd5e1">
            {g.ligands}
          </Text>
        </group>
      ))}

      {showBondAngle && (
        <Text position={[0, -2.6, 0]} fontSize={0.36} color="#22c55e">
          {`${molecule}  ·  ${g.angle}`}
        </Text>
      )}
    </group>
  );
}
