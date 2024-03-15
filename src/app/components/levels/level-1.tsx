import Platform from '../physics/platform';
import Goal from '../physics/goal';
import BoxObstacle from '../physics/box-obstacle';
import { useLevelContext } from '../providers/level-provider';
import LosePlane from '../physics/lose-plane';
import { useCallback } from 'react';
import { myPlayer, usePlayersList } from 'playroomkit';
import Player from '../player';
import FollowCamera from '../physics/follow-camera';
import useSpawner from '../physics/use-spawner';
import { RapierRigidBody } from '@react-three/rapier';
import { Vector3Tuple } from 'three';
import { PerspectiveCamera } from '@react-three/drei';

export default function Level1() {
  const level = useLevelContext();
  const playerList = usePlayersList();

  const spawnArea: Vector3Tuple = [4, 0, 0];
  const spawnAreaOffset: Vector3Tuple = [0, 3, -1];
  const spawner = useSpawner(spawnArea, spawnAreaOffset);

  const lose = useCallback(
    (ball: RapierRigidBody) => {
      level.lose();
      spawner.spawn(ball);
      console.log('LOST');
    },
    [level, spawner]
  );

  const players = playerList.map((player) => {
    const position = spawner.calculatePosition();
    const me = myPlayer();
    return (
      <Player key={player.id} playerState={player} position={position}>
        <FollowCamera enabled={player.id === me.id} />
      </Player>
    );
  });

  return (
    <>
      {players}

      <LosePlane width={100} depth={100} onHit={lose} />
      <group position={[0, 0, -35 * 0.5]}>
        <Platform size={[5, 0.1, 35]} />
      </group>
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
