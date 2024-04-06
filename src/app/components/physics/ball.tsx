import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ComponentProps, forwardRef } from 'react';
import { Mesh } from 'three';

type BallProps = {
  radius: number;
  color: THREE.ColorRepresentation;
} & ComponentProps<typeof Sphere>;

const Ball = forwardRef<Mesh, BallProps>(function (
  { radius, color, children, ...props },
  ref
) {
  return (
    <Sphere args={[radius]} {...props} ref={ref}>
      <meshPhysicalMaterial color={color} roughness={0} />
      {children}
    </Sphere>
  );
});

export default Ball;
