import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

type SunProps = {
  size?: number;
  color?: string;
};

export default function Sun({
  size = 100,
  color = '#FFFFFF',
}: SunProps) {
  const center = size / 2;
  const sunRadius = size * 0.25; // Sun body is 25% of total size
  const rayStartRadius = size * 0.35; // Rays start at 35% from center
  const rayEndRadius = size * 0.45; // Rays end at 45% from center
  
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const radian = (angle * Math.PI) / 180;
        const x1 = center + rayStartRadius * Math.cos(radian);
        const y1 = center + rayStartRadius * Math.sin(radian);
        const x2 = center + rayEndRadius * Math.cos(radian);
        const y2 = center + rayEndRadius * Math.sin(radian);
        
        return (
          <Line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={size * 0.02}
            strokeLinecap="round"
          />
        );
      })}
      
      {/* Sun body */}
      <Circle cx={center} cy={center} r={sunRadius} fill={color} />
    </Svg>
  );
}
