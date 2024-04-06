import { useMemo } from 'react';
import * as THREE from 'three';

export default function useBox3() {
  return useMemo(() => new THREE.Box3(), []);
}
