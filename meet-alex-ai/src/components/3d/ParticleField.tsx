import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleField({ count = 5000 }) {
  const points = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#b08d57'), // gold
      new THREE.Color('#c8a06a'), // brass
      new THREE.Color('#cdb389'), // light gold
      new THREE.Color('#5c1526'), // oxblood
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;     // X axis tighter bounds
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // Y axis tighter bounds
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // Z axis tighter bounds
      
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      // Create a swirling vortex effect rather than simple rotation
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.2;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors={true} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation={true} />
    </points>
  );
}
