import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Sky from './components/sky';
import { lazy, Suspense } from 'react';
import GameProvider from './components/providers/game-provider';
import { Route, Router, Switch } from 'wouter';
import levels from './config/levels';
import StartMenu from './components/ui/start-menu';
import keyboardControls from './config/keyboard-controls';
import { useHashLocation } from 'wouter/use-hash-location';
import Loading from './components/ui/loading';
import { defaultCameraOffset } from './config/camera';
import RouteFallback from './components/route-fallback';
import JoinRoom, { JoinRoomParams } from './components/levels/join-room';
import CenteredText from './components/ui/centered-text';

const LevelProvider = lazy(
  () => import('./components/providers/level-provider')
);
const Level1 = lazy(() => import('./components/levels/level-1'));
const Lobby = lazy(() => import('./components/levels/lobby'));

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
      <Canvas camera={{ position: defaultCameraOffset }}>
        <ambientLight args={[0x404040, 20]} />
        <directionalLight position={[0, 20, 20]} />
        <Sky />

        <KeyboardControls map={keyboardControls}>
          <Router hook={useHashLocation}>
            <GameProvider levelConfig={levels}>
              <Suspense fallback={<Loading />}>
                <Switch>
                  <Route path={levels.start.url}>
                    <StartMenu />
                  </Route>
                  <Route path={levels.creating_lobby.url}>
                    <CenteredText>Creating game...</CenteredText>
                  </Route>
                  <Route path={levels.lobby.url}>
                    <Lobby />
                  </Route>
                  <Route path={levels.won.url}>
                    <CenteredText>Somebody won!</CenteredText>
                  </Route>
                  <Route path={levels.level1.url}>
                    <LevelProvider>
                      <Level1 />
                    </LevelProvider>
                  </Route>
                  <Route path="/join/:roomCode">
                    {(params: JoinRoomParams) => <JoinRoom params={params} />}
                  </Route>
                  <Route>
                    <RouteFallback />
                  </Route>
                </Switch>
              </Suspense>
            </GameProvider>
          </Router>
        </KeyboardControls>
      </Canvas>
    </StyledApp>
  );
}

export default App;
