import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORANGE       = '#D4854A';
const ORANGE_LIGHT = '#FDF3EC';
const ORANGE_MID   = '#FADEC8';
const ORANGE_DARK  = '#8A4820';

const AFFIRMATIONS = [
  { id: 'a1',  emoji: '🌱', text: "Every confused face that became an 'aha!' moment — that was you." },
  { id: 'a2',  emoji: '🧠', text: "You didn't just teach content. You taught them how to think." },
  { id: 'a3',  emoji: '💪', text: "Your students walk into that test room carrying everything you gave them." },
  { id: 'a4',  emoji: '🕯️', text: "On their hardest days this year, you showed up anyway. They noticed." },
  { id: 'a5',  emoji: '🎯', text: "You found ways to reach the kids who were hardest to reach. That matters more than any score." },
  { id: 'a6',  emoji: '🌊', text: "You stayed steady when things were chaotic. That steadiness is in them now." },
  { id: 'a7',  emoji: '🗝️', text: "You unlocked something in at least one kid this year that nobody else could. Probably more." },
  { id: 'a8',  emoji: '📚', text: "A test can measure what they know — it can't measure what you gave them." },
  { id: 'a9',  emoji: '🤝', text: "You advocated for your students, even when it was hard. They felt that." },
  { id: 'a10', emoji: '⭐', text: "Growth doesn't always show up on a test — but it happened. You saw it every day." },
  { id: 'a11', emoji: '🌻', text: "The kid who struggled all year but never gave up? You're the reason they kept going." },
  { id: 'a12', emoji: '🏆', text: "You prepared them not just for this test — but for how to handle hard things." },
];

export default function TestingCard() {
  const [index, setIndex]     = useState(0);
  const [pinned, setPinned]   = useState(new Set());
  const [filter, setFilter]   = useState('all'); // 'all' | 'pinned'

  useEffect(() => {
    AsyncStorage.getItem('pinnedAffirmations').then(val => {
      if (val) setPinned(new Set(JSON.parse(val)));
    });
  }, []);

  function togglePin(id) {
    setPinned(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      AsyncStorage.setItem('pinnedAffirmations', JSON.stringify([...next]));
      return next;
    });
  }

  const list = filter === 'pinned'
    ? AFFIRMATIONS.filter(a => pinned.has(a.id))
    : AFFIRMATIONS;

  const card = list[Math.min(index, list.length - 1)];

  // Reset index when switching filter so we don't go out of bounds
  function switchFilter(f) {
    setFilter(f);
    setIndex(0);
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>📝 Testing Days</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🔥 Streak safe</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Your students are ready — because of you.</Text>

      {/* Filter toggle */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
          onPress={() => switchFilter('all')}
          activeOpacity={0.75}
        >
          <Text style={[styles.filterLabel, filter === 'all' && styles.filterLabelActive]}>
            All ({AFFIRMATIONS.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'pinned' && styles.filterBtnActive]}
          onPress={() => switchFilter('pinned')}
          activeOpacity={0.75}
        >
          <Text style={[styles.filterLabel, filter === 'pinned' && styles.filterLabelActive]}>
            📌 Pinned ({pinned.size})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Affirmation card */}
      {list.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📌</Text>
          <Text style={styles.emptyText}>Pin affirmations that resonate with you — they'll live here.</Text>
        </View>
      ) : (
        <>
          <View style={styles.affirmCard}>
            <TouchableOpacity
              style={[styles.pinBtn, pinned.has(card.id) && styles.pinBtnActive]}
              onPress={() => togglePin(card.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.pinBtnText}>{pinned.has(card.id) ? '📌 Pinned' : '📌 Pin this'}</Text>
            </TouchableOpacity>
            <Text style={styles.affirmEmoji}>{card.emoji}</Text>
            <Text style={styles.affirmText}>{card.text}</Text>
          </View>

          <View style={styles.nav}>
            <TouchableOpacity
              style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
              onPress={() => index > 0 && setIndex(index - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.navBtnText}>← Prev</Text>
            </TouchableOpacity>
            <Text style={styles.counter}>{index + 1} / {list.length}</Text>
            <TouchableOpacity
              style={[styles.navBtn, index === list.length - 1 && styles.navBtnDisabled]}
              onPress={() => index < list.length - 1 && setIndex(index + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.navBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.tip}>
        <Text style={styles.tipText}>
          💡 Read one before walking in today. You earned every word.
        </Text>
      </View>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '800', color: ORANGE_DARK },
  badge: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1.5, borderColor: ORANGE },
  badgeText: { fontSize: 12, fontWeight: '700', color: ORANGE },
  subtitle: { fontSize: 13, color: '#7A4520', lineHeight: 20, marginBottom: 14 },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  filterBtn: { flex: 1, paddingVertical: 7, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1.5, borderColor: 'transparent', alignItems: 'center' },
  filterBtnActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  filterLabel: { fontSize: 13, fontWeight: '700', color: '#C4844A' },
  filterLabelActive: { color: '#fff' },

  affirmCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: ORANGE_MID,
    marginBottom: 12,
    minHeight: 180,
    justifyContent: 'center',
    position: 'relative',
  },
  pinBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: ORANGE_MID,
  },
  pinBtnActive: { backgroundColor: ORANGE },
  pinBtnText: { fontSize: 11, fontWeight: '700', color: ORANGE_DARK },
  affirmEmoji: { fontSize: 44, marginBottom: 14 },
  affirmText: { fontSize: 17, color: ORANGE_DARK, fontWeight: '700', textAlign: 'center', lineHeight: 26 },

  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: ORANGE, borderRadius: 10 },
  navBtnDisabled: { backgroundColor: '#E8C9AA' },
  navBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  counter: { fontSize: 13, fontWeight: '700', color: ORANGE_DARK },

  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#A07050', textAlign: 'center', lineHeight: 22 },

  tip: { backgroundColor: ORANGE_MID, borderRadius: 12, padding: 12 },
  tipText: { fontSize: 12, color: ORANGE_DARK, lineHeight: 18 },
});
