import { Box } from '@react-three/drei';
import * as THREE from 'three';

type GoalProps = {
  position: THREE.Vector2Tuple;
}

export default function Goal({ position }: GoalProps) {
  const [x, z] = position;

  return <Box args={[5, 5, 0.1]} position={[x, 2.5, z]}>
    <meshStandardMaterial color={0x00ee00} opacity={0.75} transparent={true} />
  </Box>
}
