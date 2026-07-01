import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

const ORANGE       = '#D4854A';
const ORANGE_LIGHT = '#FDF3EC';
const ORANGE_MID   = '#FADEC8';
const ORANGE_DARK  = '#8A4820';

const PACKS = [
  { id: 'affirm',    emoji: '💛', label: 'You Did That' },
  { id: 'chocolate', emoji: '🍫', label: 'Feed Pippin' },
];

const AFFIRMATIONS = [
  {
    emoji: '🌱',
    text: "Every confused face that became an 'aha!' moment — that was you.",
  },
  {
    emoji: '🧠',
    text: "You didn't just teach content. You taught them how to think.",
  },
  {
    emoji: '💪',
    text: "Your students walk into that test room carrying everything you gave them.",
  },
  {
    emoji: '🕯️',
    text: "On their hardest days this year, you showed up anyway. They noticed.",
  },
  {
    emoji: '🎯',
    text: "You found ways to reach the kids who were hardest to reach. That matters more than any score.",
  },
  {
    emoji: '🌊',
    text: "You stayed steady when things were chaotic. That steadiness is in them now.",
  },
  {
    emoji: '🗝️',
    text: "You unlocked something in at least one kid this year that nobody else could. Probably more.",
  },
  {
    emoji: '📚',
    text: "A test can measure what they know — it can't measure what you gave them.",
  },
  {
    emoji: '🤝',
    text: "You advocated for your students, even when it was hard. They felt that.",
  },
  {
    emoji: '⭐',
    text: "Growth doesn't always show up on a test — but it happened. You saw it every day.",
  },
  {
    emoji: '🌻',
    text: "The kid who struggled all year but never gave up? You're the reason they kept going.",
  },
  {
    emoji: '🏆',
    text: "You prepared them not just for this test — but for how to handle hard things.",
  },
];

const CHOCOLATE_REACTIONS = [
  "Pippin is delighted. 🐹",
  "Pippin says thank you in hamster. 🐹",
  "Pippin is doing a happy wiggle. 🐹",
  "Pippin wants more. Obviously. 🐹",
  "Pippin is in a chocolate coma. Worth it. 🐹",
  "Pippin has ascended. 🍫🐹✨",
];

export default function TestingCard() {
  const [activePack, setActivePack]       = useState('affirm');
  const [affirmIndex, setAffirmIndex]     = useState(0);
  const [chocolates, setChocolates]       = useState(0);
  const [lastReaction, setLastReaction]   = useState(null);

  // Pippin bounce animation for chocolate
  const pippinScale  = useRef(new Animated.Value(1)).current;
  const chocolatePop = useRef(new Animated.Value(0)).current;

  function feedChocolate() {
    const next = chocolates + 1;
    setChocolates(next);
    const reactionIdx = Math.min(Math.floor((next - 1) / 2), CHOCOLATE_REACTIONS.length - 1);
    setLastReaction(CHOCOLATE_REACTIONS[reactionIdx]);

    // Pippin bounce
    Animated.sequence([
      Animated.timing(pippinScale, { toValue: 1.3, duration: 120, useNativeDriver: true, easing: Easing.out(Easing.back(2)) }),
      Animated.timing(pippinScale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(pippinScale, { toValue: 1.1, duration: 80, useNativeDriver: true }),
      Animated.timing(pippinScale, { toValue: 1.0, duration: 80, useNativeDriver: true }),
    ]).start();

    // Chocolate pop
    chocolatePop.setValue(0);
    Animated.timing(chocolatePop, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.exp) }).start();
  }

  const currentAffirm = AFFIRMATIONS[affirmIndex];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>📝 Testing Period</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🔥 Streak safe</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Your students are ready — because of you.
      </Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {PACKS.map(p => (
          <TouchableOpacity
            key={p.id}
            style={[styles.tab, activePack === p.id && styles.tabActive]}
            onPress={() => setActivePack(p.id)}
            activeOpacity={0.75}
          >
            <Text style={styles.tabEmoji}>{p.emoji}</Text>
            <Text style={[styles.tabLabel, activePack === p.id && styles.tabLabelActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Pack 1: Affirmations ── */}
      {activePack === 'affirm' && (
        <View>
          <View style={styles.affirmCard}>
            <Text style={styles.affirmEmoji}>{currentAffirm.emoji}</Text>
            <Text style={styles.affirmText}>{currentAffirm.text}</Text>
          </View>

          <View style={styles.affirmNav}>
            <TouchableOpacity
              style={[styles.navBtn, affirmIndex === 0 && styles.navBtnDisabled]}
              onPress={() => affirmIndex > 0 && setAffirmIndex(affirmIndex - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.navBtnText}>← Prev</Text>
            </TouchableOpacity>
            <Text style={styles.cardCounter}>{affirmIndex + 1} / {AFFIRMATIONS.length}</Text>
            <TouchableOpacity
              style={[styles.navBtn, affirmIndex === AFFIRMATIONS.length - 1 && styles.navBtnDisabled]}
              onPress={() => affirmIndex < AFFIRMATIONS.length - 1 && setAffirmIndex(affirmIndex + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.navBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 Read one of these before walking into a classroom today. You earned every word.
            </Text>
          </View>
        </View>
      )}

      {/* ── Pack 2: Feed Pippin ── */}
      {activePack === 'chocolate' && (
        <View style={styles.chocSection}>
          <Text style={styles.chocIntro}>
            Pippin heard it's testing week. He brought chocolates — for you, obviously. But also he wants some.
          </Text>

          {/* Pippin */}
          <View style={styles.pippinStage}>
            <Animated.Text style={[styles.pippinEmoji, { transform: [{ scale: pippinScale }] }]}>
              🐹
            </Animated.Text>
            {chocolates === 0 && (
              <Text style={styles.pippinSpeech}>Feed me a chocolate? 🍫</Text>
            )}
            {lastReaction && chocolates > 0 && (
              <Text style={styles.pippinSpeech}>{lastReaction}</Text>
            )}
          </View>

          {/* Chocolate counter */}
          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Chocolates fed to Pippin</Text>
            <View style={styles.counterBadge}>
              <Text style={styles.counterNum}>{chocolates} 🍫</Text>
            </View>
          </View>

          {/* Chocolate buttons — 5 pieces */}
          <View style={styles.chocRow}>
            {['🍫','🍫','🍫','🍫','🍫'].map((c, i) => (
              <TouchableOpacity
                key={i}
                style={styles.chocBtn}
                onPress={feedChocolate}
                activeOpacity={0.6}
              >
                <Text style={styles.chocEmoji}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {chocolates >= 10 && (
            <View style={styles.maxChocMsg}>
              <Text style={styles.maxChocText}>
                Pippin is vibrating. You've been very generous. Now go breathe. 💛
              </Text>
            </View>
          )}

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 You've done the work all year. Testing week is just the moment your students get to show it.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ORANGE_LIGHT,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '800', color: ORANGE_DARK },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: ORANGE,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: ORANGE },
  subtitle: { fontSize: 13, color: '#7A4520', lineHeight: 20, marginBottom: 16 },

  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  tabEmoji: { fontSize: 14 },
  tabLabel: { fontSize: 12, fontWeight: '700', color: '#C4844A' },
  tabLabelActive: { color: '#fff' },

  // Affirmations
  affirmCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: ORANGE_MID,
    marginBottom: 14,
    minHeight: 160,
    justifyContent: 'center',
  },
  affirmEmoji: { fontSize: 44, marginBottom: 16 },
  affirmText: {
    fontSize: 17,
    color: ORANGE_DARK,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
  affirmNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: ORANGE,
    borderRadius: 10,
  },
  navBtnDisabled: { backgroundColor: '#E8C9AA' },
  navBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  cardCounter: { fontSize: 13, fontWeight: '700', color: ORANGE_DARK },

  tipBox: {
    marginTop: 4,
    backgroundColor: ORANGE_MID,
    borderRadius: 12,
    padding: 12,
  },
  tipText: { fontSize: 12, color: ORANGE_DARK, lineHeight: 18 },

  // Chocolate
  chocSection: {},
  chocIntro: {
    fontSize: 13,
    color: '#7A4520',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  pippinStage: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pippinEmoji: { fontSize: 72, marginBottom: 8 },
  pippinSpeech: {
    fontSize: 14,
    fontWeight: '700',
    color: ORANGE_DARK,
    textAlign: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: ORANGE_MID,
    overflow: 'hidden',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  counterLabel: { fontSize: 13, fontWeight: '600', color: ORANGE_DARK },
  counterBadge: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  counterNum: { fontSize: 14, fontWeight: '800', color: '#fff' },
  chocRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  chocBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: ORANGE_MID,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  chocEmoji: { fontSize: 28 },
  maxChocMsg: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  maxChocText: { fontSize: 14, fontWeight: '700', color: '#fff', textAlign: 'center' },
});
