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
export default function PippinHabitat({ width = 340, height = 220, mood = 'okay', level = 1 }) {
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

      {/* ─── Level 2 — Settled Buddy: food bowl + potted sprout ─── */}
      {level >= 2 && (
        <G>
          {/* Food bowl, front-left of nest */}
          <Ellipse cx={x(0.28)} cy={nestY + 16} rx={16} ry={7} fill="#B98A5E" />
          <Ellipse cx={x(0.28)} cy={nestY + 14} rx={13} ry={5} fill="#D9A96E" />
          <Circle cx={x(0.265)} cy={nestY + 13} r={2.5} fill="#E8B96E" />
          <Circle cx={x(0.29)}  cy={nestY + 14} r={2.5} fill="#C98A4A" />
          <Circle cx={x(0.30)}  cy={nestY + 12} r={2}   fill="#E8B96E" />
          {/* Potted sprout, back-left */}
          <Path d={`M${x(0.09)},${nestY - 14} L${x(0.055)},${nestY} L${x(0.125)},${nestY} Z`} fill="#C98A5E" />
          <Path d={`M${x(0.09)},${nestY - 14} Q${x(0.06)},${nestY - 30} ${x(0.075)},${nestY - 36}`} stroke={leafDark} strokeWidth={2.5} fill="none" />
          <Ellipse cx={x(0.075)} cy={nestY - 37} rx={7} ry={4} fill={leafLight} transform={`rotate(-30 ${x(0.075)} ${nestY - 37})`} />
          <Ellipse cx={x(0.108)} cy={nestY - 30} rx={7} ry={4} fill={leafDark}  transform={`rotate(30 ${x(0.108)} ${nestY - 30})`} />
        </G>
      )}

      {/* ─── Level 3 — Confident Buddy: hamster wheel + fuller vine ─── */}
      {level >= 3 && (
        <G>
          {/* Hamster wheel, lower-left */}
          <Path d={`M${x(0.15)},${nestY + 20} L${x(0.10)},${nestY + 40} M${x(0.15)},${nestY + 20} L${x(0.20)},${nestY + 40}`} stroke="#9A8A7A" strokeWidth={3} strokeLinecap="round" />
          <Circle cx={x(0.15)} cy={nestY - 4} r={30} stroke="#C7B49A" strokeWidth={5} fill="none" />
          <Circle cx={x(0.15)} cy={nestY - 4} r={30} stroke="#E0D2BC" strokeWidth={1.5} fill="none" />
          <Path d={`M${x(0.15)},${nestY - 34} L${x(0.15)},${nestY + 26} M${x(0.10)},${nestY - 4} L${x(0.20)},${nestY - 4}`} stroke="#D3C3A8" strokeWidth={2} opacity={0.6} />
          {/* Extra vine leaves, right edge */}
          <Ellipse cx={x(0.90)} cy={y(0.17)} rx={7} ry={5} fill={leafLight} transform={`rotate(-30 ${x(0.90)} ${y(0.17)})`} />
          <Ellipse cx={x(0.965)} cy={y(0.29)} rx={7} ry={5} fill={leafDark} transform={`rotate(30 ${x(0.965)} ${y(0.29)})`} />
        </G>
      )}

      {/* ─── Level 4 — Companion Guide: hanging lantern + cozy blanket ─── */}
      {level >= 4 && (
        <G>
          {/* Warm lantern hanging top-right */}
          <Path d={`M${x(0.62)},0 L${x(0.62)},${y(0.11)}`} stroke="#9C8A6E" strokeWidth={1.5} />
          <Circle cx={x(0.62)} cy={y(0.20)} r={Math.min(w, h) * 0.11} fill="#FFE7A8" opacity={0.35} />
          <Rect x={x(0.62) - 8} y={y(0.11)} width={16} height={20} rx={5} fill="#F2C55C" />
          <Rect x={x(0.62) - 8} y={y(0.11)} width={16} height={20} rx={5} fill="#FFF0C0" opacity={0.5} />
          <Rect x={x(0.62) - 5} y={y(0.11) - 3} width={10} height={4} rx={2} fill="#B8935A" />
          {/* Cozy blanket draped over the nest */}
          <Path d={`M${x(0.33)},${nestY - 2} Q${x(0.5)},${nestY - 14} ${x(0.67)},${nestY - 2} Q${x(0.66)},${nestY + 8} ${x(0.5)},${nestY + 6} Q${x(0.34)},${nestY + 8} ${x(0.33)},${nestY - 2} Z`} fill="#D48EA0" opacity={0.9} />
          <Path d={`M${x(0.37)},${nestY - 3} Q${x(0.5)},${nestY - 11} ${x(0.63)},${nestY - 3}`} stroke="#E8B0BE" strokeWidth={2} fill="none" opacity={0.8} />
        </G>
      )}

      {/* ─── Level 5 — Legacy Buddy: string lights + photo + blooms ─── */}
      {level >= 5 && (
        <G>
          {/* String lights swagged across the top */}
          <Path d={`M0,${y(0.04)} Q${x(0.25)},${y(0.13)} ${x(0.5)},${y(0.05)} Q${x(0.75)},${y(0.13)} ${w},${y(0.04)}`} stroke="#B8A88E" strokeWidth={1.5} fill="none" />
          {[0.08, 0.2, 0.33, 0.5, 0.67, 0.8, 0.92].map((px, i) => {
            const py = 0.05 + Math.sin(px * Math.PI) * 0.075;
            const colors = ['#FFD36E', '#FF9EB5', '#8FD3C8', '#FFD36E', '#FF9EB5', '#8FD3C8', '#FFD36E'];
            return <Circle key={i} cx={x(px)} cy={y(py) + 4} r={4} fill={colors[i]} opacity={0.95} />;
          })}
          {/* Framed photo on the back wall */}
          <Rect x={x(0.40)} y={y(0.14)} width={x(0.14)} height={y(0.16)} rx={2} fill="#C9A876" />
          <Rect x={x(0.415)} y={y(0.155)} width={x(0.11)} height={y(0.13)} rx={1} fill="#EAF2E8" />
          <Circle cx={x(0.47)} cy={y(0.20)} r={5} fill="#E8A87C" />
          <Path d={`M${x(0.425)},${y(0.275)} Q${x(0.47)},${y(0.23)} ${x(0.515)},${y(0.275)} Z`} fill="#C77F4A" opacity={0.7} />
          {/* Blossoms on the hanging plant */}
          <Circle cx={x(0.13)} cy={y(0.02)} r={3.5} fill="#FBD8E4" />
          <Circle cx={x(0.21)} cy={y(0.035)} r={3.5} fill="#FFD36E" />
          {/* Extra blooms by the flowers */}
          <Circle cx={x(0.80)} cy={nestY + 30} r={3.5} fill="#C9A0E8" />
          <Circle cx={x(0.87)} cy={nestY + 34} r={3} fill="#FFD36E" />
        </G>
      )}
    </Svg>
  );
}
