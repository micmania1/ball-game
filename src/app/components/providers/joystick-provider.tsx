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
import nipplejs from 'nipplejs';
import useMap from '../../utils/use-map';
import { useTouchEnabled } from './touch-provider';

type JoystickProviderState = {
  isJoystickPressed(): boolean;
  angle(): number;
  pressButton(buttonName: string): void;
  releaseButton(buttonName: string): void;
  button(name: string): boolean;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const JoystickContext = createContext<JoystickProviderState>(null!);

type JoystickProviderProps = {
  children: ReactNode;
  zoneSelector?: string;
};

export default function JoystickProvider({
  zoneSelector,
  children,
}: JoystickProviderProps) {
  const isPressedRef = useRef(false);
  const angleRef = useRef(0);
  const buttons = useMap<string, boolean>();
  const isTouchEnabled = useTouchEnabled();

  useEffect(() => {
    if (isTouchEnabled) {
      const zone = zoneSelector
        ? document.querySelector<HTMLElement>(zoneSelector)
        : undefined;

      if (zone) {
        zone.style.display = 'block';
      }

      const manager = nipplejs.create({
        mode: 'static',
        position: {
          left: '66px',
          bottom: '66px',
        },
        zone: zone ?? undefined,
      });

      if (manager) {
        manager.on('start', (e) => {
          isPressedRef.current = true;
        });
        manager.on('end', (e) => {
          isPressedRef.current = false;
          angleRef.current = 0;
        });
        manager.on('move', (e, data) => {
          angleRef.current = data.angle.radian;
        });
        manager.on('removed', () => {
          angleRef.current = 0;
          isPressedRef.current = false;
        });
      }

      return () => {
        if (manager) {
          manager.destroy();
          isPressedRef.current = false;
          angleRef.current = 0;
        }

        if (zone) {
          zone.style.display = 'none';
        }
      };
    }
  }, [isTouchEnabled, zoneSelector]);

  const isJoystickPressed = useCallback(() => isPressedRef.current, []);
  const angle = useCallback(() => angleRef.current, []);
  const pressButton = useCallback(
    (name: string) => buttons.set(name, true),
    [buttons]
  );
  const releaseButton = useCallback(
    (name: string) => buttons.set(name, false),
    [buttons]
  );
  const button = useCallback(
    (name: string) => buttons.get(name) ?? false,
    [buttons]
  );

  return (
    <JoystickContext.Provider
      value={{ isJoystickPressed, angle, pressButton, releaseButton, button }}
    >
      {children}
    </JoystickContext.Provider>
  );
}

export function useJoystick() {
  return useContext(JoystickContext);
}
