import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import skybox from '../../assets/skybox.png';
import CustomShaderMaterial from 'three-custom-shader-material';
import { MeshPhysicalMaterial } from 'three';

const fragementShader = `
void main() {
  csm_Emissive = vec3(csm_DiffuseColor);
}
`;

export default function Sky() {
  const sky = useLoader(THREE.TextureLoader, skybox);
  return (
    <Sphere args={[800]}>
      <CustomShaderMaterial
        baseMaterial={MeshPhysicalMaterial}
        map={sky}
        side={THREE.BackSide}
        fragmentShader={fragementShader}
      />
    </Sphere>
  );
}
