import { useLevelContext } from '../providers/level-provider';
import styled from 'styled-components';
import { Html } from '@react-three/drei';

const Overlay = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 40px;
`;

const ContinueButton = styled.button`
  padding: 20px;
  box-shadow: none;
  border: 5px solid purple;
  border-radius: 10px;
  font-size: 32px;
  font-weight: bold;
  background-color: white;

  &:hover {
    background-color: #dedede;
    cursor: pointer;
  }
`;

export default function PauseMenu() {
  const { isPaused, setPaused } = useLevelContext();
  return isPaused ? (
    <Html fullscreen prepend zIndexRange={[10]}>
      <Overlay>
        <ContinueButton onClick={() => setPaused(false)}>
          Continue
        </ContinueButton>
      </Overlay>
    </Html>
  ) : null;
}
