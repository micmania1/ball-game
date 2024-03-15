import { RenderCallback, useFrame } from '@react-three/fiber';
import { myPlayer } from 'playroomkit';

export default function useCurrentPlayerFrame(
  playerId: string,
  callback: RenderCallback
) {
  useFrame((three, delta, xrFrame) => {
    const currentPlayer = myPlayer();
    if (playerId === currentPlayer.id) {
      callback(three, delta, xrFrame);
    }
  });
}
