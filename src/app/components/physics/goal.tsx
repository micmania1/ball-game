import { Box } from '@react-three/drei';
import * as THREE from 'three';
import { RigidBody } from '@react-three/rapier';
import { collisionGroups } from '../../config/physics';

type GoalProps = {
  position: THREE.Vector3Tuple;
  size: THREE.Vector3Tuple;
  onEnter(): void;
};

export default function Goal({ position, size, onEnter }: GoalProps) {
  return (
    <RigidBody
      type="fixed"
      args={size}
      position={position}
      colliders="cuboid"
      sensor
      collisionGroups={collisionGroups.goal}
      onIntersectionEnter={() => {
        onEnter();
      }}
    >
      <Box args={size} name="goal">
        <meshBasicMaterial color="green" opacity={0.5} transparent={true} />
      </Box>
    </RigidBody>
  );
}
