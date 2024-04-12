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
import { Defaults } from './components/ui/theme';
import LocalProfile from './components/providers/local-profile';
import TouchProvider, {
  useTouchEnabled,
} from './components/providers/touch-provider';
import RequireRoomCode from './multiplayer/require-room-code';

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
  padding: 0;
  margin: 0;
`;

const JoystickLobbyZone = styled.div`
  position: absolute;
  left: 0;
  bottom: 100px;
  width: 50%;
  height: 120px;
  z-index: 1000;
  margin: 0;
  padding: 0;
  display: none;
`;

const JoystickLevelZone = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50%;
  height: 160px;
  z-index: 1000;
  margin: 0;
  padding: 0;
  display: none;
`;

function JoystickAreas() {
  const isTouchEnabled = useTouchEnabled();
  return isTouchEnabled ? (
    <>
      <JoystickLobbyZone id="joystick-lobby-zone" />
      <JoystickLevelZone id="joystick-level-zone" />
    </>
  ) : null;
}

export function App() {
  return (
    <TouchProvider>
      <JoystickAreas />
      <StyledApp>
        <LocalProfile>
          <Canvas camera={{ position: defaultCameraOffset }}>
            <Sky />

            <Defaults>
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
                          <RequireRoomCode fallbackUrl={levels.start.url}>
                            <Lobby />
                          </RequireRoomCode>
                        </Route>
                        <Route path={levels.won.url}>
                          <CenteredText>Somebody won!</CenteredText>
                        </Route>
                        <Route path={levels.level1.url}>
                          <RequireRoomCode fallbackUrl={levels.start.url}>
                            <LevelProvider>
                              <Level1 />
                            </LevelProvider>
                          </RequireRoomCode>
                        </Route>
                        <Route path="/join/:roomCode">
                          {(params: JoinRoomParams) => (
                            <JoinRoom params={params} />
                          )}
                        </Route>
                        <Route>
                          <RouteFallback />
                        </Route>
                      </Switch>
                    </Suspense>
                  </GameProvider>
                </Router>
              </KeyboardControls>
            </Defaults>
          </Canvas>
        </LocalProfile>
      </StyledApp>
    </TouchProvider>
  );
}

export default App;
