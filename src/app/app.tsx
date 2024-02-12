import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import {
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei';
import Sky from './components/sky';
import { lazy, Suspense } from 'react';
import GameProvider from './providers/game-provider';
import { Redirect, Route, Switch } from 'wouter';
import levels from './config/levels';
import keyboardControls from './config/keyboardControls';
import StartMenu from './components/start-menu';

const LevelProvider = lazy(() => import('./providers/level-provider'));
const Level1 = lazy(() => import('./levels/level-1'));

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
      <Canvas camera={{ position: [0, 10, 8] }}>
        <ambientLight args={[0x404040, 20]} />
        <directionalLight position={[0, 20, 20]} />
        <OrbitControls />
        <Sky />

        <KeyboardControls map={keyboardControls}>
          <GameProvider levelConfig={levels}>
            <PerspectiveCamera makeDefault position={[0, 12, 2]} />

            <Switch>
              <Suspense fallback={null}>
                <Route path={levels.start.url}>
                  <StartMenu />
                </Route>
                <Route path={levels.level1.url}>
                  <LevelProvider platformWidth={5} platformLength={35}>
                    <Level1 />
                  </LevelProvider>
                </Route>
              </Suspense>
            </Switch>
          </GameProvider>
        </KeyboardControls>
      </Canvas>
    </StyledApp>
  );
}

export default App;
