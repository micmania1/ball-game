import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import nipplejs from 'nipplejs';

type JoystickProviderState = {
  isJoystickPressed(): boolean;
  angle(): number;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const JoystickContext = createContext<JoystickProviderState>(null!);

type JoystickProviderProps = {
  mode: nipplejs.JoystickManagerOptions['mode'];
  children: ReactNode;
  zoneSelector?: string;
};

export default function JoystickProvider({
  mode,
  zoneSelector,
  children,
}: JoystickProviderProps) {
  const isPressedRef = useRef(false);
  const angleRef = useRef(0);

  useEffect(() => {
    const zone = zoneSelector
      ? document.querySelector<HTMLElement>(zoneSelector)
      : undefined;

    if (zone) {
      zone.style.display = 'block';
    }

    const manager = nipplejs.create({
      mode: 'dynamic',
      threshold: 0.2,
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
  }, [zoneSelector]);

  const isJoystickPressed = useCallback(() => isPressedRef.current, []);
  const angle = useCallback(() => angleRef.current, []);

  return (
    <JoystickContext.Provider value={{ isJoystickPressed, angle }}>
      {children}
    </JoystickContext.Provider>
  );
}

export function useJoystick() {
  return useContext(JoystickContext);
}
