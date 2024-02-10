import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import {
  Html,
  KeyboardControls,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import Ball from './components/ball';
import Platform from './components/platform';
import Sky from './components/sky';
import { useControls } from 'leva';
import Goal from './components/goal';
import { useMemo, useState } from 'react';
import BoxObstacle from './components/box-obstacle';
import GameProvider from './providers/game-provider';
import StartMenu from './components/start-menu';
import Level1 from './levels/level-1';

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
  const keyboardControls = useMemo(
    () => [
      { name: 'forward', keys: ['ArrowUp'] },
      { name: 'left', keys: ['ArrowLeft'] },
      { name: 'right', keys: ['ArrowRight'] },
      { name: 'backward', keys: ['ArrowDown'] },
    ],
    []
  );

  return (
    <StyledApp>
      <Canvas camera={{ position: [0, 10, 8] }}>
        <ambientLight args={[0x404040, 20]} />
        <directionalLight position={[0, 20, 20]} />
        <OrbitControls />
        <Sky />

        <GameProvider>
          <PerspectiveCamera makeDefault position={[0, 12, 2]} />

          <StartMenu />
          <KeyboardControls map={keyboardControls}>
            <Level1 />
          </KeyboardControls>
        </GameProvider>
      </Canvas>
    </StyledApp>
  );
}

export default App;
