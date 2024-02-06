import { RigidBody } from '@react-three/rapier';
import { Sphere } from '@react-three/drei';

export default function Ball() {
  return <RigidBody position={[0, 3, 0]}>
    <Sphere args={[0.25]}>
      <meshStandardMaterial color="red" />
    </Sphere>
  </RigidBody>
}
