import { Html } from '@react-three/drei';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.h1`
  color: white;
  font-family: 'arial', serif;
  text-transform: uppercase;
`;

export default function Loading() {
  return (
    <Html fullscreen>
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    </Html>
  );
}
