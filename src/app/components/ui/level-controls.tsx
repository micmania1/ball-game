import { Fullscreen } from '@react-three/uikit';
import JumpButton from './jump-button';

export function LevelControls() {
  return (
    <Fullscreen
      flexDirection="column"
      justifyContent="flex-end"
      alignItems="flex-end"
      padding={16}
    >
      <JumpButton />
    </Fullscreen>
  );
}
