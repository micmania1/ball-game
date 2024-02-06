import { RigidBody } from '@react-three/rapier';
import { Plane } from '@react-three/drei';

export default function Platform() {
  return <RigidBody rotation={[Math.PI * 1.5, 0, 0]}>
    <Plane args={[5, 100]} />
  </RigidBody>
}
