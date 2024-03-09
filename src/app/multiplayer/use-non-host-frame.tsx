import { useIsHost } from 'playroomkit';
import { RenderCallback, useFrame } from '@react-three/fiber';

export default function useNonHostFrame(callback: RenderCallback) {
  const isHost = useIsHost();

  useFrame((three, delta, xrFrame) => {
    if (!isHost) {
      callback(three, delta, xrFrame);
    }
  });
}