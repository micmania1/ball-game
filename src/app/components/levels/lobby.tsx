import { Box, Html, PerspectiveCamera } from '@react-three/drei';
import {
  getRoomCode,
  isHost,
  me,
  usePlayersList,
  usePlayerState,
} from 'playroomkit';
import Player from '../player';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useGameContext } from '../providers/game-provider';
import { Physics, RigidBody } from '@react-three/rapier';
import { collisionGroups } from '../../config/physics';
import Platform from '../physics/platform';
import { Redirect } from 'wouter';
import levels from '../../config/levels';
import useSpawner from '../physics/use-spawner';
import { Vector3Tuple } from 'three';
import { Container, Fullscreen, Text } from '@react-three/uikit';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogAnchor,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import BallIcon from '../ui/ball-icon';
import { Label } from '../ui/label';
import { colors } from '../../config/profile';
import {
  useLocalProfileColor,
  useLocalProfileName,
} from '../providers/local-profile';
import { Input } from '../ui/input';
import JoystickProvider from '../providers/joystick-provider';
import styled from 'styled-components';

const JoystickArea = styled.div`
  position: absolute;
  left: 0;
  bottom: 100px;
  width: 100%;
  height: 120px;
  background: rgba(255, 0, 0, 0.5);
  z-index: 1000;
  margin: 0;
  padding: 0;
`;

export default function Lobby() {
  const playerList = usePlayersList();

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

  const roomCode = getRoomCode();
  return roomCode ? (
    <>
      <JoystickProvider mode="dynamic" zoneSelector="#joystick-lobby-zone">
        <group>
          <PerspectiveCamera
            position={[platformSize, platformSize, platformSize]}
            rotation={[-0.8, 0.56, 0.52]}
            makeDefault
          />
          <Physics>
            <Platform size={[platformSize, 0.1, platformSize]} />
            {players.map((player) => (
              <Player
                key={player.state.id}
                playerState={player.state}
                position={player.spawnPosition}
              ></Player>
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
        <LobbyUI roomCode={roomCode} />
      </JoystickProvider>
    </>
  ) : (
    <Redirect to={levels.start.url} />
  );
}

type LobbyUiProps = {
  roomCode: string;
};

function LobbyUI({ roomCode }: LobbyUiProps) {
  const game = useGameContext();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const currentPlayer = me();

  const [localName, setLocalProfileName] = useLocalProfileName();
  const [profileName] = usePlayerState(me(), 'name', localName);
  const [name, setName] = useState(profileName);

  const [localColor, setLocalProfileColor] = useLocalProfileColor();
  const [profileColor] = usePlayerState(me(), 'color', localColor);
  const [color, setColor] = useState(profileColor);

  const submit = useCallback(() => {
    setIsEditingProfile(false);
    currentPlayer.setState('name', name);
    setLocalProfileName(name);

    currentPlayer.setState('color', color);
    setLocalProfileColor(color);
  }, [color, currentPlayer, name, setLocalProfileColor, setLocalProfileName]);
  return (
    <Fullscreen justifyContent="space-between" padding={10}>
      <DialogAnchor>
        <Dialog
          open={isEditingProfile}
          onOpenChange={(open) => setIsEditingProfile(!open)}
        >
          <Card alignSelf={'center'} backgroundOpacity={0.8}>
            <CardContent
              flexDirection="row"
              gap={5}
              justifyContent="center"
              alignItems="center"
              paddingX={16}
              paddingY={16}
            >
              <Text fontSize={32}>Lobby code:</Text>
              <Text fontWeight="bold" fontSize={32}>
                {roomCode}
              </Text>
            </CardContent>
          </Card>
          <Card backgroundOpacity={0.8} width="100%" alignSelf="flex-end">
            <CardContent
              paddingX={16}
              paddingY={16}
              flexWrap="wrap"
              justifyContent="space-between"
              flexDirection="row"
            >
              <Button
                flexDirection="row"
                alignItems="center"
                gap={8}
                variant="ghost"
                onClick={() => setIsEditingProfile(true)}
              >
                <BallIcon color={profileColor} />
                <Text fontWeight="bold">{profileName}</Text>
              </Button>
              <Container justifyContent="center">
                {isHost() ? (
                  <Button onClick={() => game.setLevel('level1')}>
                    <Text>Start Game</Text>
                  </Button>
                ) : (
                  <Text>Waiting for the host...</Text>
                )}
              </Container>
            </CardContent>
          </Card>

          <DialogContent sm={{ maxWidth: 600 }}>
            <DialogHeader>
              <DialogTitle>
                <Text>Edit Profile</Text>
              </DialogTitle>
              <DialogDescription>
                <Text>Choose a display name and ball colour.</Text>
              </DialogDescription>
            </DialogHeader>
            <Container gap={16} paddingY={16} alignItems="center">
              <Label>
                <Text>Display Name</Text>
              </Label>
              <Input
                border={1}
                width={260}
                onValueChange={(value) => setName(value)}
                defaultValue={profileName}
              />
            </Container>
            <Container flexDirection="row" justifyContent="center" gap={24}>
              {colors.map((c) => (
                <Button
                  key={c.getHex()}
                  variant="link"
                  onClick={() => {
                    setColor(c.getHex());
                  }}
                >
                  <BallIcon
                    color={c}
                    size={48}
                    highlighted={c.getHex() === color}
                  />
                </Button>
              ))}
            </Container>
            <DialogFooter>
              <Button onClick={submit}>
                <Text>Save</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogAnchor>
    </Fullscreen>
  );
}
