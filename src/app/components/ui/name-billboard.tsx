import { Billboard } from '@react-three/drei';
import { Container, Root, Text } from '@react-three/uikit';
import { Card, CardContent } from './card';
import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3Tuple } from 'three';
import useVector3 from '../../utils/use-vector3';

type NameBillboardProps = {
  name: string;
  offset?: Vector3Tuple;
  visible?: boolean;
  children: ReactNode;
};
export function NameBillboard({
  name,
  children,
  offset = [0, 0.7, 0],
  visible = true,
}: NameBillboardProps) {
  const billboardRef = useRef<THREE.Group>(null);
  const childGroupRef = useRef<THREE.Group>(null);
  const offsetV3 = useVector3(offset);

  useFrame(() => {
    const billboard = billboardRef.current;
    const child = childGroupRef.current?.children[0];
    if (billboard && child) {
      billboard.position.setFromMatrixPosition(child.matrixWorld);
      billboard.position.add(offsetV3);
    }
  });
  return (
    <>
      <group position={offset} ref={billboardRef} visible={visible}>
        <Billboard>
          <Root>
            <Card
              positionBottom={200}
              positionType="relative"
              padding={16}
              backgroundOpacity={0.7}
              borderRadius={100}
              border={12}
              borderColor={0x000000}
              minWidth={1800}
            >
              <CardContent
                alignContent="center"
                justifyContent="center"
                alignItems="center"
              >
                <Container padding={16}>
                  <Text fontSize={160} fontWeight="bold">
                    {name}
                  </Text>
                </Container>
              </CardContent>
            </Card>
          </Root>
        </Billboard>
      </group>
      <group ref={childGroupRef}>{children}</group>
    </>
  );
}
