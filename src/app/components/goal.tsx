import { Box } from '@react-three/drei';
import * as THREE from 'three';
import {
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useRef } from 'react';

type GoalProps = {
  position: THREE.Vector3Tuple;
  size: THREE.Vector3Tuple;
  onEnter(): void;
};

export default function Goal({ position, size, onEnter }: GoalProps) {
  const aRef = useRef<RapierRigidBody>(null);
  return (
    <RigidBody
      type="fixed"
      args={size}
      position={position}
      colliders="cuboid"
      sensor
      collisionGroups={interactionGroups(0, [1])}
      onIntersectionEnter={() => {
        onEnter();
      }}
      ref={aRef}
    >
      <Box args={size} name="goal">
        <meshBasicMaterial color="green" opacity={0.5} transparent={true} />
      </Box>
    </RigidBody>
  );
}
