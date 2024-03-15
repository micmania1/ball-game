import { Container, DefaultProperties, Text } from '@react-three/uikit';
import { Button } from './button';
import {
  FocusEvent,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from 'react';
import { Html } from '@react-three/drei';
import { ColorRepresentation } from 'three';
import IntrinsicElements = React.JSX.IntrinsicElements;
import styled from 'styled-components';

const NotVisible = styled.div`
  width: 0;
  height: 0;
  overflow: hidden;
`;

type InputProps = IntrinsicElements['input'] & {
  width?: number;
  border?: number;
  backgroundColor?: ColorRepresentation;
  borderColor?: ColorRepresentation;
};
export default function Input({
  onChange,
  onFocus,
  onBlur,
  width,
  border = 1,
  backgroundColor,
  borderColor,
  defaultValue,
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(String(defaultValue ?? ''));
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Button
        width={width}
        onClick={(e) => {
          inputRef.current?.focus();
        }}
        onPointerEnter={(e) => setHovered(true)}
        onPointerLeave={(e) => setHovered(false)}
        padding={16}
        alignItems="center"
        justifyContent="center"
      >
        <Text>{value}</Text>
      </Button>
      <Html>
        <NotVisible>
          <input
            onFocus={(e) => {
              setFocused(true);
              if (onFocus) {
                onFocus(e);
              }
            }}
            onBlur={(e) => {
              setFocused(false);
              if (onBlur) {
                onBlur(e);
              }
            }}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              if (onChange) {
                onChange(e);
              }
            }}
            defaultValue={defaultValue}
            {...props}
            ref={inputRef}
          />
        </NotVisible>
      </Html>
    </>
  );
}
