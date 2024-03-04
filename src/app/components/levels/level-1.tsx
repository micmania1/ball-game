import Platform from '../physics/platform';
import Goal from '../physics/goal';
import BoxObstacle from '../physics/box-obstacle';
import { useLevelContext } from '../providers/level-provider';
import Ball, { BallRef } from '../physics/ball';
import CameraFocus from '../components/CameraFocus';
import LosePlans from '../physics/lose-plans';
import useVector3 from '../../utils/use-vector3';
import { useCallback, useRef } from 'react';

export default function Level1() {
  const level = useLevelContext();
  const ballRef = useRef<BallRef>(null);
  const ballStartPosition = useVector3([0, 3, -1]);

  const lose = useCallback(() => {
    level.lose();

    const ball = ballRef.current?.rigidBody();
    if (ball) {
      ball.sleep();
      ball.resetTorques(false);
      ball.resetTorques(false);
      ball.setTranslation(ballStartPosition, true);
    }
  }, [ballStartPosition, level]);

  return (
    <>
      <Ball
        position={[
          ballStartPosition.x,
          ballStartPosition.y,
          ballStartPosition.z,
        ]}
        ref={ballRef}
      />
      <CameraFocus focusRef={ballRef} offset={[0, 5, 10]} />

      <LosePlans width={100} depth={100} onHit={lose} />
      <Platform size={[5, -35]} />
      <Goal
        position={[0, 1.25, -32]}
        size={[2.5, 2.5, 2.5]}
        onEnter={() => {
          level.won();
        }}
      />

      <BoxObstacle row={1} column={0} colspan={2} />
      <BoxObstacle row={1} column={3} colspan={2} />

      <BoxObstacle row={2} column={0} colspan={3} />

      <BoxObstacle row={3} column={2} colspan={3} />

      <BoxObstacle row={4} column={0} colspan={1} />
      <BoxObstacle row={4} column={3} colspan={2} />

      <BoxObstacle row={5} column={0} colspan={3} />
    </>
  );
}
