import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier';
import { Box } from '@react-three/drei';

type LosePlaneProps = {
  width: number;
  depth: number;
  onHit(): void;
};

export default function LosePlans({ width, depth, onHit }: LosePlaneProps) {
  const { isDebug } = useRapier();
  return (
    <RigidBody
      type="fixed"
      args={[width, 1, depth]}
      position={[0, -10, 0]}
      colliders="cuboid"
      sensor
      onIntersectionEnter={() => onHit()}
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
