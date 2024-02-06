import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import Ball from './components/ball';
import Platform from './components/platform';
import Sky from './components/sky';

const StyledApp = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
`;

export function App() {
  return (
    <StyledApp>
      <Canvas camera={{ position: [0, 5, -5] }}>
        <ambientLight args={[0x404040, 20]} />
        <OrbitControls />
        <Sky />
        <Physics>
          <Ball />
          <Platform />
          <Box args={[5, 5, 0.1]}>
            <meshStandardMaterial color={0x00ee00} />
          </Box>
        </Physics>
      </Canvas>
    </StyledApp>
  );
}

export default App;
