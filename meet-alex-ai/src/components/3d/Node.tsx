import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

export function Node({ position, color, label, id, onClick, isActive }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
      
      if (isActive) {
         meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1.5, 0.1));
      } else {
         meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1));
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 2 : 0.8} wireframe />
      </mesh>
      
      <Text position={[0, -1, 0]} fontSize={0.3} color="#f0eae1" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}
