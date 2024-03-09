import { RenderCallback, useFrame } from '@react-three/fiber';
import useMyPlayer from './use-my-player';

export default function useCurrentPlayerFrame(
  playerId: string,
  callback: RenderCallback
) {
  const currentPlayer = useMyPlayer();

  useFrame((three, delta, xrFrame) => {
    if (playerId === currentPlayer.id) {
      callback(three, delta, xrFrame);
    }
  });
}
