import { RigidBody } from '@react-three/rapier';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

type PlatformProps = {
  size: THREE.Vector2Tuple;
};

export default function Platform({ size }: PlatformProps) {
  const [width, length] = size;
  return <group position={[0, 0, length * 0.5]}>
    <RigidBody rotation={[Math.PI * 0.5, 0, 0]} restitution={0}>
      <Plane args={[width, length]}>
        <meshStandardMaterial color={0x555555} />
      </Plane>
    </RigidBody>
  </group>
}
