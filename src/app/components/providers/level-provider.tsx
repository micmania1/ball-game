import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useKeyboardControls } from '@react-three/drei';
import PauseMenu from '../ui/pause-menu';
import { KeyboardControls } from '../../config/keyboard-controls';
import { Physics } from '@react-three/rapier';
import { useGameContext } from './game-provider';
import { Redirect } from 'wouter';
import levels from '../../config/levels';
import { getRoomCode } from 'playroomkit';
import JoystickProvider from './joystick-provider';

type LevelState = {
  isPaused: boolean;
  setPaused: (isPaused: boolean) => void;
  lose: () => void;
  won: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const LevelContext = createContext<LevelState>(null!);

interface LevelProviderProps {
  children: ReactNode;
}

export default function LevelProvider({ children }: LevelProviderProps) {
  const [isPaused, setPaused] = useState(false);
  const game = useGameContext();
  const roomCode = getRoomCode();

  const lose = useCallback(() => {
    console.log('Lose');
  }, []);

  const won = useCallback(() => {
    console.log('Won');
    game.won();
  }, [game]);

  return roomCode ? (
    <LevelContext.Provider
      value={{
        isPaused,
        setPaused,
        lose,
        won,
      }}
    >
      <Physics paused={isPaused}>
        <PauseMenu />
        <JoystickProvider mode="dynamic" zoneSelector="#joystick-level-zone">
          {children}
        </JoystickProvider>
      </Physics>
    </LevelContext.Provider>
  ) : (
    <Redirect to={levels.start.url} />
  );
}

export function useLevelContext() {
  return useContext(LevelContext);
}
