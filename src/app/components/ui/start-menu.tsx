import styled from 'styled-components';
import { Html } from '@react-three/drei';
import { useGameContext } from '../providers/game-provider';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { defaultCameraOffset } from '../../config/camera';
import useVector3 from '../../utils/use-vector3';
import Button from './button';
import { getRoomCode } from 'playroomkit';

const Overlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  background: rgba(0, 0, 0, 0.5);
`;

export default function StartMenu() {
  const camera = useThree((three) => three.camera);
  const focusPosition = useVector3();
  const game = useGameContext();

  useEffect(() => {
    camera.position.set(...defaultCameraOffset);
    camera.lookAt(focusPosition);
  }, [camera, camera.position, focusPosition]);

  return (
    <Html fullscreen prepend zIndexRange={[10]}>
      <Overlay>
        <Button
          onClick={() => {
            game.startMultiplayer();
          }}
        >
          Multiplayer
        </Button>
        <Button
          onClick={() => {
            game.startPrivate();
          }}
        >
          Private
        </Button>
      </Overlay>
    </Html>
  );
}
