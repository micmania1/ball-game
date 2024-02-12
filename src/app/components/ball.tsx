import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { Sphere, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { KeyboardControls } from '../config/keyboardControls';

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
  const speed = 50;
  const backwardSpeed = speed * 0.5;
  const sidewaysSpeed = 10;

  useFrame(() => {
    const ball = ballRef.current;
    const straight = int(get().backward) - int(get().forward);
    const sideways = int(get().left) - int(get().right);
    if (ball && (straight || sideways)) {
      ball.setAngvel(
        {
          x: straight < 0 ? straight * backwardSpeed : straight * speed,
          y: 0,
          z: sideways * sidewaysSpeed,
        },
        true
      );
    }
  });

  return (
    <RigidBody
      colliders={'ball'}
      position={[x, 3, z]}
      mass={1}
      angularDamping={2}
      restitution={1}
      ref={ballRef}
    >
      <Sphere args={[0.25]}>
        <meshStandardMaterial color="red" />
      </Sphere>
    </RigidBody>
  );
}
