import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CHECKLIST = [
  { id: 'rest',    emoji: '🛌', label: 'Rest — actually rest' },
  { id: 'fluids',  emoji: '💧', label: 'Drink lots of fluids' },
  { id: 'food',    emoji: '🍜', label: 'Eat something warm' },
  { id: 'meds',    emoji: '💊', label: 'Take your medicine' },
  { id: 'nophone', emoji: '📵', label: 'No school emails today' },
  { id: 'kind',    emoji: '🤧', label: 'Be gentle with yourself' },
];

const RED = '#D4696B';
const RED_LIGHT = '#FDF0F0';

export default function SickDayCard() {
  const [checked, setChecked] = useState({});

  function toggle(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const doneCount = CHECKLIST.filter(i => checked[i.id]).length;
  const allDone = doneCount === CHECKLIST.length;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🤒 Sick Day</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>🔥 Streak safe</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Sick days never affect your streak. Don't think about school — your only job today is to get better.
      </Text>

      <View style={styles.checklist}>
        {CHECKLIST.map(item => (
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

      {allDone && (
        <View style={styles.doneMsg}>
          <Text style={styles.doneMsgText}>That's all you need to do. Feel better soon. 🐹</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: RED_LIGHT,
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
  title: { fontSize: 20, fontWeight: '800', color: '#5A1A1B' },
  streakBadge: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: RED,
  },
  streakBadgeText: { fontSize: 12, fontWeight: '700', color: RED },
  subtitle: { fontSize: 13, color: '#8B4040', lineHeight: 20, marginBottom: 18 },

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
  checkRowDone: { borderColor: RED, backgroundColor: '#FAD9D9' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E8B4B4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: RED, borderColor: RED },
  checkmark: { fontSize: 12, color: '#fff', fontWeight: '800' },
  checkEmoji: { fontSize: 16 },
  checkLabel: { fontSize: 14, color: '#8B4040', fontWeight: '500', flex: 1 },
  checkLabelDone: { color: '#5A1A1B', fontWeight: '700' },

  doneMsg: {
    marginTop: 16,
    backgroundColor: RED,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  doneMsgText: { fontSize: 15, fontWeight: '700', color: '#fff', textAlign: 'center' },
});
