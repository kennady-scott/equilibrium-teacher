import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import PippinCharacter from '../components/PippinCharacter';
import PippinHabitat from '../components/PippinHabitat';

const STATE_COPY = {
  happy: { label: 'Thriving!',   accent: '#4CAF50', message: 'Pippin is doing amazing! Keep taking care of yourself 💚' },
  okay:  { label: 'Needs love',  accent: '#F9A825', message: 'Pippin could use a little extra care today 💛' },
  sad:   { label: 'Struggling',  accent: '#C62828', message: 'Pippin really needs you right now. Log a goal or some water to help! ❤️' },
};

const LEVEL_COLORS = ['#A8C5A0', '#7EB5A0', '#5B9E8F', '#3D8070', '#2A5E52'];

export default function PetScreen() {
  const { pet, goals, streak, getPetStats, getPetMood, getPetLevel, getPetTrait } = useApp();
  const [habitatWidth, setHabitatWidth] = useState(340);

  const petMood  = getPetMood();
  const stats    = getPetStats();
  const state    = STATE_COPY[petMood];
  const petLevel = getPetLevel();
  const petTrait = getPetTrait();

  const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
  const hasRecentActivity = goals.some(g => g.checkins.some(d => new Date(d) > threeDaysAgo));
  const isCritical = stats.overall < 5 && !hasRecentActivity && streak.count > 0;

  const levelColor = LEVEL_COLORS[petLevel.level - 1];
  const daysToNext = petLevel.nextThreshold
    ? petLevel.nextThreshold - petLevel.totalDays
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Your Pet</Text>
      <Text style={styles.subtitle}>Your wellbeing feeds Pippin's happiness.</Text>

      {/* Pet display */}
      <View style={styles.petCard}>
        <View style={styles.habitatSection} onLayout={e => setHabitatWidth(e.nativeEvent.layout.width)}>
          <View style={styles.habitatBg}>
            <PippinHabitat width={habitatWidth} height={340} mood={petMood} />
          </View>
          <View style={styles.stageWrap}>
            <PippinCharacter mood={petMood} size={210} critical={isCritical} />
          </View>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={[styles.petStatusLabel, { color: state.accent }]}>{state.label}</Text>
          <View style={styles.msgBubble}>
            <Text style={styles.petMessage}>{state.message}</Text>
          </View>
        </View>

        {/* Level badge row */}
        <View style={[styles.levelRow, { backgroundColor: levelColor + '22' }]}>
          <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
            <Text style={styles.levelNum}>Lv {petLevel.level}</Text>
          </View>
          <View style={styles.levelInfo}>
            <View style={styles.levelTitleRow}>
              <Text style={styles.levelName}>{petLevel.name}</Text>
              <Text style={styles.levelDays}>{petLevel.totalDays} days</Text>
            </View>
            <View style={styles.levelTrack}>
              <View style={[styles.levelFill, { width: `${Math.round(petLevel.progress * 100)}%`, backgroundColor: levelColor }]} />
            </View>
            {petLevel.nextThreshold ? (
              <Text style={styles.levelCaption}>{daysToNext} more day{daysToNext !== 1 ? 's' : ''} to Level {petLevel.level + 1}</Text>
            ) : (
              <Text style={styles.levelCaption}>Maximum level reached 🌟</Text>
            )}
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pippin's Stats</Text>
        <StatBar label="💧 Thirst"  value={stats.thirst} color="#4FC3F7" />
        <StatBar label="⚡ Energy"  value={stats.energy} color="#FFC107" />
        <StatBar label="🍎 Hunger"  value={stats.hunger} color="#8BC34A" />
        <StatBar label="😊 Calm"    value={stats.calm}   color="#9C27B0" />
      </View>

      {/* Personality trait — level 2+ */}
      {petTrait && (
        <View style={[styles.traitCard, { borderLeftColor: levelColor }]}>
          <Text style={styles.traitEmoji}>{petTrait.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.traitName}>Pippin is <Text style={{ color: levelColor }}>{petTrait.name}</Text></Text>
            <Text style={styles.traitDesc}>{petTrait.description}</Text>
          </View>
        </View>
      )}

      {/* Connection note */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🔗 How it works</Text>
        <Text style={styles.infoText}>Pippin grows with you over time. Every day you complete your water, a goal, and a journal entry counts toward your total — and Pippin's next level.</Text>
      </View>
    </ScrollView>
  );
}

function StatBar({ label, value, color }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.statPct}>{Math.round(value)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F3EE' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#2D2D2D' },
  subtitle: { fontSize: 15, color: '#9A9A9A', marginBottom: 20 },

  petCard: { borderRadius: 20, marginBottom: 16, overflow: 'hidden', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  habitatSection: { height: 340, alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 18, paddingBottom: 18 },
  habitatBg: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  stageWrap: { width: 230, height: 206, alignItems: 'center', justifyContent: 'flex-end' },
  petName: { fontSize: 24, fontWeight: '800', color: '#2A3E2A', marginTop: 8 },
  petStatusLabel: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  msgBubble: { backgroundColor: 'rgba(255,255,255,0.85)', marginHorizontal: 24, marginTop: 10, borderRadius: 14, padding: 12 },
  petMessage: { fontSize: 13, color: '#444', textAlign: 'center', lineHeight: 19, fontWeight: '600' },

  levelRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  levelBadge: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  levelNum: { fontSize: 11, fontWeight: '800', color: '#fff' },
  levelInfo: { flex: 1 },
  levelTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  levelName: { fontSize: 14, fontWeight: '700', color: '#2D2D2D' },
  levelDays: { fontSize: 11, color: '#9A9A9A', fontWeight: '600' },
  levelTrack: { height: 6, backgroundColor: '#E8E8E8', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  levelFill: { height: '100%', borderRadius: 3 },
  levelCaption: { fontSize: 11, color: '#9A9A9A' },

  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2D2D2D', marginBottom: 14 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statLabel: { width: 100, fontSize: 13, color: '#555' },
  barTrack: { flex: 1, height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  statPct: { width: 36, textAlign: 'right', fontSize: 12, color: '#9A9A9A' },

  traitCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  traitEmoji: { fontSize: 28 },
  traitName: { fontSize: 15, fontWeight: '700', color: '#2D2D2D', marginBottom: 4 },
  traitDesc: { fontSize: 13, color: '#666', lineHeight: 19 },
  infoCard: { backgroundColor: '#EEF6F2', borderRadius: 16, padding: 16 },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#2D2D2D', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#555', lineHeight: 21 },
});
