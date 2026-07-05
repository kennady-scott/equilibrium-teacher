import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, G, Line } from 'react-native-svg';

// Pippin acts out a goal when the teacher checks it in.
// scene: 'meditate' | 'wheel' | 'salad' | 'book' | 'phone' | 'moon' | 'sun' | 'heart'
// Plays for ~3.4s then calls onDone.

// Map preset goal ids to scenes; anything unknown (custom goals) gets 'heart'.
export const GOAL_SCENES = {
  breathing: 'meditate', yoga: 'meditate', mindful: 'meditate',
  walk: 'wheel', exercise: 'wheel',
  lunch: 'salad',
  read: 'book', learn: 'book',
  call: 'phone',
  noemails: 'moon', screen: 'moon',
  outside: 'sun',
  leave: 'walkpark',
  kindness: 'heart',
};
export const sceneForGoal = (goalId) => GOAL_SCENES[goalId] ?? 'heart';

const FUR = '#E8A87C', BELLY = '#F5D5B0', SHADE = '#C77F4A', CHEEK = '#FF9EB5', EYE = '#2A1A0A';

export default function PippinAction({ scene = 'heart', size = 170, onDone }) {
  const appear  = useRef(new Animated.Value(0)).current;
  const breath  = useRef(new Animated.Value(0)).current; // 0..1 slow in-out
  const bob     = useRef(new Animated.Value(0)).current; // quick bounce px
  const spin    = useRef(new Animated.Value(0)).current; // wheel / sun rays
  const munch   = useRef(new Animated.Value(0)).current; // mouth open/close
  const twinkle = useRef(new Animated.Value(0)).current; // stars / hearts / bits
  const story   = useRef(new Animated.Value(0)).current; // multi-beat scenes (walkpark)

  useEffect(() => {
    Animated.sequence([
      Animated.timing(appear, { toValue: 1, duration: 240, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.delay(2900),
      Animated.timing(appear, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start(() => onDone && onDone());

    // Multi-beat timeline for narrative scenes (close laptop → walk in park)
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(story, { toValue: 1, duration: 2700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]).start();

    Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(breath, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -6, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0,  duration: 180, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(Animated.sequence([
      Animated.timing(munch, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(munch, { toValue: 0, duration: 260, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(twinkle, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(twinkle, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []);

  const cx = 100, cy = 105;
  const spinDeg  = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const slowSpin = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  // ── shared pieces ───────────────────────────────────────────
  const Head = ({ eyes = 'open', y = 0 }) => (
    <>
      <Ellipse cx={cx - 26} cy={cy - 58 + y} rx={13} ry={15} fill={SHADE} />
      <Ellipse cx={cx + 26} cy={cy - 58 + y} rx={13} ry={15} fill={SHADE} />
      <Ellipse cx={cx - 26} cy={cy - 58 + y} rx={7}  ry={9}  fill={CHEEK} />
      <Ellipse cx={cx + 26} cy={cy - 58 + y} rx={7}  ry={9}  fill={CHEEK} />
      <Circle cx={cx} cy={cy - 34 + y} r={42} fill={FUR} />
      <Ellipse cx={cx - 25} cy={cy - 22 + y} rx={12} ry={8} fill={CHEEK} opacity={0.7} />
      <Ellipse cx={cx + 25} cy={cy - 22 + y} rx={12} ry={8} fill={CHEEK} opacity={0.7} />
      {eyes === 'closed' ? (
        <>
          <Path d={`M${cx-22},${cy-38+y} Q${cx-16},${cy-32+y} ${cx-10},${cy-38+y}`} stroke={EYE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d={`M${cx+10},${cy-38+y} Q${cx+16},${cy-32+y} ${cx+22},${cy-38+y}`} stroke={EYE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      ) : eyes === 'happy' ? (
        <>
          <Path d={`M${cx-22},${cy-36+y} Q${cx-16},${cy-46+y} ${cx-10},${cy-36+y}`} stroke={EYE} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d={`M${cx+10},${cy-36+y} Q${cx+16},${cy-46+y} ${cx+22},${cy-36+y}`} stroke={EYE} strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Circle cx={cx - 16} cy={cy - 38 + y} r={6} fill={EYE} />
          <Circle cx={cx + 16} cy={cy - 38 + y} r={6} fill={EYE} />
          <Circle cx={cx - 14} cy={cy - 40 + y} r={2} fill="#fff" />
          <Circle cx={cx + 18} cy={cy - 40 + y} r={2} fill="#fff" />
        </>
      )}
      <Ellipse cx={cx} cy={cy - 20 + y} rx={4.5} ry={3} fill="#FF7A8A" />
      <Path d={`M${cx-8},${cy-12+y} Q${cx},${cy-4+y} ${cx+8},${cy-12+y}`} stroke={EYE} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </>
  );

  // ── scenes ──────────────────────────────────────────────────
  let art = null;

  if (scene === 'meditate') {
    art = (
      <Animated.View style={{ transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }, { translateY: breath.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Ellipse cx={cx} cy={cy + 62} rx={52} ry={9} fill="rgba(0,0,0,0.12)" />
          {/* Body seated */}
          <Ellipse cx={cx} cy={cy + 22} rx={44} ry={34} fill={FUR} />
          <Ellipse cx={cx} cy={cy + 28} rx={28} ry={22} fill={BELLY} />
          {/* Crossed legs */}
          <Ellipse cx={cx - 12} cy={cy + 50} rx={26} ry={10} fill={SHADE} transform={`rotate(-12 ${cx - 12} ${cy + 50})`} />
          <Ellipse cx={cx + 12} cy={cy + 52} rx={26} ry={10} fill={FUR} transform={`rotate(12 ${cx + 12} ${cy + 52})`} />
          {/* Arms resting, paws on knees */}
          <Path d={`M${cx-38},${cy+8} Q${cx-52},${cy+28} ${cx-34},${cy+44}`} stroke={FUR} strokeWidth={13} fill="none" strokeLinecap="round" />
          <Path d={`M${cx+38},${cy+8} Q${cx+52},${cy+28} ${cx+34},${cy+44}`} stroke={FUR} strokeWidth={13} fill="none" strokeLinecap="round" />
          <Circle cx={cx - 34} cy={cy + 46} r={7} fill={BELLY} />
          <Circle cx={cx + 34} cy={cy + 46} r={7} fill={BELLY} />
          <Head eyes="closed" y={6} />
        </Svg>
        {/* floating sparkles */}
        <Animated.View style={{ position: 'absolute', top: 8, right: 14, opacity: twinkle }}>
          <Svg width={22} height={22} viewBox="0 0 24 24"><Path d="M12,2 L13.5,10 L21,12 L13.5,14 L12,22 L10.5,14 L3,12 L10.5,10 Z" fill="#B8E0C8" /></Svg>
        </Animated.View>
        <Animated.View style={{ position: 'absolute', top: 30, left: 10, opacity: twinkle.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }) }}>
          <Svg width={16} height={16} viewBox="0 0 24 24"><Path d="M12,2 L13.5,10 L21,12 L13.5,14 L12,22 L10.5,14 L3,12 L10.5,10 Z" fill="#A8C5E8" /></Svg>
        </Animated.View>
      </Animated.View>
    );
  } else if (scene === 'wheel') {
    art = (
      <View>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          {/* Wheel stand */}
          <Path d={`M100,170 L70,192 M100,170 L130,192`} stroke="#9A8A7A" strokeWidth={7} strokeLinecap="round" />
          <Circle cx={100} cy={100} r={74} stroke="#B8A890" strokeWidth={9} fill="none" />
          <Circle cx={100} cy={100} r={74} stroke="#D8C8B0" strokeWidth={3} fill="none" />
        </Svg>
        {/* Spinning spokes */}
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, transform: [{ rotate: spinDeg }] }}>
          <Svg width={size} height={size} viewBox="0 0 200 200">
            <Line x1={100} y1={32} x2={100} y2={168} stroke="#C8B8A0" strokeWidth={4} opacity={0.6} />
            <Line x1={32} y1={100} x2={168} y2={100} stroke="#C8B8A0" strokeWidth={4} opacity={0.6} />
            <Line x1={52} y1={52} x2={148} y2={148} stroke="#C8B8A0" strokeWidth={3} opacity={0.45} />
            <Line x1={148} y1={52} x2={52} y2={148} stroke="#C8B8A0" strokeWidth={3} opacity={0.45} />
          </Svg>
        </Animated.View>
        {/* Pippin running inside */}
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, transform: [{ translateY: bob }] }}>
          <Svg width={size} height={size} viewBox="0 0 200 200">
            <Ellipse cx={cx} cy={cy + 30} rx={38} ry={28} fill={FUR} />
            <Ellipse cx={cx} cy={cy + 34} rx={23} ry={17} fill={BELLY} />
            {/* running legs */}
            <Ellipse cx={cx - 20} cy={cy + 54} rx={12} ry={6} fill={SHADE} transform={`rotate(-22 ${cx - 20} ${cy + 54})`} />
            <Ellipse cx={cx + 20} cy={cy + 54} rx={12} ry={6} fill={SHADE} transform={`rotate(22 ${cx + 20} ${cy + 54})`} />
            <Head eyes="happy" y={16} />
          </Svg>
        </Animated.View>
      </View>
    );
  } else if (scene === 'salad') {
    art = (
      <View>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Ellipse cx={cx} cy={cy + 62} rx={52} ry={9} fill="rgba(0,0,0,0.12)" />
          <Ellipse cx={cx} cy={cy + 24} rx={44} ry={34} fill={FUR} />
          <Ellipse cx={cx} cy={cy + 30} rx={28} ry={22} fill={BELLY} />
          {/* Salad bowl held in front */}
          <Path d={`M${cx-30},${cy+30} Q${cx},${cy+58} ${cx+30},${cy+30} Z`} fill="#7BA05B" />
          <Path d={`M${cx-30},${cy+30} Q${cx},${cy+58} ${cx+30},${cy+30}`} stroke="#5E7F46" strokeWidth={3} fill="none" />
          {/* Lettuce */}
          <Circle cx={cx - 16} cy={cy + 27} r={8} fill="#9BC474" />
          <Circle cx={cx} cy={cy + 24} r={9} fill="#B4D68E" />
          <Circle cx={cx + 15} cy={cy + 27} r={8} fill="#8AB868" />
          <Circle cx={cx + 6} cy={cy + 29} r={4} fill="#E86A5A" />
          <Circle cx={cx - 7} cy={cy + 30} r={4} fill="#F0A048" />
          {/* Paws holding bowl */}
          <Circle cx={cx - 30} cy={cy + 32} r={8} fill={FUR} />
          <Circle cx={cx + 30} cy={cy + 32} r={8} fill={FUR} />
          <Head eyes="happy" y={8} />
        </Svg>
        {/* Munching mouth overlay */}
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, opacity: munch }}>
          <Svg width={size} height={size} viewBox="0 0 200 200">
            <Ellipse cx={cx} cy={cy - 3} rx={7} ry={6} fill="#8A4A3A" />
            <Circle cx={cx - 4} cy={cy - 6} r={2.5} fill="#B4D68E" />
          </Svg>
        </Animated.View>
        {/* floating lettuce bit */}
        <Animated.View style={{ position: 'absolute', top: 34, right: 26, opacity: twinkle, transform: [{ translateY: twinkle.interpolate({ inputRange: [0, 1], outputRange: [4, -8] }) }] }}>
          <Svg width={14} height={14} viewBox="0 0 14 14"><Circle cx={7} cy={7} r={6} fill="#B4D68E" /></Svg>
        </Animated.View>
      </View>
    );
  } else if (scene === 'book') {
    art = (
      <View>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Ellipse cx={cx} cy={cy + 62} rx={52} ry={9} fill="rgba(0,0,0,0.12)" />
          <Ellipse cx={cx} cy={cy + 24} rx={44} ry={34} fill={FUR} />
          <Ellipse cx={cx} cy={cy + 30} rx={28} ry={22} fill={BELLY} />
          {/* Open book */}
          <Path d={`M${cx-34},${cy+26} Q${cx-17},${cy+18} ${cx},${cy+26} Q${cx+17},${cy+18} ${cx+34},${cy+26} L${cx+34},${cy+46} Q${cx+17},${cy+38} ${cx},${cy+46} Q${cx-17},${cy+38} ${cx-34},${cy+46} Z`} fill="#FFF8EC" stroke="#D8B888" strokeWidth={2.5} />
          <Line x1={cx} y1={cy + 26} x2={cx} y2={cy + 46} stroke="#D8B888" strokeWidth={2} />
          <Line x1={cx - 26} y1={cy + 30} x2={cx - 8} y2={cy + 28} stroke="#C8C0B0" strokeWidth={1.5} />
          <Line x1={cx - 26} y1={cy + 35} x2={cx - 8} y2={cy + 33} stroke="#C8C0B0" strokeWidth={1.5} />
          <Line x1={cx + 8} y1={cy + 28} x2={cx + 26} y2={cy + 30} stroke="#C8C0B0" strokeWidth={1.5} />
          {/* Paws */}
          <Circle cx={cx - 33} cy={cy + 38} r={8} fill={FUR} />
          <Circle cx={cx + 33} cy={cy + 38} r={8} fill={FUR} />
          <Head eyes="open" y={8} />
        </Svg>
        <Animated.View style={{ position: 'absolute', top: 20, right: 22, opacity: twinkle }}>
          <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M12,2 L13.5,10 L21,12 L13.5,14 L12,22 L10.5,14 L3,12 L10.5,10 Z" fill="#F0C868" /></Svg>
        </Animated.View>
      </View>
    );
  } else if (scene === 'phone') {
    art = (
      <View>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Ellipse cx={cx} cy={cy + 62} rx={52} ry={9} fill="rgba(0,0,0,0.12)" />
          <Ellipse cx={cx} cy={cy + 24} rx={44} ry={34} fill={FUR} />
          <Ellipse cx={cx} cy={cy + 30} rx={28} ry={22} fill={BELLY} />
          <Head eyes="happy" y={8} />
          {/* Arm up holding phone to ear */}
          <Path d={`M${cx+36},${cy+16} Q${cx+52},${cy-6} ${cx+38},${cy-26}`} stroke={FUR} strokeWidth={13} fill="none" strokeLinecap="round" />
          <Rect x={cx + 28} y={cy - 44} width={16} height={26} rx={4} fill="#5A7A9A" transform={`rotate(14 ${cx + 36} ${cy - 31})`} />
          <Rect x={cx + 31} y={cy - 41} width={10} height={17} rx={2} fill="#A8D0E8" transform={`rotate(14 ${cx + 36} ${cy - 31})`} />
        </Svg>
        <Animated.View style={{ position: 'absolute', top: 14, left: 24, opacity: twinkle, transform: [{ translateY: twinkle.interpolate({ inputRange: [0, 1], outputRange: [4, -10] }) }] }}>
          <Svg width={20} height={20} viewBox="0 0 28 28"><Path d="M14,22 C14,22 4,16 4,9 C4,6 6,4 9,4 C11,4 13,6 14,8 C15,6 17,4 19,4 C22,4 24,6 24,9 C24,16 14,22 14,22 Z" fill="#FF9EB5" /></Svg>
        </Animated.View>
      </View>
    );
  } else if (scene === 'moon') {
    art = (
      <View>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          {/* Crescent moon */}
          <Path d="M150,38 A26,26 0 1 0 172,74 A20,20 0 1 1 150,38 Z" fill="#F0D890" />
          <Ellipse cx={cx} cy={cy + 62} rx={52} ry={9} fill="rgba(0,0,0,0.12)" />
          <Ellipse cx={cx} cy={cy + 24} rx={44} ry={34} fill={FUR} />
          <Ellipse cx={cx} cy={cy + 30} rx={28} ry={22} fill={BELLY} />
          {/* Paws tucked */}
          <Circle cx={cx - 20} cy={cy + 46} r={8} fill={BELLY} />
          <Circle cx={cx + 20} cy={cy + 46} r={8} fill={BELLY} />
          <Head eyes="closed" y={8} />
        </Svg>
        <Animated.View style={{ position: 'absolute', top: 16, left: 18, opacity: twinkle }}>
          <Svg width={14} height={14} viewBox="0 0 24 24"><Path d="M12,2 L13.5,10 L21,12 L13.5,14 L12,22 L10.5,14 L3,12 L10.5,10 Z" fill="#E8E0B0" /></Svg>
        </Animated.View>
        <Animated.View style={{ position: 'absolute', top: 44, left: 40, opacity: twinkle.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }) }}>
          <Svg width={10} height={10} viewBox="0 0 24 24"><Path d="M12,2 L13.5,10 L21,12 L13.5,14 L12,22 L10.5,14 L3,12 L10.5,10 Z" fill="#E8E0B0" /></Svg>
        </Animated.View>
      </View>
    );
  } else if (scene === 'sun') {
    art = (
      <View>
        {/* Rotating sun rays */}
        <Animated.View style={{ position: 'absolute', top: -4, right: 2, transform: [{ rotate: slowSpin }] }}>
          <Svg width={56} height={56} viewBox="0 0 56 56">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <Line key={a} x1={28} y1={4} x2={28} y2={13} stroke="#F0C868" strokeWidth={4} strokeLinecap="round" transform={`rotate(${a} 28 28)`} />
            ))}
          </Svg>
        </Animated.View>
        <Svg width={56} height={56} viewBox="0 0 56 56" style={{ position: 'absolute', top: -4, right: 2 }}>
          <Circle cx={28} cy={28} r={13} fill="#F8D878" />
        </Svg>
        <Animated.View style={{ transform: [{ translateY: bob }] }}>
          <Svg width={size} height={size} viewBox="0 0 200 200">
            <Ellipse cx={cx} cy={cy + 62} rx={52} ry={9} fill="rgba(0,0,0,0.12)" />
            <Ellipse cx={cx} cy={cy + 24} rx={44} ry={34} fill={FUR} />
            <Ellipse cx={cx} cy={cy + 30} rx={28} ry={22} fill={BELLY} />
            {/* Arms up in the air */}
            <Path d={`M${cx-36},${cy+14} Q${cx-56},${cy-4} ${cx-50},${cy-22}`} stroke={FUR} strokeWidth={13} fill="none" strokeLinecap="round" />
            <Path d={`M${cx+36},${cy+14} Q${cx+56},${cy-4} ${cx+50},${cy-22}`} stroke={FUR} strokeWidth={13} fill="none" strokeLinecap="round" />
            <Circle cx={cx - 50} cy={cy - 24} r={7} fill={BELLY} />
            <Circle cx={cx + 50} cy={cy - 24} r={7} fill={BELLY} />
            <Head eyes="happy" y={8} />
          </Svg>
        </Animated.View>
      </View>
    );
  } else if (scene === 'walkpark') {
    // Two beats: close the laptop, then walk off into a park.
    const lidRotate     = story.interpolate({ inputRange: [0, 0.32, 1], outputRange: ['0deg', '84deg', '84deg'] });
    const laptopOpacity = story.interpolate({ inputRange: [0, 0.34, 0.46, 1], outputRange: [1, 1, 0, 0] });
    const parkOpacity   = story.interpolate({ inputRange: [0, 0.36, 0.56, 1], outputRange: [0, 0, 1, 1] });
    const pippinX       = story.interpolate({ inputRange: [0, 0.42, 1], outputRange: [-size * 0.16, -size * 0.16, size * 0.14] });
    const walkBob       = story.interpolate({ inputRange: [0, 0.42, 1], outputRange: [0, 0, 1] });
    art = (
      <View>
        {/* Park backdrop fades in as Pippin heads out */}
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, opacity: parkOpacity }}>
          <Svg width={size} height={size} viewBox="0 0 200 200">
            <Ellipse cx={100} cy={182} rx={120} ry={34} fill="#A9D18E" opacity={0.55} />
            <Rect x={30} y={170} width={140} height={22} rx={11} fill="#D8C7A0" opacity={0.5} />
            {/* Tree, back right */}
            <Rect x={152} y={96} width={10} height={52} rx={3} fill="#9A6B4A" />
            <Circle cx={157} cy={84} r={26} fill="#7BA05B" />
            <Circle cx={140} cy={96} r={17} fill="#8FB86A" />
            <Circle cx={173} cy={96} r={17} fill="#6E9450" />
            {/* Little bush, back left */}
            <Circle cx={34} cy={150} r={13} fill="#8FB86A" />
            <Circle cx={46} cy={152} r={10} fill="#7BA05B" />
          </Svg>
        </Animated.View>

        {/* Pippin — sits at the laptop, then walks to the right */}
        <Animated.View style={{ transform: [
          { translateX: pippinX },
          { translateY: Animated.multiply(bob, walkBob) },
        ] }}>
          <Svg width={size} height={size} viewBox="0 0 200 200">
            <Ellipse cx={cx} cy={cy + 62} rx={40} ry={8} fill="rgba(0,0,0,0.12)" />
            <Ellipse cx={cx} cy={cy + 26} rx={40} ry={32} fill={FUR} />
            <Ellipse cx={cx} cy={cy + 32} rx={25} ry={20} fill={BELLY} />
            {/* Walking legs */}
            <Ellipse cx={cx - 15} cy={cy + 56} rx={11} ry={6} fill={SHADE} transform={`rotate(-18 ${cx - 15} ${cy + 56})`} />
            <Ellipse cx={cx + 15} cy={cy + 56} rx={11} ry={6} fill={SHADE} transform={`rotate(18 ${cx + 15} ${cy + 56})`} />
            <Head eyes="happy" y={10} />
          </Svg>
        </Animated.View>

        {/* Laptop — sits in front of Pippin, lid folds shut, then fades */}
        <Animated.View style={{ position: 'absolute', top: size * 0.62, left: size * 0.36, opacity: laptopOpacity }}>
          {/* Keyboard base */}
          <Svg width={size * 0.3} height={size * 0.09} viewBox="0 0 60 18">
            <Path d="M6,14 L54,14 L48,4 L12,4 Z" fill="#C2C8D2" />
            <Rect x={2} y={13} width={56} height={5} rx={2.5} fill="#9098A4" />
          </Svg>
          {/* Screen lid, hinged at the back edge */}
          <Animated.View style={{ position: 'absolute', bottom: size * 0.045, left: size * 0.035, transform: [{ rotate: lidRotate }] }}>
            <Svg width={size * 0.22} height={size * 0.15} viewBox="0 0 44 30">
              <Rect x={2} y={2} width={40} height={26} rx={3} fill="#7C8494" />
              <Rect x={5} y={5} width={34} height={20} rx={2} fill="#AFCBE0" />
            </Svg>
          </Animated.View>
        </Animated.View>
      </View>
    );
  } else {
    // 'heart' — hugging a pulsing heart (also the custom-goal fallback)
    art = (
      <View>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Ellipse cx={cx} cy={cy + 62} rx={52} ry={9} fill="rgba(0,0,0,0.12)" />
          <Ellipse cx={cx} cy={cy + 24} rx={44} ry={34} fill={FUR} />
          <Ellipse cx={cx} cy={cy + 30} rx={28} ry={22} fill={BELLY} />
          <Head eyes="happy" y={8} />
        </Svg>
        {/* Heart pulsing in his arms */}
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }] }}>
          <Svg width={size} height={size} viewBox="0 0 200 200">
            <Path d={`M${cx},${cy+44} C${cx},${cy+44} ${cx-24},${cy+30} ${cx-24},${cy+16} C${cx-24},${cy+8} ${cx-18},${cy+4} ${cx-12},${cy+4} C${cx-6},${cy+4} ${cx-2},${cy+8} ${cx},${cy+12} C${cx+2},${cy+8} ${cx+6},${cy+4} ${cx+12},${cy+4} C${cx+18},${cy+4} ${cx+24},${cy+8} ${cx+24},${cy+16} C${cx+24},${cy+30} ${cx},${cy+44} ${cx},${cy+44} Z`} fill="#FF7A9A" />
          </Svg>
        </Animated.View>
        <Svg width={size} height={size} viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Arms wrapped around the heart */}
          <Path d={`M${cx-38},${cy+12} Q${cx-44},${cy+34} ${cx-20},${cy+40}`} stroke={FUR} strokeWidth={13} fill="none" strokeLinecap="round" />
          <Path d={`M${cx+38},${cy+12} Q${cx+44},${cy+34} ${cx+20},${cy+40}`} stroke={FUR} strokeWidth={13} fill="none" strokeLinecap="round" />
        </Svg>
        <Animated.View style={{ position: 'absolute', top: 12, right: 20, opacity: twinkle, transform: [{ translateY: twinkle.interpolate({ inputRange: [0, 1], outputRange: [4, -10] }) }] }}>
          <Svg width={18} height={18} viewBox="0 0 28 28"><Path d="M14,22 C14,22 4,16 4,9 C4,6 6,4 9,4 C11,4 13,6 14,8 C15,6 17,4 19,4 C22,4 24,6 24,9 C24,16 14,22 14,22 Z" fill="#FF9EB5" /></Svg>
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View style={{
      width: size, height: size * 1.1, alignItems: 'center', justifyContent: 'center',
      opacity: appear,
      transform: [{ scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
    }}>
      {art}
    </Animated.View>
  );
}
