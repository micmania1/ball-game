import { PlayerState, useIsHost, usePlayerState } from 'playroomkit';
import useVector3 from '../utils/use-vector3';
import { ReactNode, useEffect, useRef } from 'react';
import {
  BallCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from '@react-three/rapier';
import { Billboard, Text, useKeyboardControls } from '@react-three/drei';
import { KeyboardControls } from '../config/keyboard-controls';
import Ball from './physics/ball';
import {
  collisionGroups,
  friction as frictionConfig,
  restitution,
} from '../config/physics';
import * as THREE from 'three';
import useQuaternion from '../utils/use-quaternion';
import useHostFrame from '../multiplayer/use-host-frame';
import useNonHostFrame from '../multiplayer/use-non-host-frame';
import useCurrentPlayerFrame from '../multiplayer/use-current-player-frame';
import { useIsPrivateGame } from './providers/game-provider';
import { useFrame, useThree } from '@react-three/fiber';
import { useJoystick } from './providers/joystick-provider';
import { Ray } from '@dimforge/rapier3d-compat';

function int(b: boolean) {
  return b ? 1 : 0;
}

type PlayerProps = {
  playerState: PlayerState;
  jumpImpulse?: THREE.Vector3Tuple;
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
  const isHost = useIsHost();
  const visualPosition = useVector3();
  const visualRotation = useQuaternion();
  const [color] = usePlayerState(playerState, 'color', 0xff0000);
  const [playerName] = usePlayerState(playerState, 'name', '');
  const playerNameRef = useRef<THREE.Group>(null);
  const camera = useThree((three) => three.camera);
  const isPrivateGame = useIsPrivateGame();
  const mass = 0.2;
  const friction = frictionConfig.ball;
  const acceleration = mass ** mass;
  const jumpImpulseV3 = useVector3([0, mass * 6, 0]);

  const [isJumpPressed, setIsJumpPressed] = usePlayerState(
    playerState,
    'jump',
    false
  );

  const { world } = useRapier();

  const isJumpingRef = useRef(false);
  useEffect(() => {
    if (!isHost) {
      return;
    }

    if (isJumpPressed) {
      const rigidBody = rigidBodyRef.current;
      const ballCollider = rigidBody?.collider(0);
      if (rigidBody && ballCollider) {
        const down = { x: 0, y: -1, z: 0 };
        const ray = new Ray(ballCollider.translation(), down);
        const maxToi = radius * 2;
        const solid = false;
        world.intersectionsWithRay(ray, maxToi, solid, (hit) => {
          const isGrounded =
            hit.collider.collisionGroups() === collisionGroups.ground;
          if (isGrounded) {
            isJumpingRef.current = true;
            return false;
          }
          return true;
        });
      }
    } else {
      isJumpingRef.current = false;
    }
  }, [isHost, isJumpPressed, jumpImpulseV3, world]);

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

      if (!isPaused && isJumpingRef.current) {
        const ballCollider = rigidBody.collider(0);
        if (ballCollider) {
          isJumpingRef.current = false;
          rigidBody.applyImpulse(jumpImpulseV3, true);
        }
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
  useCurrentPlayerFrame(playerState.id, () => {
    const isMovementKeyPressed =
      get().left || get().right || get().forward || get().backward;

    if (isMovementKeyPressed) {
      playerState.setState('sideways', int(get().right) - int(get().left));
      playerState.setState('forward', int(get().forward) - int(get().backward));
    } else if (joystick && joystick.isJoystickPressed()) {
      const angle = joystick.angle();
      const x = Math.cos(angle);
      const y = Math.sin(angle);

      playerState.setState('sideways', x);
      playerState.setState('forward', y);
    } else {
      playerState.setState('sideways', 0);
      playerState.setState('forward', 0);
    }

    const isKeyboardJumpPressed = get().jump;
    const isJoystickJumpPressed = joystick.button('jump');
    setIsJumpPressed(isKeyboardJumpPressed || isJoystickJumpPressed);
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

  const radius = 0.25;
  const ball = (
    <Ball radius={radius} color={color} ref={ballRef}>
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
        colliders={false}
        position={position}
        angularDamping={1}
        linearDamping={0.75}
        restitution={restitution.ball}
        ref={rigidBodyRef}
        collisionGroups={collisionGroups.ball}
      >
        <BallCollider args={[radius]} mass={mass} friction={friction} />
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
