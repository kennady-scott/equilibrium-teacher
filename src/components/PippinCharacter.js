import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, {
  Circle, Ellipse, Path, G, Text as SvgText, Rect,
  Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

// Animated wrappers
const AnimatedG = Animated.createAnimatedComponent(G);

// dayState overrides mood when provided:
//   'sleeping' | 'tired' | 'awake' | 'happy' | 'celebrating'
// behavior (from the teacher's logged mood + energy) layers motion on top:
//   'run'   — zoomies back and forth across the habitat
//   'play'  — happy bouncing in place
//   'rest'  — drowsy sway
//   'sleep' — lies down and naps
// mood (fallback for PetScreen etc.): 'happy' | 'okay' | 'sad'
const BEHAVIOR_STATE = { run: 'happy', play: 'happy', rest: 'tired', sleep: 'sleeping' };

export default function PippinCharacter({ mood = 'okay', dayState = null, behavior = null, size = 200, critical = false, level = 1 }) {

  // Resolve which visual state to render. Celebrating always wins; otherwise
  // a behavior picks the face/pose, then dayState, then mood.
  const state = dayState === 'celebrating' ? 'celebrating'
    : (behavior && BEHAVIOR_STATE[behavior])
    ?? dayState
    ?? (mood === 'happy' ? 'happy' : mood === 'okay' ? 'awake' : 'tired');
  const isRunning  = behavior === 'run' && state === 'happy';
  const isLying    = behavior === 'sleep' && state === 'sleeping';
  const isAsleep      = state === 'sleeping';
  const isTired       = state === 'tired';
  const isAwake       = state === 'awake';
  const isHappy       = state === 'happy' || state === 'celebrating';
  const isCelebrating = state === 'celebrating';

  // ── animations ──────────────────────────────────────────────
  const bodyBob    = useRef(new Animated.Value(0)).current;
  const blinkTimer = useRef(new Animated.Value(1)).current;
  const sparkle    = useRef(new Animated.Value(0)).current;
  const sway       = useRef(new Animated.Value(0)).current;
  const zFloat     = useRef(new Animated.Value(0)).current;
  const cheekPulse = useRef(new Animated.Value(1)).current;
  const heartFloat = useRef(new Animated.Value(0)).current;
  const runX       = useRef(new Animated.Value(0)).current;
  const faceDir    = useRef(new Animated.Value(1)).current;
  const lieDown    = useRef(new Animated.Value(0)).current;
  // Level-unlocked flourishes: L3 hop, L4 wave, L5 ambient sparkles
  const levelHop   = useRef(new Animated.Value(0)).current;
  const waveArm    = useRef(new Animated.Value(0)).current;
  const ambient    = useRef(new Animated.Value(0)).current;

  // Idle flourishes unlocked by Pippin's lifetime level. They only play in a
  // calm/awake idle (not while running, sleeping, or lying down), so they add
  // richness at higher levels without fighting the mood-driven poses.
  const idleFlourish = !isRunning && !isAsleep && !isLying && !isTired;
  useEffect(() => {
    levelHop.stopAnimation(); levelHop.setValue(0);
    waveArm.stopAnimation();  waveArm.setValue(0);
    ambient.stopAnimation();  ambient.setValue(0);

    if (level >= 3 && idleFlourish) {
      // Occasional happy hop
      Animated.loop(Animated.sequence([
        Animated.delay(2600),
        Animated.timing(levelHop, { toValue: -18, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(levelHop, { toValue: 0,   duration: 240, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
        Animated.timing(levelHop, { toValue: -9,  duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(levelHop, { toValue: 0,   duration: 170, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
      ])).start();
    }
    if (level >= 4 && idleFlourish) {
      // Periodic paw wave toward the teacher
      Animated.loop(Animated.sequence([
        Animated.delay(3400),
        Animated.timing(waveArm, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(waveArm, { toValue: 0.6, duration: 180, useNativeDriver: true }),
        Animated.timing(waveArm, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(waveArm, { toValue: 0, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])).start();
    }
    if (level >= 5) {
      // Gentle always-on ambient sparkle/heart drift
      Animated.loop(Animated.timing(ambient, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true })).start();
    }
  }, [level, idleFlourish]);

  useEffect(() => {
    bodyBob.stopAnimation();
    blinkTimer.stopAnimation();
    sparkle.stopAnimation();
    sway.stopAnimation();
    sway.setValue(0);
    zFloat.stopAnimation();
    cheekPulse.stopAnimation();
    heartFloat.stopAnimation();
    runX.stopAnimation();
    faceDir.stopAnimation();
    runX.setValue(0);
    faceDir.setValue(1);

    // Ease into / out of the lying-down nap pose
    Animated.timing(lieDown, { toValue: isLying ? 1 : 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start();

    if (isRunning) {
      // Zoomies: scamper right, flip around, scamper left, flip back — with quick little hops
      const dist = size * 0.35;
      Animated.loop(Animated.sequence([
        Animated.timing(runX, { toValue: dist,  duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(faceDir, { toValue: -1, duration: 150, useNativeDriver: true }),
        Animated.timing(runX, { toValue: -dist, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(faceDir, { toValue: 1,  duration: 150, useNativeDriver: true }),
        Animated.timing(runX, { toValue: 0,     duration: 1300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
      Animated.loop(Animated.sequence([
        Animated.timing(bodyBob, { toValue: -7, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bodyBob, { toValue: 0,  duration: 160, easing: Easing.in(Easing.quad),  useNativeDriver: true }),
      ])).start();
      Animated.loop(Animated.timing(sparkle, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })).start();
    } else if (isHappy) {
      Animated.loop(Animated.sequence([
        Animated.timing(bodyBob, { toValue: -12, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bodyBob, { toValue: 0,   duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bodyBob, { toValue: -8,  duration: 300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bodyBob, { toValue: 0,   duration: 300, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(600),
      ])).start();
      Animated.loop(Animated.timing(sparkle, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })).start();
      Animated.loop(Animated.sequence([
        Animated.timing(cheekPulse, { toValue: 1.2, duration: 700, useNativeDriver: true }),
        Animated.timing(cheekPulse, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ])).start();
      if (isCelebrating) {
        Animated.loop(Animated.sequence([
          Animated.timing(heartFloat, { toValue: -40, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(heartFloat, { toValue: 0,   duration: 0, useNativeDriver: true }),
          Animated.delay(400),
        ])).start();
      }
    } else if (isAwake) {
      Animated.loop(Animated.sequence([
        Animated.timing(bodyBob, { toValue: -5, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bodyBob, { toValue: 0,  duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(1200),
      ])).start();
    } else {
      // sleeping or tired — slow sway
      Animated.loop(Animated.sequence([
        Animated.timing(sway, { toValue: isAsleep ? 4 : 6,  duration: isAsleep ? 2000 : 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: isAsleep ? -4 : -6, duration: isAsleep ? 2000 : 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])).start();
      // Floating Zzz for sleeping
      Animated.loop(Animated.sequence([
        Animated.timing(zFloat, { toValue: -30, duration: isAsleep ? 2200 : 2000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(zFloat, { toValue: 0,   duration: 0, useNativeDriver: true }),
        Animated.delay(isAsleep ? 400 : 800),
      ])).start();
      bodyBob.setValue(-4);
    }

    // Blink — only when not sleeping
    if (!isAsleep) {
      Animated.loop(Animated.sequence([
        Animated.delay(2500),
        Animated.timing(blinkTimer, { toValue: 0, duration: 80, useNativeDriver: true }),
        Animated.timing(blinkTimer, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(blinkTimer, { toValue: 0, duration: 80, useNativeDriver: true }),
        Animated.timing(blinkTimer, { toValue: 1, duration: 80, useNativeDriver: true }),
      ])).start();
    }
  }, [state, behavior]);

  // Colors
  const furColor   = isHappy ? '#E8A87C' : isAwake ? '#D4956A' : '#B8A090';
  const bellyColor = isHappy ? '#F5D5B0' : isAwake ? '#EEC89A' : '#D8C8BC';
  const cheekColor = isHappy ? '#FF9EB5' : isAwake ? '#FFB8C8' : '#C8B0B8';
  const eyeColor   = (isAsleep || isTired) ? '#888' : '#2A1A0A';
  const noseColor  = (isAsleep || isTired) ? '#AA8888' : '#FF7A8A';
  const shadeColor = isHappy ? '#C77F4A' : isAwake ? '#B97847' : '#8A7868';
  const whiskerColor = (isAsleep || isTired) ? '#AAA' : '#8B6A50';

  const sparkleRotate = sparkle.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const zOpacity = zFloat.interpolate({ inputRange: [-30, -8, 0], outputRange: [0.85, 0.9, 0] });
  const heartOpacity = heartFloat.interpolate({ inputRange: [-40, -10, 0], outputRange: [0, 0.9, 0] });

  const cx = 100, cy = 105;

  return (
    <View style={{ width: size, height: size * 1.1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{
        transform: [
          { translateX: runX },
          { translateY: Animated.add(Animated.add(bodyBob, levelHop), lieDown.interpolate({ inputRange: [0, 1], outputRange: [0, size * 0.12] })) },
          { scaleX: faceDir },
          { rotate: lieDown.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '80deg'] }) },
          { rotate: sway.interpolate({ inputRange: [-6, 6], outputRange: ['-6deg', '6deg'] }) },
        ]
      }}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            <RadialGradient id="furGrad" cx="0.38" cy="0.32" r="0.75">
              <Stop offset="0" stopColor={bellyColor} stopOpacity={0.9} />
              <Stop offset="0.55" stopColor={furColor} stopOpacity={1} />
              <Stop offset="1" stopColor={shadeColor} stopOpacity={1} />
            </RadialGradient>
            <RadialGradient id="headGrad" cx="0.36" cy="0.30" r="0.8">
              <Stop offset="0" stopColor={bellyColor} stopOpacity={0.85} />
              <Stop offset="0.6" stopColor={furColor} stopOpacity={1} />
              <Stop offset="1" stopColor={shadeColor} stopOpacity={1} />
            </RadialGradient>
            <LinearGradient id="bellyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.5} />
              <Stop offset="1" stopColor={bellyColor} stopOpacity={1} />
            </LinearGradient>
          </Defs>

          {isHappy && <Ellipse cx={cx} cy={cy + 40} rx={55} ry={14} fill="rgba(255,200,80,0.22)" />}

          <Ellipse cx={cx} cy={cy + 52} rx={38} ry={8} fill="rgba(0,0,0,0.14)" />

          {/* Body */}
          <Ellipse cx={cx} cy={cy + 28} rx={42} ry={36} fill="url(#furGrad)" />
          <Ellipse cx={cx} cy={cy + 34} rx={26} ry={24} fill="url(#bellyGrad)" />

          {/* Tail */}
          <Ellipse cx={cx + 40} cy={cy + 48} rx={10} ry={8} fill={furColor} />
          <Ellipse cx={cx + 40} cy={cy + 48} rx={7}  ry={5} fill={bellyColor} />

          {/* Ears */}
          <Ellipse cx={cx - 28} cy={cy - 44} rx={14} ry={16} fill={shadeColor} />
          <Ellipse cx={cx + 28} cy={cy - 44} rx={14} ry={16} fill={shadeColor} />
          <Ellipse cx={cx - 28} cy={cy - 44} rx={8}  ry={10} fill={cheekColor} />
          <Ellipse cx={cx + 28} cy={cy - 44} rx={8}  ry={10} fill={cheekColor} />

          {/* Head */}
          <Circle cx={cx} cy={cy - 20} r={46} fill="url(#headGrad)" />
          <Ellipse cx={cx + 30} cy={cy - 14} rx={16} ry={22} fill={shadeColor} opacity={0.35} />

          {/* Cheeks */}
          <Animated.View style={{ position: 'absolute', transform: [{ scale: isHappy ? cheekPulse : 1 }] }}>
            <Svg width={size} height={size} viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
              <Ellipse cx={cx - 28} cy={cy - 8} rx={14} ry={9} fill={cheekColor} opacity={isAsleep ? 0.3 : 0.7} />
              <Ellipse cx={cx + 28} cy={cy - 8} rx={14} ry={9} fill={cheekColor} opacity={isAsleep ? 0.3 : 0.7} />
            </Svg>
          </Animated.View>

          {/* Eyes */}
          {isAsleep ? (
            // Sleeping: gently closed arcs (curve downward)
            <>
              <Path d={`M${cx-23},${cy-26} Q${cx-18},${cy-20} ${cx-13},${cy-26}`} stroke={eyeColor} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.7} />
              <Path d={`M${cx+13},${cy-26} Q${cx+18},${cy-20} ${cx+23},${cy-26}`} stroke={eyeColor} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.7} />
            </>
          ) : isTired && critical ? (
            // Critical X eyes
            <>
              <Path d={`M${cx-22},${cy-30} L${cx-14},${cy-22}`} stroke={eyeColor} strokeWidth={3} strokeLinecap="round" />
              <Path d={`M${cx-14},${cy-30} L${cx-22},${cy-22}`} stroke={eyeColor} strokeWidth={3} strokeLinecap="round" />
              <Path d={`M${cx+14},${cy-30} L${cx+22},${cy-22}`} stroke={eyeColor} strokeWidth={3} strokeLinecap="round" />
              <Path d={`M${cx+22},${cy-30} L${cx+14},${cy-22}`} stroke={eyeColor} strokeWidth={3} strokeLinecap="round" />
            </>
          ) : isTired ? (
            // Tired: squished eyes with heavy drooping eyelids
            <>
              <Ellipse cx={cx - 18} cy={cy - 24} rx={7} ry={4} fill={eyeColor} />
              <Ellipse cx={cx + 18} cy={cy - 24} rx={7} ry={4} fill={eyeColor} />
              <Path d={`M${cx-26},${cy-26} Q${cx-18},${cy-20} ${cx-10},${cy-26}`} fill={shadeColor} opacity={0.92} />
              <Path d={`M${cx+10},${cy-26} Q${cx+18},${cy-20} ${cx+26},${cy-26}`} fill={shadeColor} opacity={0.92} />
              <Path d={`M${cx-22},${cy-32} Q${cx-18},${cy-36} ${cx-14},${cy-32}`} stroke={eyeColor} strokeWidth={1.5} fill="none" opacity={0.4} />
              <Path d={`M${cx+14},${cy-32} Q${cx+18},${cy-36} ${cx+22},${cy-32}`} stroke={eyeColor} strokeWidth={1.5} fill="none" opacity={0.4} />
            </>
          ) : isHappy ? (
            // Happy arc eyes
            <>
              <Path d={`M${cx-24},${cy-22} Q${cx-18},${cy-34} ${cx-12},${cy-22}`} stroke={eyeColor} strokeWidth={3} fill="none" strokeLinecap="round" />
              <Path d={`M${cx+12},${cy-22} Q${cx+18},${cy-34} ${cx+24},${cy-22}`} stroke={eyeColor} strokeWidth={3} fill="none" strokeLinecap="round" />
              <Circle cx={cx - 20} cy={cy - 20} r={2} fill="#fff" opacity={0.9} />
              <Circle cx={cx + 20} cy={cy - 20} r={2} fill="#fff" opacity={0.9} />
            </>
          ) : (
            // Awake: normal open eyes
            <>
              <Circle cx={cx - 18} cy={cy - 26} r={7}  fill={eyeColor} />
              <Circle cx={cx + 18} cy={cy - 26} r={7}  fill={eyeColor} />
              <Circle cx={cx - 16} cy={cy - 28} r={2.5} fill="#fff" />
              <Circle cx={cx + 20} cy={cy - 28} r={2.5} fill="#fff" />
            </>
          )}

          {/* Nose */}
          <Ellipse cx={cx} cy={cy - 6} rx={5} ry={3.5} fill={noseColor} />

          {/* Mouth */}
          {isHappy ? (
            <Path d={`M${cx-10},${cy+4} Q${cx},${cy+14} ${cx+10},${cy+4}`} stroke={eyeColor} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          ) : isAsleep ? (
            <Path d={`M${cx-7},${cy+8} Q${cx},${cy+11} ${cx+7},${cy+8}`} stroke={eyeColor} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.5} />
          ) : isTired ? (
            <Path d={`M${cx-10},${cy+10} Q${cx},${cy+3} ${cx+10},${cy+10}`} stroke={eyeColor} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          ) : (
            <Path d={`M${cx-8},${cy+6} Q${cx},${cy+10} ${cx+8},${cy+6}`} stroke={eyeColor} strokeWidth={2} fill="none" strokeLinecap="round" />
          )}

          {/* Whiskers */}
          <Path d={`M${cx-8},${cy-2} L${cx-38},${cy-8}`}  stroke={whiskerColor} strokeWidth={1.5} opacity={isAsleep ? 0.3 : 0.6} />
          <Path d={`M${cx-8},${cy+1} L${cx-38},${cy+4}`}  stroke={whiskerColor} strokeWidth={1.5} opacity={isAsleep ? 0.3 : 0.6} />
          <Path d={`M${cx+8},${cy-2} L${cx+38},${cy-8}`}  stroke={whiskerColor} strokeWidth={1.5} opacity={isAsleep ? 0.3 : 0.6} />
          <Path d={`M${cx+8},${cy+1} L${cx+38},${cy+4}`}  stroke={whiskerColor} strokeWidth={1.5} opacity={isAsleep ? 0.3 : 0.6} />

          {/* Paws */}
          <Ellipse cx={cx - 36} cy={cy + 52} rx={13} ry={8} fill={furColor} />
          <Ellipse cx={cx + 36} cy={cy + 52} rx={13} ry={8} fill={furColor} />

          {/* Happy: little heart above head */}
          {isHappy && (
            <Path d={`M${cx},${cy-70} C${cx-8},${cy-80} ${cx-16},${cy-74} ${cx},${cy-62} C${cx+16},${cy-74} ${cx+8},${cy-80} ${cx},${cy-70}`} fill="#FF9EB5" opacity={0.9} />
          )}

          {/* Critical: sweat drop */}
          {isTired && critical && (
            <Path d={`M${cx+34},${cy-46} Q${cx+38},${cy-36} ${cx+30},${cy-36}`} stroke="#88BBDD" strokeWidth={2} fill="#A8D8F0" opacity={0.8} />
          )}
        </Svg>

        {/* Sparkles — happy & celebrating */}
        {isHappy && (
          <Animated.View style={{ position: 'absolute', top: -10, right: 10, transform: [{ rotate: sparkleRotate }] }}>
            <Svg width={30} height={30} viewBox="0 0 30 30">
              <Path d="M15,2 L16.5,12 L27,10 L17.5,16 L22,26 L15,18 L8,26 L12.5,16 L3,10 L13.5,12 Z" fill="#FFD700" opacity={0.9} />
            </Svg>
          </Animated.View>
        )}
        {isHappy && (
          <Animated.View style={{ position: 'absolute', top: 20, left: 5, transform: [{ rotate: sparkleRotate }, { scale: 0.7 }] }}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path d="M12,1 L13,9 L21,8 L14,13 L17,21 L12,15 L7,21 L10,13 L3,8 L11,9 Z" fill="#FF9EB5" opacity={0.8} />
            </Svg>
          </Animated.View>
        )}

        {/* Celebrating: floating hearts on both sides */}
        {isCelebrating && (
          <>
            <Animated.View style={{ position: 'absolute', top: 5, left: 0, opacity: heartOpacity, transform: [{ translateY: heartFloat }] }}>
              <Svg width={28} height={28} viewBox="0 0 28 28">
                <Path d="M14,22 C14,22 4,16 4,9 C4,6 6,4 9,4 C11,4 13,6 14,8 C15,6 17,4 19,4 C22,4 24,6 24,9 C24,16 14,22 14,22 Z" fill="#FF6B9D" opacity={0.9} />
              </Svg>
            </Animated.View>
            <Animated.View style={{ position: 'absolute', top: 0, right: 0, opacity: heartOpacity, transform: [{ translateY: heartFloat }, { scale: 0.75 }] }}>
              <Svg width={28} height={28} viewBox="0 0 28 28">
                <Path d="M14,22 C14,22 4,16 4,9 C4,6 6,4 9,4 C11,4 13,6 14,8 C15,6 17,4 19,4 C22,4 24,6 24,9 C24,16 14,22 14,22 Z" fill="#FFB347" opacity={0.85} />
              </Svg>
            </Animated.View>
          </>
        )}

        {/* Zzz — sleeping and tired */}
        {(isAsleep || isTired) && (
          <Animated.View style={{ position: 'absolute', top: 10, right: 15, opacity: zOpacity, transform: [{ translateY: zFloat }] }}>
            <Svg width={40} height={40} viewBox="0 0 40 40">
              <SvgText x="5"  y="32" fontSize={isAsleep ? "16" : "14"} fill="#8899AA" opacity={0.9} fontWeight="bold">z</SvgText>
              <SvgText x="18" y="22" fontSize={isAsleep ? "12" : "10"} fill="#8899AA" opacity={0.7} fontWeight="bold">z</SvgText>
              <SvgText x="28" y="14" fontSize={isAsleep ? "9"  : "8"}  fill="#8899AA" opacity={0.5} fontWeight="bold">z</SvgText>
            </Svg>
          </Animated.View>
        )}

        {/* Level 4+ — waving paw toward the teacher */}
        {level >= 4 && idleFlourish && (
          <Animated.View style={{
            position: 'absolute', right: size * 0.14, top: size * 0.52,
            opacity: waveArm,
            transform: [
              { translateY: size * -0.05 },
              { rotate: waveArm.interpolate({ inputRange: [0, 1], outputRange: ['8deg', '-34deg'] }) },
            ],
          }}>
            <Svg width={size * 0.2} height={size * 0.32} viewBox="0 0 40 64">
              <Path d="M18,60 Q8,34 16,10" stroke="#E8A87C" strokeWidth={14} fill="none" strokeLinecap="round" />
              <Circle cx={17} cy={10} r={9} fill="#F5D5B0" />
            </Svg>
          </Animated.View>
        )}

        {/* Level 5 — ambient sparkle + heart drifting up */}
        {level >= 5 && (
          <>
            <Animated.View style={{
              position: 'absolute', top: size * 0.12, right: size * 0.1,
              opacity: ambient.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] }),
              transform: [{ translateY: ambient.interpolate({ inputRange: [0, 1], outputRange: [0, size * -0.18] }) }],
            }}>
              <Svg width={18} height={18} viewBox="0 0 24 24"><Path d="M12,2 L13.5,10 L21,12 L13.5,14 L12,22 L10.5,14 L3,12 L10.5,10 Z" fill="#FFD36E" /></Svg>
            </Animated.View>
            <Animated.View style={{
              position: 'absolute', top: size * 0.24, left: size * 0.12,
              opacity: ambient.interpolate({ inputRange: [0, 0.35, 0.9, 1], outputRange: [0, 0.9, 0.9, 0] }),
              transform: [{ translateY: ambient.interpolate({ inputRange: [0, 1], outputRange: [size * 0.04, size * -0.14] }) }],
            }}>
              <Svg width={16} height={16} viewBox="0 0 28 28"><Path d="M14,22 C14,22 4,16 4,9 C4,6 6,4 9,4 C11,4 13,6 14,8 C15,6 17,4 19,4 C22,4 24,6 24,9 C24,16 14,22 14,22 Z" fill="#FF9EB5" /></Svg>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </View>
  );
}
