import { PlayerState, useIsHost, usePlayerState } from 'playroomkit';
import useVector3 from '../utils/use-vector3';
import { ReactNode, useCallback, useRef } from 'react';
import { RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { Billboard, Text, useKeyboardControls } from '@react-three/drei';
import { KeyboardControls } from '../config/keyboard-controls';
import Ball from './physics/ball';
import { collisionGroups, restitution } from '../config/physics';
import * as THREE from 'three';
import useQuaternion from '../utils/use-quaternion';
import useHostFrame from '../multiplayer/use-host-frame';
import useNonHostFrame from '../multiplayer/use-non-host-frame';
import useCurrentPlayerFrame from '../multiplayer/use-current-player-frame';
import { useIsPrivateGame } from './providers/game-provider';
import { useFrame, useThree } from '@react-three/fiber';
import { useJoystick } from './providers/joystick-provider';

function int(b: boolean) {
  return b ? 1 : 0;
}

type PlayerProps = {
  playerState: PlayerState;
  position?: THREE.Vector3Tuple;
  children?: ReactNode;
  id?: string;
};
export default function Player({
  playerState,
  position = [0, 0, 0],
  children,
  id,
}: PlayerProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  const { isPaused } = useRapier();
  const [, get] = useKeyboardControls<KeyboardControls>();
  const acceleration = 0.25;
  const isHost = useIsHost();
  const visualPosition = useVector3();
  const visualRotation = useQuaternion();
  const [color] = usePlayerState(playerState, 'color', 0xff0000);
  const [playerName] = usePlayerState(playerState, 'name', '');
  const playerNameRef = useRef<THREE.Group>(null);
  const camera = useThree((three) => three.camera);
  const isPrivateGame = useIsPrivateGame();

  useHostFrame((_, delta) => {
    const rigidBody = rigidBodyRef.current;
    const ball = ballRef.current;
    if (rigidBody && ball) {
      const forward = playerState.getState('forward') ?? 0;
      const sideways = playerState.getState('sideways') ?? 0;

      if (!isPaused && (forward || sideways)) {
        const forwardMovement = forward * acceleration * delta;
        const sidewaysMovement = sideways * acceleration * delta;

        rigidBody.resetTorques(false);
        rigidBody.applyTorqueImpulse(
          { x: forwardMovement, y: 0, z: sidewaysMovement },
          true
        );
      }

      visualPosition.setFromMatrixPosition(ball.matrixWorld);
      playerState.setState('position', {
        x: visualPosition.x,
        y: visualPosition.y,
        z: visualPosition.z,
      });

      visualRotation.setFromRotationMatrix(ball.matrixWorld);
      playerState.setState('rotation', {
        x: visualRotation.x,
        y: visualRotation.y,
        z: visualRotation.z,
        w: visualRotation.w,
      });
    }
  });

  useNonHostFrame(() => {
    const ball = ballRef.current;
    if (ball) {
      const position: THREE.Vector3Like = playerState.getState('position');
      if (position) {
        ball.position.set(position.x, position.y, position.z);
      }

      const rotation: THREE.QuaternionLike = playerState.getState('rotation');
      if (rotation) {
        ball.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      }
    }
  });

  const joystick = useJoystick();
  const applyDeadZone = useCallback((value: number, deadZone: number) => {
    return Math.abs(value) > deadZone ? value : 0;
  }, []);
  useCurrentPlayerFrame(playerState.id, () => {
    const isKeyboardPressed =
      get().left || get().right || get().forward || get().backward;

    if (isKeyboardPressed) {
      playerState.setState('sideways', int(get().left) - int(get().right));
      playerState.setState('forward', int(get().backward) - int(get().forward));
    } else if (joystick && joystick.isJoystickPressed()) {
      const deadZone = 0.2;
      const angle = joystick.angle();
      const x = applyDeadZone(Math.cos(angle), deadZone) * -1;
      const y = applyDeadZone(Math.sin(angle), deadZone) * -1;

      playerState.setState('sideways', x);
      playerState.setState('forward', y);
    } else {
      playerState.setState('sideways', 0);
      playerState.setState('forward', 0);
    }
  });

  useFrame(() => {
    const playerName = playerNameRef.current;
    const ball = ballRef.current;
    if (playerName && ball && camera) {
      playerName.lookAt(camera.position);
      playerName.position.setFromMatrixPosition(ball.matrixWorld);
      playerName.position.y += 0.5;
    }
  });

  const ball = (
    <Ball color={color} ref={ballRef}>
      {children}
    </Ball>
  );

  const playerNameBillboard = isPrivateGame ? null : (
    <Billboard ref={playerNameRef}>
      <Text fontSize={0.3} outlineColor="black" color="white">
        {playerName}
      </Text>
    </Billboard>
  );

  return isHost ? (
    <>
      {playerNameBillboard}
      <RigidBody
        name={id}
        colliders={'ball'}
        position={position}
        mass={1}
        angularDamping={1}
        linearDamping={0.75}
        restitution={restitution.ball}
        friction={10}
        ref={rigidBodyRef}
        collisionGroups={collisionGroups.ball}
      >
        {ball}
      </RigidBody>
    </>
  ) : (
    <>
      {playerNameBillboard}
      {ball}
    </>
  );
}
