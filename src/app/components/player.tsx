import { PlayerState, useIsHost, usePlayerState } from 'playroomkit';
import useVector3 from '../utils/use-vector3';
import { ReactNode, useCallback, useRef } from 'react';
import { RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import { KeyboardControls } from '../config/keyboard-controls';
import Ball from './physics/ball';
import { collisionGroups } from '../config/physics';
import * as THREE from 'three';
import useQuaternion from '../utils/use-quaternion';
import useHostFrame from '../multiplayer/use-host-frame';
import useNonHostFrame from '../multiplayer/use-non-host-frame';
import useCurrentPlayerFrame from '../multiplayer/use-current-player-frame';
import { useJoystick } from './providers/game-provider';

function int(b: boolean) {
  return b ? 1 : 0;
}

type PlayerProps = {
  playerState: PlayerState;
  position?: THREE.Vector3Tuple;
  children: ReactNode;
};
export default function Player({
  playerState,
  position = [0, 0, 0],
  children,
}: PlayerProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  const { isPaused } = useRapier();
  const [, get] = useKeyboardControls<KeyboardControls>();
  const acceleration = 0.25;
  const isHost = useIsHost();
  const visualPosition = useVector3();
  const visualRotation = useQuaternion();
  const [color] = usePlayerState(playerState, 'color', 'white');

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

  const joystick = useJoystick(playerState.id);
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
      const x = applyDeadZone(Math.sin(angle), deadZone) * -1;
      const y = applyDeadZone(Math.cos(angle), deadZone);

      playerState.setState('sideways', x);
      playerState.setState('forward', y);
    } else {
      playerState.setState('sideways', 0);
      playerState.setState('forward', 0);
    }
  });

  const ready = playerState.getState('ready');
  if (!ready) {
    return null;
  }

  const ball = (
    <Ball color={color} ref={ballRef}>
      {children}
    </Ball>
  );

  return isHost ? (
    <RigidBody
      colliders={'ball'}
      position={position}
      mass={1}
      angularDamping={1}
      linearDamping={1}
      restitution={0.5}
      friction={10}
      ref={rigidBodyRef}
      collisionGroups={collisionGroups.ball}
    >
      {ball}
    </RigidBody>
  ) : (
    ball
  );
}
