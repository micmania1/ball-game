import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useLocation } from 'wouter';

type GameProviderProps = {
  children: ReactNode;
};

type GameState = {
  level: number;
  setLevel: (level: number) => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GameContext = createContext<GameState>(null!);

export default function GameProvider({ children }: GameProviderProps) {
  const [level, setLevelNumber] = useState(0);
  const [, setLocation] = useLocation();

  const setLevel = useCallback(
    (newLevel: number) => {
      setLevelNumber(newLevel);
      if (newLevel > 0) {
        setLocation(`/level-${newLevel}`);
      } else {
        setLocation('/');
      }
    },
    [setLevelNumber, setLocation]
  );

  return (
    <GameContext.Provider value={{ level, setLevel }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
