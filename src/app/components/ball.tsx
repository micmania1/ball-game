import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Sphere, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { KeyboardControls } from '../config/keyboard-controls';

type BallProps = {
  position: THREE.Vector2Tuple;
};

export type BallRef = {
  rigidBody(): RapierRigidBody | null;
};

function int(b: boolean) {
  return b ? 1 : 0;
}

const Ball = forwardRef<BallRef, BallProps>(function ({ position }, ref) {
  const [, get] = useKeyboardControls<KeyboardControls>();
  const ballRef = useRef<RapierRigidBody>(null);
  const [x, z] = position;
  const mass = 1;
  const radius = 0.25;
  const acceleration = 25;
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
    // const debugBox = boxRef.current;
    const ball = ballRef.current;
    const forward = int(get().backward) - int(get().forward);
    const sideways = int(get().left) - int(get().right);

    if (ball && (forward || sideways)) {
      const forwardMovement = forward * acceleration * delta;
      const sidewaysMovement = sideways * acceleration * delta;
      ball.resetTorques(false);
      ball.addTorque({ x: forwardMovement, y: 0, z: sidewaysMovement }, true);
    }
  });

  return (
    <RigidBody
      colliders={'ball'}
      position={[x, 3, z]}
      mass={mass}
      angularDamping={angularDamping}
      linearDamping={linearDamping}
      restitution={restitution}
      friction={friction}
      ref={ballRef}
    >
      <Sphere args={[radius]}>
        <meshStandardMaterial color="red" />
      </Sphere>
    </RigidBody>
  );
});

export default Ball;
