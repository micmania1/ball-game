import { Vector3 } from 'three';
import { useMemo } from 'react';

export default function useVector3(defaultValue = [0, 0, 0]) {
  return useMemo(() => new Vector3(...defaultValue), []);
}
