import { useMemo } from 'react';
import { Quaternion } from 'three';

export default function useQuaternion(defaultValue = [0, 0, 0, 0]) {
  return useMemo(() => new Quaternion(...defaultValue), [defaultValue]);
}
