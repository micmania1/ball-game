import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useLocation } from 'wouter';
import { LevelName, Levels } from '../../config/levels';
import { useThree } from '@react-three/fiber';
import useVector3 from '../../utils/use-vector3';

type GameProviderProps = {
  children: ReactNode;
  levelConfig: Levels;
};

type GameState = {
  // level: LevelName;
  setLevel(level: LevelName): void;
  won(): void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GameContext = createContext<GameState>(null!);

export default function GameProvider({
  children,
  levelConfig,
}: GameProviderProps) {
  const [, setLocation] = useLocation();
  const camera = useThree((three) => three.camera);
  const focus = useVector3();

  const setLevel = useCallback(
    (newLevel: LevelName) => {
      setLocation(levelConfig[newLevel].url);
    },
    [levelConfig, setLocation]
  );

  const won = useCallback(() => {
    console.log('Won Game!!');
    camera.position.set(0, 10, 15);
    camera.lookAt(focus);
    setLevel('start');
  }, [setLevel]);

  return (
    <GameContext.Provider value={{ setLevel, won }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
