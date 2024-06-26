import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'wouter';
import { LevelName, Levels } from '../../config/levels';
import { useThree } from '@react-three/fiber';
import useVector3 from '../../utils/use-vector3';
import { getRoomCode, insertCoin, useMultiplayerState } from 'playroomkit';
import { useLocalProfileColor, useLocalProfileName } from './local-profile';

type GameProviderProps = {
  children: ReactNode;
  levelConfig: Levels;
};

type GameInit = {
  roomCode?: string;
  isPrivate?: boolean;
};
type GameState = {
  startMultiplayer(settings?: GameInit): void;
  startPrivate(): void;
  join(roomCode: string): void;
  setLevel(level: LevelName): void;
  won(): void;
  isPrivate: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GameContext = createContext<GameState>(null!);

export default function GameProvider({
  children,
  levelConfig,
}: GameProviderProps) {
  const [, setLocation] = useLocation();
  const camera = useThree((three) => three.camera);
  const defaultCameraFocus = useVector3();
  const [isPrivate, setIsPrivate] = useState(true);
  const [localName] = useLocalProfileName();
  const [localColor] = useLocalProfileColor();

  const [multiplayerLevel, setMultiplayerLevel]: [
    LevelName,
    (levelName: LevelName) => void
  ] = useMultiplayerState('level', 'start');
  const setLevel = useCallback(
    (newLevel: LevelName) => {
      setMultiplayerLevel(newLevel);
    },
    [setMultiplayerLevel]
  );

  useEffect(() => {
    setLocation(levelConfig[multiplayerLevel].url);
  }, [multiplayerLevel, levelConfig, setLocation]);

  const won = useCallback(() => {
    console.log('Won Game!!');
    camera.position.set(0, 10, 15);
    camera.lookAt(defaultCameraFocus);
    setLevel(isPrivate ? 'start' : 'lobby');
  }, [camera, defaultCameraFocus, isPrivate, setLevel]);

  const defaultPlayerState = useMemo(() => {
    return {
      color: localColor,
      name: localName,
      forward: 0,
      sideways: 0,
      position: [0, 3, -1],
      rotation: [0, 0, 0],
      jump: 0,
    };
  }, [localColor, localName]);

  const join = useCallback(
    async (roomCode: string) => {
      setIsPrivate(false);
      await insertCoin(
        {
          skipLobby: true,
          roomCode: roomCode.toUpperCase(),
        },
        () => {
          setLevel('lobby');
        }
      );
      setLocation('lobby');
    },
    [setLevel, setLocation]
  );

  const startMultiplayer = useCallback(
    async (settings: GameInit = {}) => {
      setIsPrivate(settings.isPrivate ?? false);
      if (getRoomCode()) {
        setLevel(settings.isPrivate ? 'level1' : 'lobby');
        return;
      }

      await insertCoin(
        {
          skipLobby: true,
          maxPlayersPerRoom: isPrivate ? 1 : 4,
          defaultPlayerStates: defaultPlayerState,
        },
        () => {
          if (settings.isPrivate) {
            setLevel('level1');
          } else {
            setLevel('lobby');
          }
        }
      );
      setLocation('creating-lobby');
    },
    [defaultPlayerState, isPrivate, setLevel, setLocation]
  );

  const startPrivate = useCallback(async () => {
    const roomCode = getRoomCode();
    if (roomCode) {
      setIsPrivate(true);
      setLevel('level1');
    } else {
      await startMultiplayer({ isPrivate: true });
    }
  }, [setLevel, startMultiplayer]);

  return (
    <GameContext.Provider
      value={{
        startMultiplayer,
        startPrivate,
        join,
        setLevel,
        won,
        isPrivate,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}

export function useIsPrivateGame() {
  const game = useGameContext();
  return game.isPrivate;
}
