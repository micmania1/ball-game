import { Physics } from '@react-three/rapier';
import Ball from '../components/ball';
import Platform from '../components/platform';
import Goal from '../components/goal';
import BoxObstacle from '../components/box-obstacle';
import { useLevelContext } from '../providers/level-provider';

export default function Level1() {
  const { isPaused, platformWidth, platformLength } = useLevelContext();

  return (
    <Physics paused={isPaused}>
      <Ball position={[0, -1]} />
      <Platform size={[platformWidth, -platformLength]} />
      <Goal position={[0, -platformLength + 1]} />

      <BoxObstacle row={1} column={0} colspan={2} />
      <BoxObstacle row={1} column={3} colspan={2} />
      <BoxObstacle row={2} column={0} colspan={3} />
      <BoxObstacle row={3} column={2} colspan={3} />
      <BoxObstacle row={4} column={0} colspan={1} />
      <BoxObstacle row={4} column={3} colspan={2} />
      <BoxObstacle row={5} column={0} colspan={3} />
    </Physics>
  );
}
