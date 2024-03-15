import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { colors } from '../../config/profile';
import * as THREE from 'three';

type LocalPlayerProfileState = {
  localName: string;
  setLocalName: (name: string) => void;
  localColor: number;
  setLocalColor: (hexString: number) => void;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const LocalPlayerProfileContext = createContext<LocalPlayerProfileState>(null!);

interface LocalPlayerProfileProps {
  children: ReactNode;
}

export default function LocalProfile({ children }: LocalPlayerProfileProps) {
  const randomNameNumber = useMemo(() => THREE.MathUtils.randInt(0, 1000), []);
  const [localName, updateLocalName] = useState(
    localStorage.getItem('bg.profileName') ?? `Ball ${randomNameNumber}`
  );

  const randomColorIndex = useMemo(
    () => THREE.MathUtils.randInt(0, colors.length - 1),
    []
  );
  const savedColor = localStorage.getItem('bg.profileColor');
  const [localColor, updateLocalColor] = useState(
    savedColor && parseInt(savedColor) > 0
      ? parseInt(savedColor)
      : colors[randomColorIndex].getHex()
  );

  const setLocalName = useCallback((name: string) => {
    updateLocalName(name);
  }, []);

  const setLocalColor = useCallback((color: number) => {
    updateLocalColor(color);
  }, []);

  useEffect(() => {
    localStorage.setItem('bg.profileName', localName);
    localStorage.setItem('bg.profileColor', localColor.toString());
  }, [localColor, localName]);

  return (
    <LocalPlayerProfileContext.Provider
      value={{
        localName,
        localColor,
        setLocalName,
        setLocalColor,
      }}
    >
      {children}
    </LocalPlayerProfileContext.Provider>
  );
}

export function useLocalProfile() {
  return useContext(LocalPlayerProfileContext);
}

export function useLocalProfileName(): [
  LocalPlayerProfileState['localName'],
  LocalPlayerProfileState['setLocalName']
] {
  const { localName, setLocalName } = useLocalProfile();
  return [localName, setLocalName];
}

export function useLocalProfileColor(): [
  LocalPlayerProfileState['localColor'],
  LocalPlayerProfileState['setLocalColor']
] {
  const { localColor, setLocalColor } = useLocalProfile();
  return [localColor, setLocalColor];
}
