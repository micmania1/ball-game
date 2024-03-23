import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ComponentProps, forwardRef } from 'react';
import { Mesh } from 'three';

type BallProps = {
  color: THREE.ColorRepresentation;
} & ComponentProps<typeof Sphere>;

const Ball = forwardRef<Mesh, BallProps>(function (
  { color, children, ...props },
  ref
) {
  const radius = 0.25;
  return (
    <Sphere args={[radius]} {...props} ref={ref}>
      <meshStandardMaterial color={color} />
      {children}
    </Sphere>
  );
});

export default Ball;
