import React from 'react';
import Svg, {
  Defs, LinearGradient, RadialGradient, Stop,
  Rect, Ellipse, Path, Circle, G,
} from 'react-native-svg';

// A cozy illustrated hamster habitat backdrop: hanging plant, stone den,
// soft sky gradient, and a wood-shaving nest for Pippin to sit on.
// width/height map 1:1 to the SVG viewBox, so the scene always fills its
// box with no letterboxing — callers can size it to whatever area (a
// small home-card stage or a tall pet-screen hero) needs covering.
export default function PippinHabitat({ width = 340, height = 220, mood = 'okay' }) {
  const skyTop    = mood === 'happy' ? '#FFF6DA' : mood === 'okay' ? '#F3EFE0' : '#E9E6E2';
  const skyBottom = mood === 'happy' ? '#E3F0DE' : mood === 'okay' ? '#E6E8DC' : '#DCDDD9';
  const leafDark  = mood === 'sad' ? '#9AA28E' : '#6E9468';
  const leafLight = mood === 'sad' ? '#B5BAA8' : '#8FB780';

  const w = width, h = height;
  const x = p => w * p;
  const y = p => h * p;

  // Nest sits a bit above center-bottom; floor band fills everything below
  // it so taller boxes (with name/message overlaid) stay covered.
  const nestY = Math.min(h * 0.62, h - 40);

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={skyTop} />
          <Stop offset="1" stopColor={skyBottom} />
        </LinearGradient>
        <RadialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFEFC2" stopOpacity={mood === 'happy' ? 0.9 : 0.4} />
          <Stop offset="1" stopColor="#FFEFC2" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#C9BFB2" />
          <Stop offset="1" stopColor="#A99E8F" />
        </LinearGradient>
        <LinearGradient id="nest" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F3DBA8" />
          <Stop offset="1" stopColor="#E0BD80" />
        </LinearGradient>
        <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#EFE6D2" />
          <Stop offset="1" stopColor="#E3D4AE" />
        </LinearGradient>
      </Defs>

      {/* Sky backdrop */}
      <Rect x={0} y={0} width={w} height={h} fill="url(#sky)" />
      <Circle cx={x(0.79)} cy={y(0.23)} r={Math.min(w, h) * 0.32} fill="url(#sun)" />

      {/* Floor band — fills from just above the nest to the bottom so any
          extra height (name / message area) stays covered, not the sky */}
      <Rect x={0} y={nestY - 8} width={w} height={h - nestY + 8} fill="url(#floor)" />

      {/* Stone den, back right */}
      <Path d={`M${x(0.74)},${nestY + 6} Q${x(0.74)},${nestY - 60} ${x(0.90)},${nestY - 55} Q${x(0.985)},${nestY - 52} ${x(0.985)},${nestY + 6} Z`} fill="url(#stone)" />
      <Ellipse cx={x(0.87)} cy={nestY + 2} rx={26} ry={28} fill="#5C5246" opacity={0.85} />
      <Ellipse cx={x(0.87)} cy={nestY + 4} rx={20} ry={22} fill="#3F392F" />

      {/* Hanging plant, top left */}
      <Path d={`M${x(0.16)},0 L${x(0.16)},${y(0.09)}`} stroke="#9C8A6E" strokeWidth={2} />
      <Ellipse cx={x(0.16)} cy={y(0.1)} rx={22} ry={9} fill="#8A6F4E" />
      <G>
        <Ellipse cx={x(0.11)} cy={y(0.01)} rx={16} ry={9} fill={leafDark} transform={`rotate(-25 ${x(0.11)} ${y(0.01)})`} />
        <Ellipse cx={x(0.18)} cy={-2} rx={18} ry={10} fill={leafLight} transform={`rotate(15 ${x(0.18)} -2)`} />
        <Ellipse cx={x(0.23)} cy={y(0.02)} rx={14} ry={8} fill={leafDark} transform={`rotate(35 ${x(0.23)} ${y(0.02)})`} />
      </G>

      {/* Climbing vine, top right corner */}
      <Path d={`M${x(0.96)},0 Q${x(0.91)},${y(0.14)} ${x(0.94)},${y(0.25)} Q${x(0.965)},${y(0.34)} ${x(0.92)},${y(0.43)}`} stroke={leafDark} strokeWidth={3} fill="none" opacity={0.6} />
      <Ellipse cx={x(0.93)} cy={y(0.09)} rx={8} ry={5} fill={leafLight} transform={`rotate(40 ${x(0.93)} ${y(0.09)})`} />
      <Ellipse cx={x(0.95)} cy={y(0.23)} rx={7} ry={5} fill={leafDark} transform={`rotate(-20 ${x(0.95)} ${y(0.23)})`} />
      <Ellipse cx={x(0.91)} cy={y(0.35)} rx={7} ry={5} fill={leafLight} transform={`rotate(20 ${x(0.91)} ${y(0.35)})`} />

      {/* Little rocks, bottom left */}
      <Ellipse cx={x(0.10)} cy={nestY + 30} rx={20} ry={13} fill="url(#stone)" />
      <Ellipse cx={x(0.17)} cy={nestY + 36} rx={14} ry={9} fill="#B9AE9D" />

      {/* Wood-shaving nest where Pippin sits */}
      <Ellipse cx={x(0.5)} cy={nestY} rx={Math.min(w * 0.27, 110)} ry={22} fill="url(#nest)" />
      <Path d={`M${x(0.28)},${nestY} Q${x(0.35)},${nestY - 10} ${x(0.43)},${nestY}`} stroke="#C99A55" strokeWidth={2} opacity={0.5} fill="none" />
      <Path d={`M${x(0.44)},${nestY + 4} Q${x(0.51)},${nestY - 6} ${x(0.59)},${nestY + 4}`} stroke="#C99A55" strokeWidth={2} opacity={0.5} fill="none" />
      <Path d={`M${x(0.57)},${nestY - 2} Q${x(0.65)},${nestY - 11} ${x(0.72)},${nestY}`} stroke="#C99A55" strokeWidth={2} opacity={0.5} fill="none" />

      {/* Tiny flowers, bottom right */}
      <Circle cx={x(0.82)} cy={nestY + 34} r={3} fill="#F6C6D9" />
      <Circle cx={x(0.85)} cy={nestY + 38} r={3} fill="#F6C6D9" />
      <Circle cx={x(0.84)} cy={nestY + 32} r={3.5} fill="#FBD8E4" />
    </Svg>
  );
}
