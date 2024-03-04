import { Html } from '@react-three/drei';
import { useGameContext } from '../providers/game-provider';
import styled from 'styled-components';

const Navigation = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50vw;
`;

export default function _hud() {
  const { setLevel } = useGameContext();
  return (
    <Html fullscreen zIndexRange={[100]}>
      <Navigation>
        <button onClick={() => setLevel('start')}>Start</button>
        <button onClick={() => setLevel('level1')}>Level 1</button>
      </Navigation>
    </Html>
  );
}
