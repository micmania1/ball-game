import { Vector3 } from 'three';
import { useMemo } from 'react';

export default function useVector3() {
  return useMemo(() => new Vector3(), []);
}
