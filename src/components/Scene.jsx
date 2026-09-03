import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

export default function Scene({ children, camera = [7, 5, 9] }) {
  return (
    <Canvas
      camera={{ position: camera, fov: 48 }}
      gl={{ antialias: true, localClippingEnabled: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#060a11']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 7]} intensity={1.1} />
      <directionalLight position={[-7, -4, -6]} intensity={0.35} color="#6ea8ff" />
      <Suspense fallback={null}>{children}</Suspense>
      <OrbitControls enableDamping dampingFactor={0.07} makeDefault />
    </Canvas>
  );
}
