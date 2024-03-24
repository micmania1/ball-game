import { Text } from '@react-three/uikit';
import { Button } from './button';
import { useJoystick } from '../providers/joystick-provider';

export default function JumpButton() {
  const joystick = useJoystick();

  return (
    <Button
      variant="secondary"
      onPointerDown={() => joystick.pressButton('jump')}
      onPointerUp={() => joystick.releaseButton('jump')}
      borderRadius={50}
      width={100}
      height={100}
    >
      <Text fontSize={20} fontWeight="bold">
        Jump
      </Text>
    </Button>
  );
}
