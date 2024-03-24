import { Fullscreen, Text } from '@react-three/uikit';
import { colors } from './theme';

type CenteredTextProps = {
  children: string;
};
export default function CenteredText({ children }: CenteredTextProps) {
  return (
    <Fullscreen alignItems="center" justifyContent="center">
      <Text fontSize={48} color={colors.background}>
        {children}
      </Text>
    </Fullscreen>
  );
}
