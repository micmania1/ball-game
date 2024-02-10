import { createContext, ReactNode, useContext, useState } from 'react';

type GameProviderProps = {
  children: ReactNode;
};

type GameState = {
  isPaused: boolean;
  setPaused: (isPaused: boolean) => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GameContext = createContext<GameState>(null!);

export default function GameProvider({ children }: GameProviderProps) {
  const [isPaused, setPaused] = useState(true);
  return (
    <GameContext.Provider value={{ isPaused, setPaused }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
