// components/Moon.tsx
import React from 'react';
import Svg, { Circle, Mask, Rect } from 'react-native-svg';

type MoonProps = {
  size?: number;
  color?: string;
};

export default function Moon({
  size = 100,
  color = '#FFFFFF',
}: MoonProps) {
  const r = size / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Mask id="moonMask">
        <Rect width={size} height={size} fill="white" />
        <Circle cx={r + r * 0.4} cy={r} r={r * 0.9} fill="black" />
      </Mask>
      <Circle cx={r} cy={r} r={r} fill={color} mask="url(#moonMask)" />
    </Svg>
  );
}
