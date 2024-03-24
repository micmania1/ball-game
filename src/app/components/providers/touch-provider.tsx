import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const TouchContext = createContext({ enabled: false });

type TouchProviderProps = {
  children: ReactNode;
};
export default function TouchProvider({ children }: TouchProviderProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const callback = () => setEnabled(true);
    document.documentElement.addEventListener('touchstart', callback);

    return () =>
      document.documentElement.removeEventListener('touchstart', callback);
  }, []);
  return (
    <TouchContext.Provider value={{ enabled }}>
      {children}
    </TouchContext.Provider>
  );
}

export function useTouchEnabled() {
  return useContext(TouchContext).enabled;
}
