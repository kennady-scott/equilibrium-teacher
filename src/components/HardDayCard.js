import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const NEXT_STEPS = [
  { id: 'outside', emoji: '🌿', label: 'Step outside' },
  { id: 'water',   emoji: '💧', label: 'Drink some water' },
  { id: 'music',   emoji: '🎵', label: 'One song, eyes closed' },
  { id: 'friend',  emoji: '🤝', label: 'Text someone you trust' },
];

const CYCLE_MS = 4000; // 4s in, 4s out

export default function HardDayCard({ onFeelBetter }) {
  const breathe     = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState('in'); // 'in' | 'hold-in' | 'out' | 'hold-out'
  const [chosen, setChosen] = useState(null);

  useEffect(() => {
    // Animate the circle
    Animated.loop(Animated.sequence([
      Animated.timing(breathe, { toValue: 1, duration: CYCLE_MS, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(breathe, { toValue: 0, duration: CYCLE_MS, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.delay(800),
    ])).start();

    // Drive the text label
    const phases = ['in', 'hold-in', 'out', 'hold-out'];
    const durations = [CYCLE_MS, 800, CYCLE_MS, 800];
    let idx = 0;
    let timerId;
    function advance() {
      setPhase(phases[idx % phases.length]);
      timerId = setTimeout(advance, durations[idx % durations.length]);
      idx++;
    }
    advance();
    return () => clearTimeout(timerId);
  }, []);

  const circleScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
  const circleOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.85] });

  const phaseLabel = {
    'in':       'breathe in...',
    'hold-in':  'hold...',
    'out':      'breathe out...',
    'hold-out': 'and again...',
  }[phase];

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.title}>💙 Take a breath.</Text>
      <Text style={styles.subtitle}>You don't have to fix everything today. Pippin is right here.</Text>

      {/* Breathing circle */}
      <View style={styles.breatheWrap}>
        <Animated.View style={[styles.breatheOuter, { transform: [{ scale: circleScale }], opacity: circleOpacity }]} />
        <View style={styles.breatheInner} />
        <Text style={styles.breatheLabel}>{phaseLabel}</Text>
      </View>

      {/* Name it */}
      <Text style={styles.sectionLabel}>What made today hard? (just for you)</Text>
      <TextInput
        style={styles.nameInput}
        placeholder="No need to share this with anyone…"
        placeholderTextColor="#B0B8C4"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* One tiny next step */}
      <Text style={styles.sectionLabel}>One small thing you could do right now:</Text>
      <View style={styles.stepsGrid}>
        {NEXT_STEPS.map(step => (
          <TouchableOpacity
            key={step.id}
            style={[styles.stepChip, chosen === step.id && styles.stepChipChosen]}
            onPress={() => setChosen(step.id)}
          >
            <Text style={styles.stepEmoji}>{step.emoji}</Text>
            <Text style={[styles.stepLabel, chosen === step.id && styles.stepLabelChosen]}>{step.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {chosen && (
        <Text style={styles.chosenMsg}>That's enough. You've got this. 💙</Text>
      )}

      {/* Exit */}
      <TouchableOpacity style={styles.betterBtn} onPress={onFeelBetter}>
        <Text style={styles.betterBtnText}>I'm feeling a little better</Text>
      </TouchableOpacity>
    </View>
  );
}

const BLUE = '#5B8DB8';
const BLUE_LIGHT = '#EBF2FA';

const styles = StyleSheet.create({
  card: {
    backgroundColor: BLUE_LIGHT,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title:    { fontSize: 20, fontWeight: '800', color: '#2A3E55', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#5A7494', lineHeight: 19, marginBottom: 20 },

  breatheWrap: { alignItems: 'center', justifyContent: 'center', height: 130, marginBottom: 20 },
  breatheOuter: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: BLUE,
  },
  breatheInner: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#fff',
    opacity: 0.6,
  },
  breatheLabel: { fontSize: 15, fontWeight: '600', color: '#2A3E55', marginTop: 90 },

  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#5A7494', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },

  nameInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#2A3E55',
    marginBottom: 20,
    minHeight: 72,
    lineHeight: 20,
  },

  stepsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  stepChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff',
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  stepChipChosen: { borderColor: BLUE, backgroundColor: '#D6E8F7' },
  stepEmoji: { fontSize: 16 },
  stepLabel: { fontSize: 13, fontWeight: '600', color: '#5A7494' },
  stepLabelChosen: { color: '#2A3E55' },

  chosenMsg: { fontSize: 14, fontWeight: '700', color: BLUE, textAlign: 'center', marginVertical: 10 },

  betterBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: BLUE,
  },
  betterBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
