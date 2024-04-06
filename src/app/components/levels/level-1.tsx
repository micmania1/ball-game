import { useLevelContext } from '../providers/level-provider';
import LosePlane from '../physics/lose-plane';
import { useCallback, useMemo } from 'react';
import { myPlayer, usePlayersList } from 'playroomkit';
import Player from '../player';
import FollowCamera from '../physics/follow-camera';
import useSpawner from '../physics/use-spawner';
import { RapierRigidBody } from '@react-three/rapier';
import { Vector3Tuple } from 'three';
import AutoGenerateLevel from './auto-generate-level';
import levelMap from '../../../assets/level-1.glb';

export default function Level1() {
  const level = useLevelContext();
  const playerList = usePlayersList();

  const spawnArea: Vector3Tuple = [4, 0, 0];
  const spawnAreaOffset: Vector3Tuple = [0, 3, 1.5];
  const spawner = useSpawner(spawnArea, spawnAreaOffset);

  const lose = useCallback(
    (ball: RapierRigidBody) => {
      level.lose();
      spawner.spawn(ball);
      console.log('LOST');
    },
    [level, spawner]
  );

  const players = useMemo(
    () =>
      playerList.map((player) => {
        const map = spawner.map();
        const position = map.get(player.id) ?? spawner.calculatePosition();
        map.set(player.id, position);

        const me = myPlayer();
        return (
          <Player
            key={player.id}
            id={player.id}
            playerState={player}
            position={position}
          >
            <FollowCamera enabled={player.id === me.id} />
          </Player>
        );
      }),
    [playerList, spawner]
  );

  return (
    <group>
      <AutoGenerateLevel url={levelMap} />
      {players}
      <LosePlane width={1000} depth={1000} onHit={lose} />
    </group>
  );
}
