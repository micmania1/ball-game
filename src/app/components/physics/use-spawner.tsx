import { useCallback, useRef } from 'react';
import { Vector3Tuple } from 'three';
import { RapierRigidBody } from '@react-three/rapier';

export default function useSpawner(
  spawnArea: Vector3Tuple,
  offset = [0, 0, 0]
) {
  const spawnPositionMap = useRef<Map<string, Vector3Tuple>>(new Map());

  const calculatePosition = useCallback((): Vector3Tuple => {
    return [
      Math.random() * spawnArea[0] - spawnArea[0] * 0.5 + offset[0],
      spawnArea[1] + offset[1],
      Math.random() * spawnArea[2] - spawnArea[2] * 0.5 + offset[2],
    ];
  }, [offset, spawnArea]);

  const spawn = useCallback(
    (rigidBody: RapierRigidBody, offset = [0, 0, 0]) => {
      const position = calculatePosition();
      rigidBody.resetTorques(false);
      rigidBody.resetForces(false);
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, false);
      rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, false);

      rigidBody.setTranslation(
        {
          x: position[0],
          y: position[1],
          z: position[2],
        },
        true
      );

      return position;
    },
    [calculatePosition]
  );

  const map = useCallback(() => {
    return spawnPositionMap.current;
  }, []);

  return { calculatePosition, spawn, map };
}
