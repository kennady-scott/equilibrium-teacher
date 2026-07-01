import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MODES = [
  {
    id: 'normal',
    emoji: '☀️',
    label: 'Normal Day',
    desc: 'Regular support & goals',
    color: '#A8C5A0',
    bg: '#F0F7EE',
  },
  {
    id: 'sub',
    emoji: '📋',
    label: 'Sub Day',
    desc: 'Survive & reset',
    color: '#7EB5D6',
    bg: '#EBF4FA',
  },
  {
    id: 'conferences',
    emoji: '🗣️',
    label: 'Conferences',
    desc: 'Marathon mode on',
    color: '#C4A0C8',
    bg: '#F5EEF8',
  },
  {
    id: 'testing',
    emoji: '📝',
    label: 'Testing Period',
    desc: 'Keep calm & carry on',
    color: '#E8A87C',
    bg: '#FDF3EC',
  },
];

export default function DayModeModal({ visible, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🐹</Text>
          <Text style={styles.title}>What kind of day is it?</Text>
          <Text style={styles.sub}>Pippin wants to offer the right support.</Text>

          <View style={styles.grid}>
            {MODES.map(mode => (
              <TouchableOpacity
                key={mode.id}
                style={[styles.tile, { backgroundColor: mode.bg, borderColor: mode.color }]}
                onPress={() => onSelect(mode.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.tileEmoji}>{mode.emoji}</Text>
                <Text style={[styles.tileLabel, { color: mode.color }]}>{mode.label}</Text>
                <Text style={styles.tileDesc}>{mode.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sick Day — full-width bar */}
          <TouchableOpacity
            style={styles.sickBar}
            onPress={() => onSelect('sick')}
            activeOpacity={0.75}
          >
            <Text style={styles.sickEmoji}>🤒</Text>
            <View>
              <Text style={styles.sickLabel}>Sick Day</Text>
              <Text style={styles.sickDesc}>Rest up — streak is safe, school can wait</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  emoji: { fontSize: 40, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '800', color: '#2A3E2A', marginBottom: 6, textAlign: 'center' },
  sub: { fontSize: 14, color: '#7A9C7A', textAlign: 'center', marginBottom: 24, lineHeight: 20 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, width: '100%' },
  tile: {
    width: '47%',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  tileEmoji: { fontSize: 28, marginBottom: 4 },
  tileLabel: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  tileDesc: { fontSize: 12, color: '#888', textAlign: 'center', lineHeight: 16 },

  sickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    marginTop: 12,
    backgroundColor: '#FDF0F0',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D4696B',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sickEmoji: { fontSize: 24 },
  sickLabel: { fontSize: 14, fontWeight: '800', color: '#D4696B' },
  sickDesc: { fontSize: 12, color: '#8B4040', marginTop: 1 },
});
