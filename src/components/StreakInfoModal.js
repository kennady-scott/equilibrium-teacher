import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// Explains how a day is "completed" and how streaks + levels work. Shown
// automatically the first time a teacher opens the app, and reopenable
// anytime by tapping the streak card.
const RULES = [
  { emoji: '💧', title: 'Drink 5+ cups of water', desc: 'Tap the water dots as you go through the day.' },
  { emoji: '🎯', title: 'Check in on one goal', desc: 'Any single goal tile counts — one small win.' },
  { emoji: '📖', title: 'Write a journal entry', desc: 'Even a sentence about your day counts.' },
];

export default function StreakInfoModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.flame}>🔥</Text>
            <Text style={styles.title}>How your streak works</Text>
            <Text style={styles.sub}>
              A day counts toward your streak once you've done all three of these on a school day:
            </Text>

            <View style={styles.rules}>
              {RULES.map((r, i) => (
                <View key={i} style={styles.rule}>
                  <Text style={styles.ruleEmoji}>{r.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ruleTitle}>{r.title}</Text>
                    <Text style={styles.ruleDesc}>{r.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteLine}>🗓️  Weekends never count against you.</Text>
              <Text style={styles.noteLine}>🤒  Sick Days and Sub Days keep your streak safe.</Text>
              <Text style={styles.noteLine}>🌱  Every completed day also grows Pippin's level over time.</Text>
            </View>

            <Text style={styles.footer}>
              No pressure to be perfect — one good day at a time is exactly the point.
            </Text>

            <TouchableOpacity style={styles.btn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.btnText}>Got it 🐹</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 26, width: '100%', maxHeight: '86%', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
  flame: { fontSize: 44, textAlign: 'center', marginBottom: 6 },
  title: { fontSize: 22, fontWeight: '800', color: '#2A3E2A', textAlign: 'center', marginBottom: 8 },
  sub: { fontSize: 14, color: '#7A9C7A', textAlign: 'center', lineHeight: 21, marginBottom: 18 },
  rules: { gap: 12, marginBottom: 18 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F5F0EA', borderRadius: 14, padding: 13 },
  ruleEmoji: { fontSize: 26, width: 34, textAlign: 'center' },
  ruleTitle: { fontSize: 15, fontWeight: '700', color: '#2A3E2A' },
  ruleDesc: { fontSize: 12.5, color: '#8A9E8A', marginTop: 2, lineHeight: 17 },
  noteCard: { backgroundColor: '#EAF4EC', borderRadius: 14, padding: 14, gap: 8, marginBottom: 16 },
  noteLine: { fontSize: 13, color: '#4A6741', fontWeight: '600', lineHeight: 18 },
  footer: { fontSize: 13, fontStyle: 'italic', color: '#9A9A9A', textAlign: 'center', lineHeight: 19, marginBottom: 18 },
  btn: { backgroundColor: '#7B9E87', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
