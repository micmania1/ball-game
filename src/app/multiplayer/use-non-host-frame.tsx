import { RenderCallback, useFrame } from '@react-three/fiber';
import { isHost } from 'playroomkit';

export default function useNonHostFrame(callback: RenderCallback) {
  useFrame((three, delta, xrFrame) => {
    if (!isHost()) {
      callback(three, delta, xrFrame);
    }
  });
}
