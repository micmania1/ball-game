import { isHost } from 'playroomkit';
import { RenderCallback, useFrame } from '@react-three/fiber';

export default function useHostFrame(callback: RenderCallback) {
  useFrame((three, delta, xrFrame) => {
    if (isHost()) {
      callback(three, delta, xrFrame);
    }
  });
}
