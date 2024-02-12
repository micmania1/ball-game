import { useKeyboardControls as useDreiKeyboardControls } from '@react-three/drei';

export enum KeyboardControls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  pause = 'pause',
}

const keyboardControls = [
  { name: 'forward', keys: ['ArrowUp'] },
  { name: 'left', keys: ['ArrowLeft'] },
  { name: 'right', keys: ['ArrowRight'] },
  { name: 'backward', keys: ['ArrowDown'] },
  { name: 'pause', keys: ['p'] },
];

export default keyboardControls;
