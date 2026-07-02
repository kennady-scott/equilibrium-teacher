import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path, Rect, Ellipse } from 'react-native-svg';

// Transient "giving Pippin a drink" animation: a little bottle pops in,
// tips toward Pippin, drips a few drops, and fades away. Runs once on
// mount, then calls onDone so the parent can unmount it.
export default function WaterBottle({ onDone }) {
  const appear = useRef(new Animated.Value(0)).current;
  const tilt   = useRef(new Animated.Value(0)).current;
  const drop1  = useRef(new Animated.Value(0)).current;
  const drop2  = useRef(new Animated.Value(0)).current;
  const drop3  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fall = (v, delay) => Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1, duration: 450, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.timing(v, { toValue: 1, duration: 450, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]);
    Animated.sequence([
      Animated.timing(appear, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true }),
      Animated.timing(tilt,   { toValue: 1, duration: 280, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.parallel([fall(drop1, 0), fall(drop2, 220), fall(drop3, 440)]),
      Animated.timing(tilt,   { toValue: 0, duration: 220, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(appear, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => onDone && onDone());
  }, []);

  const dropStyle = (v, dx) => ({
    position: 'absolute',
    left: dx,
    top: 30,
    opacity: v.interpolate({ inputRange: [0, 0.15, 0.8, 1], outputRange: [0, 1, 1, 0] }),
    transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, 34] }) }],
  });

  return (
    <View pointerEvents="none" style={{ width: 70, height: 90 }}>
      {/* Bottle — pops in, then tips toward Pippin */}
      <Animated.View style={{
        opacity: appear,
        transform: [
          { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) },
          { rotate: tilt.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-48deg'] }) },
        ],
      }}>
        <Svg width={44} height={58} viewBox="0 0 44 58">
          {/* Cap */}
          <Rect x={16} y={0} width={12} height={8} rx={2} fill="#6B8FA8" />
          {/* Neck */}
          <Rect x={17} y={7} width={10} height={6} fill="#BFE3F5" opacity={0.9} />
          {/* Body */}
          <Path d="M12,14 Q10,16 10,22 L10,50 Q10,56 16,56 L28,56 Q34,56 34,50 L34,22 Q34,16 32,14 Z" fill="#BFE3F5" opacity={0.92} />
          {/* Water inside */}
          <Path d="M12,30 L32,30 L32,50 Q32,54 28,54 L16,54 Q12,54 12,50 Z" fill="#5BB8E8" opacity={0.85} />
          {/* Shine */}
          <Rect x={14} y={18} width={4} height={26} rx={2} fill="#FFFFFF" opacity={0.45} />
        </Svg>
      </Animated.View>

      {/* Droplets — fall straight down from the bottle mouth toward Pippin */}
      <Animated.View style={dropStyle(drop1, 2)}>
        <Svg width={10} height={13} viewBox="0 0 10 13">
          <Path d="M5,0 Q9,7 9,9 Q9,13 5,13 Q1,13 1,9 Q1,7 5,0" fill="#5BB8E8" opacity={0.9} />
        </Svg>
      </Animated.View>
      <Animated.View style={dropStyle(drop2, 12)}>
        <Svg width={8} height={11} viewBox="0 0 10 13">
          <Path d="M5,0 Q9,7 9,9 Q9,13 5,13 Q1,13 1,9 Q1,7 5,0" fill="#7CCBF0" opacity={0.85} />
        </Svg>
      </Animated.View>
      <Animated.View style={dropStyle(drop3, 22)}>
        <Svg width={9} height={12} viewBox="0 0 10 13">
          <Path d="M5,0 Q9,7 9,9 Q9,13 5,13 Q1,13 1,9 Q1,7 5,0" fill="#5BB8E8" opacity={0.8} />
        </Svg>
      </Animated.View>
    </View>
  );
}
