import { useMemo } from 'react';

export default function useMap<K, T>(defaultValue?: readonly [K, T][] | null) {
  return useMemo(() => new Map<K, T>(defaultValue), [defaultValue]);
}
