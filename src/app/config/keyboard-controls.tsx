export enum KeyboardControls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  jump = 'jump',
}

const keyboardControls = [
  { name: 'forward', keys: ['ArrowUp'] },
  { name: 'left', keys: ['ArrowLeft'] },
  { name: 'right', keys: ['ArrowRight'] },
  { name: 'backward', keys: ['ArrowDown'] },
  { name: 'jump', keys: ['Space'] },
];

export default keyboardControls;
