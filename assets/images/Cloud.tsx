import React from 'react';
import Svg, { Path } from 'react-native-svg';

type CloudProps = {
  width?: number;
  height?: number;
  color?: string;
};

export default function Cloud({
  width = 100,
  height = 60,
  color = '#FFFFFF',
}: CloudProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 40" fill="none">
      <Path
        d="M20 32c-6 0-10-4.5-10-10s4-9 9-9c1-6 6-10 12-10s11 4 12 10c6 0 11 4 11 10s-5 10-11 10H20z"
        fill={color}
      />
    </Svg>
  );
}
