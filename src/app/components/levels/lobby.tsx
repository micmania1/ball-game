import { Box, Html, Hud, PerspectiveCamera } from '@react-three/drei';
import { getRoomCode, useIsHost, usePlayersList } from 'playroomkit';
import Player from '../player';
import { useEffect, useMemo, useRef } from 'react';
import { useGameContext } from '../providers/game-provider';
import { Physics, RigidBody } from '@react-three/rapier';
import { collisionGroups } from '../../config/physics';
import Platform from '../physics/platform';
import FollowCamera from '../physics/follow-camera';
import { useThree } from '@react-three/fiber';
import useVector3 from '../../utils/use-vector3';
import useRoomCode from '../../multiplayer/use-room-code';
import { Redirect } from 'wouter';
import levels from '../../config/levels';
import useSpawner from '../physics/use-spawner';
import { Vector3Tuple } from 'three';
import Button from '../ui/button';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: calc(env(safe-area-inset-top) + 1em)
    calc(env(safe-area-inset-right) + 1em)
    calc(env(safe-area-inset-bottom) + 1em)
    calc(env(safe-area-inset-left) + 1em);
  gap: 1em;
  box-sizing: border-box;
  flex-direction: column;
`;

const Code = styled.div`
  display: block;
  color: white;
  font-family: 'Ariel', serif;
  font-size: 2rem;
  text-transform: uppercase;
`;

export default function Lobby() {
  const playerList = usePlayersList();
  const game = useGameContext();
  const camera = useThree((three) => three.camera);
  const cameraFocus = useVector3();
  const roomCode = useRoomCode();
  const isHost = useIsHost();

  useEffect(() => {
    console.log('room code', getRoomCode());
    camera.lookAt(cameraFocus);
  }, [camera, cameraFocus, game]);

  const platformSize = 10;
  const spawnArea: Vector3Tuple = [platformSize * 0.8, 5, platformSize * 0.8];
  const spawner = useSpawner(spawnArea);
  const spawnPositionMap = useRef<Map<string, Vector3Tuple>>(new Map());

  // We do this to prevent spawnPosition being recalculated every time causing all players to re-render
  const players = useMemo(() => {
    const map = spawnPositionMap.current;
    return playerList.map((playerState) => ({
      state: playerState,
      spawnPosition: map.get(playerState.id) ?? spawner.calculatePosition(),
    }));
  }, [playerList, spawner]);

  return roomCode ? (
    <>
      <group>
        <PerspectiveCamera
          position={[platformSize, platformSize, platformSize]}
          makeDefault
        />
        <Physics>
          <Platform size={[platformSize, 0.1, platformSize]} />
          {players.map((player) => (
            <Player
              key={player.state.id}
              playerState={player.state}
              position={player.spawnPosition}
            >
              <FollowCamera enabled={false} />
            </Player>
          ))}
          <RigidBody
            type="fixed"
            position={[0, -10, 0]}
            sensor
            collisionGroups={collisionGroups.environment}
            onIntersectionEnter={(e) => {
              const ball = e.other.rigidBody;
              if (ball) {
                spawner.spawn(ball);
              }
            }}
            includeInvisible
          >
            <Box args={[50, 1, 50]} visible={false} />
          </RigidBody>
        </Physics>
      </group>

      {isHost ? (
        <Hud>
          <Html fullscreen>
            <Container>
              <Button onClick={() => game.setLevel('level1')}>Start</Button>
              <Code>Code: {roomCode}</Code>
            </Container>
          </Html>
        </Hud>
      ) : (
        false
      )}
    </>
  ) : (
    <Redirect to={levels.start.url} />
  );
}
