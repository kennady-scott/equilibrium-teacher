import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { pickRefill, durationLabel } from '../utils/refillStrategies';

const TIME_OPTIONS = [
  { seconds: 30,  label: '30 seconds', sub: 'A quick drop' },
  { seconds: 60,  label: '1 minute',   sub: 'A real pause' },
  { seconds: 120, label: '2 minutes',  sub: 'A proper reset' },
  { seconds: 180, label: '3 minutes',  sub: 'A full refill' },
];

export default function QuickRefillScreen() {
  const [strategy, setStrategy] = useState(null);
  const [chosen, setChosen] = useState(null); // selected seconds

  function choose(seconds) {
    setChosen(seconds);
    setStrategy(pickRefill(seconds));
  }
  function another() {
    setStrategy(pickRefill(chosen, strategy?.title));
  }
  function reset() {
    setStrategy(null);
    setChosen(null);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Quick Reset</Text>
        <Text style={styles.subtitle}>You can't pour from an empty cup. Take a sip.</Text>

        {!strategy ? (
          <>
            <View style={styles.pippinBubble}>
              <Text style={styles.pippinEmoji}>🐹</Text>
              <Text style={styles.pippinText}>How much time do you have right now?</Text>
            </View>
            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map(opt => (
                <TouchableOpacity key={opt.seconds} style={styles.timeCard} onPress={() => choose(opt.seconds)} activeOpacity={0.85}>
                  <Text style={styles.timeLabel}>{opt.label}</Text>
                  <Text style={styles.timeSub}>{opt.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.footNote}>Even 30 seconds counts. Really.</Text>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{durationLabel(strategy.seconds)}</Text>
              </View>
              <Text style={styles.cardEmoji}>🌿</Text>
              <Text style={styles.cardTitle}>{strategy.title}</Text>
              <Text style={styles.cardBody}>{strategy.body}</Text>
            </View>

            <TouchableOpacity style={styles.anotherBtn} onPress={another} activeOpacity={0.85}>
              <Text style={styles.anotherText}>Give me another</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneBtn} onPress={reset} activeOpacity={0.7}>
              <Text style={styles.doneText}>Change my time</Text>
            </TouchableOpacity>

            <Text style={styles.footNote}>That was a real thing you did for yourself. 💚</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EA' },
  content: { padding: 22, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: '#2A3E2A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#8A9E8A', marginBottom: 22 },

  pippinBubble: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  pippinEmoji: { fontSize: 34 },
  pippinText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#2A3E2A', lineHeight: 22 },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 18 },
  timeCard: { width: '47%', backgroundColor: '#fff', borderRadius: 16, paddingVertical: 22, paddingHorizontal: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  timeLabel: { fontSize: 18, fontWeight: '800', color: '#7B9E87' },
  timeSub: { fontSize: 12, color: '#9A9A9A', marginTop: 3 },

  card: { backgroundColor: '#fff', borderRadius: 22, padding: 26, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 14, elevation: 3 },
  badge: { backgroundColor: '#E8F0E4', borderRadius: 12, paddingVertical: 5, paddingHorizontal: 12, marginBottom: 14 },
  badgeText: { fontSize: 12, fontWeight: '800', color: '#5B8A6B', letterSpacing: 1 },
  cardEmoji: { fontSize: 40, marginBottom: 10 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#2A3E2A', textAlign: 'center', marginBottom: 12 },
  cardBody: { fontSize: 16, color: '#4A6741', textAlign: 'center', lineHeight: 25 },

  anotherBtn: { backgroundColor: '#7B9E87', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 12, shadowColor: '#7B9E87', shadowOpacity: 0.3, shadowRadius: 10, elevation: 3 },
  anotherText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  doneBtn: { alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  doneText: { fontSize: 14, fontWeight: '700', color: '#8A9E8A' },

  footNote: { fontSize: 13, fontStyle: 'italic', color: '#A8B0A8', textAlign: 'center', marginTop: 6 },
});
