import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { forwardRef, ReactNode } from 'react';
import { Mesh } from 'three';

type BallProps = {
  color: THREE.ColorRepresentation;
  children?: ReactNode;
};

const Ball = forwardRef<Mesh, BallProps>(function ({ color, children }, ref) {
  const radius = 0.25;
  return (
    <Sphere args={[radius]} name="ball" ref={ref}>
      <meshStandardMaterial color={color} />
      {children}
    </Sphere>
  );
});

export default Ball;
