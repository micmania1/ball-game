import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { ComponentProps, forwardRef, useMemo, useRef } from 'react';
import CustomShaderMaterial from 'three-custom-shader-material';
import CustomShaderMaterialImpl from 'three-custom-shader-material/vanilla';

const vertexShader = `
varying vec3 v_normal;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  v_normal = normal;
}
`;

const fragmentShader = `
uniform float u_seed;
varying vec3 v_normal;

void main() {
  float speed = u_seed * 0.2;
  float direction = v_normal.y * v_normal.x;
  float pattern = 1.0 - clamp(mod(speed + direction, 0.3), 0.1, 0.9);
  
  csm_DiffuseColor = vec4(vec3(csm_DiffuseColor * pattern), 1.0);
  csm_Emissive = vec3(csm_DiffuseColor * 0.3);
}`;

type BallProps = {
  radius: number;
  color: THREE.ColorRepresentation;
} & ComponentProps<typeof Sphere>;

const Ball = forwardRef<THREE.Mesh, BallProps>(function (
  { radius, color, children, ...props },
  ref
) {
  const materialRef = useRef<CustomShaderMaterialImpl>(null);
  const uniforms = useMemo(
    () => ({
      u_seed: {
        value: Math.random(),
      },
    }),
    []
  );

  return (
    <Sphere args={[radius]} {...props} ref={ref}>
      <CustomShaderMaterial
        baseMaterial={THREE.MeshPhysicalMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        color={color}
        ref={materialRef}
      />
      {children}
    </Sphere>
  );
});

export default Ball;
