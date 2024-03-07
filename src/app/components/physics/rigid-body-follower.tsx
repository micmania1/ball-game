import { useThree } from '@react-three/fiber';
import useVector3 from '../../utils/use-vector3';
import { Vector3Tuple } from 'three';
import { useAfterPhysicsStep } from '@react-three/rapier';
import { RefObject } from 'react';
import { OrbitControls } from '@react-three/drei';
import { RapierRigidBodyRef } from '../../types';

type CameraFocusProps = {
  offset: Vector3Tuple;
  focusRef: RefObject<RapierRigidBodyRef>;
  debug?: boolean;
};
export default function RigidBodyFollower({
  offset,
  focusRef,
  debug = false,
}: CameraFocusProps) {
  const focusPosition = useVector3();
  const camera = useThree((three) => three.camera);

  useAfterPhysicsStep(() => {
    const rigidBody = focusRef.current?.rigidBody();
    if (rigidBody && !debug) {
      const { x, y, z } = rigidBody.translation();
      focusPosition.set(x, y, z);

      camera.lookAt(focusPosition);
      camera.position.lerp(
        {
          x: x + offset[0],
          y: y + offset[1],
          z: z + offset[2],
        },
        0.1
      );
    }
  });

  return debug ? <OrbitControls /> : null;
}
