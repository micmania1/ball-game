import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import {
  Box,
  PerspectiveCamera,
  Sphere,
  useCamera,
  useKeyboardControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import useVector3 from '../utils/use-vector3';
import { KeyboardControls } from '../config/keyboard-controls';
import { Mesh } from 'three';

type BallProps = {
  position: THREE.Vector2Tuple;
};

function int(b: boolean) {
  return b ? 1 : 0;
}

export default function Ball({ position }: BallProps) {
  const [, get] = useKeyboardControls<KeyboardControls>();
  const ballRef = useRef<RapierRigidBody>(null);
  const [x, z] = position;
  const controlCamera = true;
  const mass = 1;
  const radius = 0.25;
  const acceleration = 0.25;
  const friction = 10;
  const angularDamping = 1;
  const linearDamping = 1;
  const restitution = 0.5;
  const focusPosition = useVector3();
  const camera = useThree((three) => three.camera);

  useFrame(({ clock }, delta) => {
    // const debugBox = boxRef.current;
    const ball = ballRef.current;
    const forward = int(get().backward) - int(get().forward);
    const sideways = int(get().left) - int(get().right);

    if (ball && (forward || sideways)) {
      const forwardMovement = forward * acceleration * delta;
      const sidewaysMovement = sideways * acceleration * delta;
      ball.resetTorques(false);
      ball.applyTorqueImpulse(
        { x: forwardMovement, y: 0, z: sidewaysMovement },
        true
      );
    }

    if (ball && controlCamera) {
      const { x, y, z } = ball.translation();
      focusPosition.set(x, y, z);

      camera.lookAt(focusPosition);
      camera.position.lerp(
        {
          x: focusPosition.x,
          y: focusPosition.y + 5,
          z: focusPosition.z + 10,
        },
        0.1
      );
    }
  });

  return (
    <>
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
    </>
  );
}
