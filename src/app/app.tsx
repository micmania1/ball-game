import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Sky from './components/sky';
import { lazy, Suspense } from 'react';
import GameProvider from './providers/game-provider';
import { Route, Switch } from 'wouter';
import levels from './config/levels';
import StartMenu from './components/start-menu';
import keyboardControls from './config/keyboard-controls';

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
      <Canvas camera={{ position: [0, 10, 15] }}>
        <ambientLight args={[0x404040, 20]} />
        <directionalLight position={[0, 20, 20]} />
        <Sky />

        <KeyboardControls map={keyboardControls}>
          <GameProvider levelConfig={levels}>
            <Switch>
              <Suspense fallback={null}>
                <Route path={levels.start.url}>
                  <StartMenu />
                </Route>
                <Route path={levels.level1.url}>
                  <LevelProvider>
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
