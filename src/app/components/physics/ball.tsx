import {
  interactionGroups,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from '@react-three/rapier';
import { Sphere, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { KeyboardControls } from '../../config/keyboard-controls';
import { collisionGroups } from '../../config/physics';

type BallProps = {
  position: THREE.Vector3Tuple;
};

export type BallRef = {
  rigidBody(): RapierRigidBody | null;
};

function int(b: boolean) {
  return b ? 1 : 0;
}

const Ball = forwardRef<BallRef, BallProps>(function ({ position }, ref) {
  const { isPaused } = useRapier();
  const [, get] = useKeyboardControls<KeyboardControls>();
  const ballRef = useRef<RapierRigidBody>(null);
  const [x, y, z] = position;
  const mass = 1;
  const radius = 0.25;
  const acceleration = 0.25;
  const friction = 10;
  const angularDamping = 1;
  const linearDamping = 1;
  const restitution = 0.5;

  useImperativeHandle(ref, () => {
    return {
      rigidBody() {
        return ballRef.current;
      },
    };
  });

  useFrame(({ clock }, delta) => {
    const ball = ballRef.current;
    const forward = int(get().backward) - int(get().forward);
    const sideways = int(get().left) - int(get().right);

    if (!isPaused && ball && (forward || sideways)) {
      const forwardMovement = forward * acceleration * delta;
      const sidewaysMovement = sideways * acceleration * delta;
      ball.resetTorques(false);
      ball.applyTorqueImpulse(
        { x: forwardMovement, y: 0, z: sidewaysMovement },
        true
      );
    }
  });

  return (
    <RigidBody
      colliders={'ball'}
      position={[x, y, z]}
      mass={mass}
      angularDamping={angularDamping}
      linearDamping={linearDamping}
      restitution={restitution}
      friction={friction}
      ref={ballRef}
      collisionGroups={collisionGroups.ball}
    >
      <Sphere args={[radius]} name="ball">
        <meshStandardMaterial color="red" />
      </Sphere>
    </RigidBody>
  );
});

export default Ball;
