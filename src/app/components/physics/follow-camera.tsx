import { useFrame, useThree } from '@react-three/fiber';
import { Object3D, Vector3Tuple } from 'three';
import { useRef } from 'react';
import useVector3 from '../../utils/use-vector3';
import { defaultCameraOffset } from '../../config/camera';
import useQuaternion from '../../utils/use-quaternion';

type CameraFocusProps = {
  offset?: Vector3Tuple;
  enabled: boolean;
};
export default function FollowCamera({
  offset = defaultCameraOffset,
  enabled,
}: CameraFocusProps) {
  const camera = useThree((three) => three.camera);
  const focusPosition = useVector3();
  const objectRef = useRef<Object3D>(null);
  const q = useQuaternion();

  useFrame(() => {
    const object = objectRef.current;
    const focus = object?.parent;
    if (enabled && object && focus) {
      focusPosition.setFromMatrixPosition(focus.matrixWorld);
      const { x, y, z } = focusPosition;

      q.setFromRotationMatrix(camera.matrixWorld);
      camera.quaternion.slerpQuaternions(q, camera.quaternion, 0.1);
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

  return enabled ? <object3D ref={objectRef} /> : null;
}
