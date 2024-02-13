import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useLocation } from 'wouter';
import { LevelName, Levels } from '../config/levels';

type GameProviderProps = {
  children: ReactNode;
  levelConfig: Levels;
};

type GameState = {
  // level: LevelName;
  setLevel: (level: LevelName) => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GameContext = createContext<GameState>(null!);

export default function GameProvider({
  children,
  levelConfig,
}: GameProviderProps) {
  // const [level, setLevelKey] = useState<LevelName>('start');
  const [, setLocation] = useLocation();

  const setLevel = useCallback(
    (newLevel: LevelName) => {
      // setLevelKey(newLevel);
      setLocation(levelConfig[newLevel].url);
    },
    [levelConfig, setLocation]
  );

  return (
    <GameContext.Provider value={{ setLevel }}>{children}</GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
