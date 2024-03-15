import { Fullscreen, Text } from '@react-three/uikit';

type CenteredTextProps = {
  children: string;
};
export default function CenteredText({ children }: CenteredTextProps) {
  return (
    <Fullscreen alignItems="center" justifyContent="center">
      <Text>{children}</Text>
    </Fullscreen>
  );
}
