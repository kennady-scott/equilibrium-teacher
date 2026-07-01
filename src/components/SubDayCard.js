import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OUT_CHECKLIST = [
  { id: 'plans',   emoji: '📋', label: 'Sub plans are ready' },
  { id: 'dnd',     emoji: '📵', label: 'Phone on Do Not Disturb' },
  { id: 'breath',  emoji: '🧘', label: 'Take one slow breath' },
  { id: 'water',   emoji: '💧', label: 'Drink some water' },
  { id: 'rest',    emoji: '🛌', label: 'Rest is on the agenda' },
  { id: 'kind',    emoji: '💙', label: 'Be kind to yourself today' },
];

const RETURN_CHECKLIST = [
  { id: 'notes',   emoji: '🗒️', label: 'Glance at the sub notes' },
  { id: 'space',   emoji: '🌿', label: 'Reset your space, your way' },
  { id: 'breath2', emoji: '☀️', label: 'One deep breath before going in' },
  { id: 'grace',   emoji: '💛', label: 'Give yourself some grace' },
  { id: 'back',    emoji: '🎉', label: 'You made it back' },
];

const TEAL = '#5B9E8F';
const TEAL_LIGHT = '#EAF4F2';

export default function SubDayCard() {
  const [tab, setTab] = useState('out'); // 'out' | 'return'
  const [checked, setChecked] = useState({});

  const list = tab === 'out' ? OUT_CHECKLIST : RETURN_CHECKLIST;

  function toggle(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const doneCount = list.filter(i => checked[i.id]).length;
  const allDone = doneCount === list.length;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>📋 Sub Day</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>🔥 Streak safe</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Sub days don't affect your streak — we hope you're off recharging. Either way, get some rest. You've earned it.
      </Text>

      {/* Tab switcher */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'out' && styles.tabActive]}
          onPress={() => { setTab('out'); setChecked({}); }}
        >
          <Text style={[styles.tabText, tab === 'out' && styles.tabTextActive]}>I'm out today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'return' && styles.tabActive]}
          onPress={() => { setTab('return'); setChecked({}); }}
        >
          <Text style={[styles.tabText, tab === 'return' && styles.tabTextActive]}>Coming back</Text>
        </TouchableOpacity>
      </View>

      {/* Checklist */}
      <View style={styles.checklist}>
        {list.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.checkRow, checked[item.id] && styles.checkRowDone]}
            onPress={() => toggle(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, checked[item.id] && styles.checkboxDone]}>
              {checked[item.id] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkEmoji}>{item.emoji}</Text>
            <Text style={[styles.checkLabel, checked[item.id] && styles.checkLabelDone]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Completion message */}
      {allDone && (
        <View style={styles.doneMsg}>
          <Text style={styles.doneMsgText}>
            {tab === 'out'
              ? "Everything's handled. Now go rest. 💚"
              : "Welcome back. Pippin missed you. 🐹"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: TEAL_LIGHT,
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
  title: { fontSize: 20, fontWeight: '800', color: '#1E3A35' },
  streakBadge: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: TEAL,
  },
  streakBadgeText: { fontSize: 12, fontWeight: '700', color: TEAL },

  subtitle: { fontSize: 13, color: '#3A6B62', lineHeight: 20, marginBottom: 18 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#7AADA4' },
  tabTextActive: { color: TEAL, fontWeight: '800' },

  checklist: { gap: 8 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  checkRowDone: { borderColor: TEAL, backgroundColor: '#D4EDE9' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B0CEC9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: TEAL, borderColor: TEAL },
  checkmark: { fontSize: 12, color: '#fff', fontWeight: '800' },
  checkEmoji: { fontSize: 16 },
  checkLabel: { fontSize: 14, color: '#3A6B62', fontWeight: '500', flex: 1 },
  checkLabelDone: { color: '#1E3A35', fontWeight: '700' },

  doneMsg: {
    marginTop: 16,
    backgroundColor: TEAL,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  doneMsgText: { fontSize: 15, fontWeight: '700', color: '#fff', textAlign: 'center' },
});
