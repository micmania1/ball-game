import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useKeyboardControls } from '@react-three/drei';
import PauseMenu from '../components/pause-menu';
import { KeyboardControls } from '../config/keyboard-controls';
import { Physics } from '@react-three/rapier';
import { useGameContext } from './game-provider';

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
  const wasPausePressed = useKeyboardControls<KeyboardControls>(
    (keys) => keys.pause
  );
  const game = useGameContext();

  useEffect(() => {
    if (wasPausePressed) {
      setPaused((pause) => !pause);
    }
  }, [wasPausePressed, setPaused]);

  const lose = useCallback(() => {
    console.log('Lose');
  }, []);

  const won = useCallback(() => {
    console.log('Won');
    game.won();
  }, [game]);

  return (
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
        {children}
      </Physics>
    </LevelContext.Provider>
  );
}

export function useLevelContext() {
  return useContext(LevelContext);
}
