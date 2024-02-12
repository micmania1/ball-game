import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import {
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import Sky from './components/sky';
import { useMemo } from 'react';
import GameProvider from './providers/game-provider';
import StartMenu from './components/start-menu';
import Level1 from './levels/level-1';
import { Route, Switch } from 'wouter';
import LevelProvider from './providers/level-provider';

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
      { name: 'pause', keys: ['p'] },
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

        <KeyboardControls map={keyboardControls}>
          <GameProvider>
            <PerspectiveCamera makeDefault position={[0, 12, 2]} />

            <Switch>
              <Route path={'/'}>
                <StartMenu />
              </Route>
              <Route path={'/level-1'}>
                <LevelProvider platformWidth={5} platformLength={35}>
                  <Level1 />
                </LevelProvider>
              </Route>
            </Switch>
            {/*<Hud />*/}
          </GameProvider>
        </KeyboardControls>
      </Canvas>
    </StyledApp>
  );
}

export default App;
