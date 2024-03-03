import { useFrame, useThree } from '@react-three/fiber';
import useVector3 from '../utils/use-vector3';
import { Vector3Tuple } from 'three';
import { RapierRigidBody, useAfterPhysicsStep } from '@react-three/rapier';
import { RefObject } from 'react';

type CameraFocusProps = {
  offset: Vector3Tuple;
  focusRef: RefObject<{ rigidBody(): RapierRigidBody | null }>;
};
export default function CameraFocus({ offset, focusRef }: CameraFocusProps) {
  const focusPosition = useVector3();
  const camera = useThree((three) => three.camera);

  useAfterPhysicsStep(() => {
    const rigidBody = focusRef.current?.rigidBody();
    if (rigidBody) {
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

  return null;
}
