import { RigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';
import { useLevelContext } from '../providers/level-provider';

type BoxObstacleProps = {
  row: number;
  column: number;
  colspan: number;
};

export default function BoxObstacle({
  row,
  column,
  colspan,
}: BoxObstacleProps) {
  const { platformWidth } = useLevelContext();

  // @todo Change gap/placement logic to grid based system for quick configuration
  const rowGap = 5;
  const posZ = row * rowGap * -1;

  const centreOffset = platformWidth * 0.5;
  const width = colspan;
  const posX = -(colspan * 0.5) - column;

  return (
    <group position={[centreOffset, 0, 0]}>
      <RigidBody type="fixed" position={[posX, 0.5, posZ]} restitution={1}>
        <Box args={[width, 1, 0.2]}>
          <meshStandardMaterial color={'white'} />
        </Box>
      </RigidBody>
    </group>
  );
}
