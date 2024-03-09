import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'wouter';
import { LevelName, Levels } from '../../config/levels';
import { useThree } from '@react-three/fiber';
import useVector3 from '../../utils/use-vector3';
import {
  getRoomCode,
  insertCoin,
  isHost,
  Joystick,
  onPlayerJoin,
  useMultiplayerState,
} from 'playroomkit';

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
  joysticks: Map<string, Joystick>;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GameContext = createContext<GameState>(null!);

export default function GameProvider({
  children,
  levelConfig,
}: GameProviderProps) {
  const [, setLocation] = useLocation();
  const camera = useThree((three) => three.camera);
  const joysticks = useMemo(() => new Map(), []);
  const defaultCameraFocus = useVector3();
  const availableColorsRef = useRef(['red', 'lightgreen', 'blue', 'yellow']);
  const [isPrivate, setIsPrivate] = useState(false);
  const isTouchEnabled = 'ontouchstart' in document.documentElement;

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

  useEffect(() => {
    onPlayerJoin((player) => {
      if (isHost()) {
        player.setState('color', availableColorsRef.current.shift());
      }
      player.setState('ready', true);

      console.log(player.getState('joystickEnabled'));
      if (player.getState('joystickEnabled')) {
        const joystick = new Joystick(player, { type: 'angular' });
        joysticks.set(player.id, joystick);
      }

      player.onQuit(() => {
        joysticks.delete(player.id);
        const color = player.getState('color');
        if (isHost() && color && !availableColorsRef.current.includes(color)) {
          availableColorsRef.current.push(color);
        }
      });
    });
  }, [joysticks]);

  const join = useCallback(
    async (roomCode: string) => {
      setIsPrivate(false);
      setLocation('lobby');
      await insertCoin(
        {
          skipLobby: true,
          roomCode,
          defaultPlayerStates: {
            color: availableColorsRef.current[0],
            forward: 0,
            sideways: 0,
            position: [0, 3, -1],
            rotation: [0, 0, 0],
            ready: false,
            joystickEnabled: isTouchEnabled,
          },
        },
        () => {
          setLevel('lobby');
        }
      );
    },
    [isTouchEnabled, setLevel, setLocation]
  );

  const startMultiplayer = useCallback(
    async (settings: GameInit = {}) => {
      setIsPrivate(settings.isPrivate ?? false);
      setLocation('creating-lobby');
      if (getRoomCode()) {
        setLevel(settings.isPrivate ? 'level1' : 'lobby');
        return;
      }
      await insertCoin(
        {
          skipLobby: true,
          maxPlayersPerRoom: isPrivate ? 1 : 4,
          defaultPlayerStates: {
            color: availableColorsRef.current[0],
            forward: 0,
            sideways: 0,
            position: [0, 3, -1],
            rotation: [0, 0, 0],
            ready: false,
            joystickEnabled: isTouchEnabled,
          },
        },
        () => {
          console.log('launch');
          if (settings.isPrivate) {
            setLevel('level1');
          } else {
            setLevel('lobby');
          }
        }
      );
    },
    [isPrivate, isTouchEnabled, setLevel, setLocation]
  );

  const startPrivate = useCallback(async () => {
    const roomCode = getRoomCode();
    if (roomCode) {
      setLevel('level1');
    } else {
      await startMultiplayer({ isPrivate: true });
    }
  }, [setLevel, startMultiplayer]);

  return (
    <GameContext.Provider
      value={{ startMultiplayer, startPrivate, join, setLevel, won, joysticks }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}

export function useJoystick(key: string) {
  const game = useGameContext();
  return game.joysticks.get(key);
}
