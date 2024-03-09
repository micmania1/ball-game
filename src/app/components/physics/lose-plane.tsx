import {
  CuboidCollider,
  IntersectionEnterHandler,
  IntersectionEnterPayload,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from '@react-three/rapier';
import { Box } from '@react-three/drei';
import { collisionGroups } from '../../config/physics';

type LosePlaneProps = {
  width: number;
  depth: number;
  onHit(rigidBody: RapierRigidBody): void;
};

export default function LosePlane({ width, depth, onHit }: LosePlaneProps) {
  const { isDebug } = useRapier();
  return (
    <RigidBody
      type="fixed"
      args={[width, 1, depth]}
      position={[0, -10, 0]}
      colliders="cuboid"
      sensor
      onIntersectionEnter={(payload: IntersectionEnterPayload) => {
        const rigidBody = payload.other.rigidBody;
        if (rigidBody) {
          onHit(rigidBody);
        }
      }}
      collisionGroups={collisionGroups.lose}
    >
      {isDebug ? (
        <Box args={[width, 1, depth]}>
          <meshBasicMaterial color="pink" opacity={0.5} transparent={true} />
        </Box>
      ) : (
        <CuboidCollider args={[width, 1, depth]} />
      )}
    </RigidBody>
  );
}
