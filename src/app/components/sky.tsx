import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import skybox from '../../assets/skybox.png';

export default function Sky() {
  const sky = useLoader(THREE.TextureLoader, skybox);
  return <Sphere args={[100]}>
    <meshBasicMaterial map={sky} side={THREE.BackSide} />
  </Sphere>
}
