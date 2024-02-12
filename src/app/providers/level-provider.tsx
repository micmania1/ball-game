import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useKeyboardControls } from '@react-three/drei';
import PauseMenu from '../components/pause-menu';
import { KeyboardControls } from '../config/keyboardControls';

type LevelState = {
  isPaused: boolean;
  setPaused: (isPaused: boolean) => void;
  platformWidth: number;
  platformLength: number;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const LevelContext = createContext<LevelState>(null!);

interface LevelProviderProps {
  children: ReactNode;
  platformWidth: number;
  platformLength: number;
}

export default function LevelProvider({
  children,
  platformWidth,
  platformLength,
}: LevelProviderProps) {
  const [isPaused, setPaused] = useState(false);
  const wasPausePressed = useKeyboardControls<KeyboardControls>(
    (keys) => keys.pause
  );

  useEffect(() => {
    if (wasPausePressed) {
      setPaused((pause) => !pause);
    }
  }, [wasPausePressed, setPaused]);

  return (
    <LevelContext.Provider
      value={{ isPaused, setPaused, platformWidth, platformLength }}
    >
      <PauseMenu />
      {children}
    </LevelContext.Provider>
  );
}

export function useLevelContext() {
  return useContext(LevelContext);
}
