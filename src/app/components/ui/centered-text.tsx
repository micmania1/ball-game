import { Html } from '@react-three/drei';
import styled from 'styled-components';
import { ReactNode } from 'react';

const Container = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.h1`
  color: white;
  font-family: 'arial', serif;
  text-transform: uppercase;
`;

type CenteredTextProps = {
  children: ReactNode;
};
export default function CenteredText({ children }: CenteredTextProps) {
  return (
    <Html fullscreen>
      <Container>
        <Text>{children}</Text>
      </Container>
    </Html>
  );
}
