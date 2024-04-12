import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Physics } from '@react-three/rapier';
import { useGameContext } from './game-provider';
import JoystickProvider from './joystick-provider';
import JumpButton from '../ui/jump-button';
import { Container, Fullscreen, Root, Text } from '@react-three/uikit';
import { PerspectiveCamera } from '@react-three/drei';
import { LevelControls } from '../ui/level-controls';
import { Defaults } from '../ui/theme';
import { useThree } from '@react-three/fiber';
import { defaultCameraOffset } from '../../config/camera';

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

  const lose = useCallback(() => {
    console.log('Lose');
  }, []);

  const won = useCallback(() => {
    console.log('Won');
    game.won();
  }, [game]);

  const camera = useThree((three) => three.camera);
  useEffect(() => {
    camera.position.set(...defaultCameraOffset);
    camera.rotation.set(0, 0, 0);
  }, [camera.position, camera.rotation]);

  return (
    <LevelContext.Provider
      value={{
        isPaused,
        setPaused,
        lose,
        won,
      }}
    >
      <ambientLight args={[0x800080, 1]} />
      <directionalLight args={[0xffffff, 5]} position={[5, 30, 100]} />
      <directionalLight args={[0xffffff, 0.5]} position={[5, 30, -100]} />

      <PerspectiveCamera
        args={[75]}
        makeDefault={true}
        rotation={[Math.PI * 1.9, 0, 0]}
      />
      <Physics paused={isPaused}>
        <JoystickProvider zoneSelector="#joystick-level-zone">
          {children}
          <LevelControls />
        </JoystickProvider>
      </Physics>
    </LevelContext.Provider>
  );
}

export function useLevelContext() {
  return useContext(LevelContext);
}
