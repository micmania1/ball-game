import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import {
  Html,
  KeyboardControls,
  OrbitControls,
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

const Overlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
`;

const StartButton = styled.button`
  padding: 20px;
  box-shadow: none;
  border: 5px solid purple;
  border-radius: 10px;
  font-size: 32px;
  font-weight: bold;
  background-color: white;

  &:hover {
    background-color: #dedede;
    cursor: pointer;
  }
`;

export function App() {
  const { platformLength, platformWidth, startOffset, endOffset } = useControls(
    {
      platformLength: 35,
      platformWidth: 5,
      startOffset: -1,
      endOffset: 1,
    }
  );

  const keyboardControls = useMemo(
    () => [
      { name: 'forward', keys: ['ArrowUp'] },
      { name: 'left', keys: ['ArrowLeft'] },
      { name: 'right', keys: ['ArrowRight'] },
      { name: 'backward', keys: ['ArrowDown'] },
    ],
    []
  );

  const [isPaused, setIsPaused] = useState(true);

  return (
    <StyledApp>
      <Canvas camera={{ position: [0, 10, 8] }}>
        <ambientLight args={[0x404040, 20]} />
        <OrbitControls />
        <Sky />
        <PerspectiveCamera makeDefault position={[0, 12, 2]} />
        <directionalLight position={[0, 20, 20]} />

        {isPaused ? (
          <Html fullscreen={true}>
            <Overlay>
              <StartButton onClick={() => setIsPaused(false)}>
                Start
              </StartButton>
            </Overlay>
          </Html>
        ) : null}

        <KeyboardControls map={keyboardControls}>
          <Physics paused={isPaused}>
            <Ball position={[0, startOffset]} />
            <Platform size={[platformWidth, -platformLength]} />
            <Goal position={[0, -platformLength + endOffset]} />

            <BoxObstacle row={1} column={0} colspan={2} />
            <BoxObstacle row={1} column={3} colspan={2} />
            <BoxObstacle row={2} column={0} colspan={3} />
            <BoxObstacle row={3} column={2} colspan={3} />
            <BoxObstacle row={4} column={0} colspan={1} />
            <BoxObstacle row={4} column={3} colspan={2} />
            <BoxObstacle row={5} column={0} colspan={3} />
          </Physics>
        </KeyboardControls>
      </Canvas>
    </StyledApp>
  );
}

export default App;
