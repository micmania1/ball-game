import { Card } from './card';
import { ColorRepresentation } from 'three';

type BallIconProps = {
  color: ColorRepresentation;
  size?: number;
  highlighted?: boolean;
  highlightColor?: ColorRepresentation;
  highlightBorderWidth?: number;
};
export default function BallIcon({
  color,
  size: baseSize = 24,
  highlighted = false,
  highlightBorderWidth = 4,
}: BallIconProps) {
  const size = highlighted ? baseSize + highlightBorderWidth : baseSize;
  const borderWidth = highlighted ? highlightBorderWidth : 1;
  return (
    <Card
      width={size}
      height={size}
      borderColor={highlighted ? 'purple' : 'black'}
      border={borderWidth}
      backgroundColor={color}
      borderRadius={999}
      borderOpacity={0.5}
      dark={{ borderColor: highlighted ? 'white' : 'black' }}
    ></Card>
  );
}
