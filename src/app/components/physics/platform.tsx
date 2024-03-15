import { interactionGroups, RigidBody } from '@react-three/rapier';
import { Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { collisionGroups, restitution } from '../../config/physics';

type PlatformProps = {
  size: THREE.Vector3Tuple;
};

export default function Platform({ size }: PlatformProps) {
  const [width, height, depth] = size;
  return (
    <group position={[0, height * 0.5, 0]}>
      <RigidBody
        restitution={restitution.floor}
        friction={1}
        collisionGroups={collisionGroups.environment}
        type="fixed"
      >
        <Box args={[width, height, depth]}>
          <meshStandardMaterial color={0x555555} />
        </Box>
      </RigidBody>
    </group>
  );
}
