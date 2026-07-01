import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Easing, Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';
import PippinCharacter from '../components/PippinCharacter';
import PippinHabitat from '../components/PippinHabitat';
import HardDayCard from '../components/HardDayCard';
import SubDayCard from '../components/SubDayCard';
import DayModeModal from '../components/DayModeModal';

const MOODS = [
  { emoji: '😄', label: 'Great',       color: '#FFD166' },
  { emoji: '😌', label: 'Okay',        color: '#A8D8A8' },
  { emoji: '😐', label: 'Tired',       color: '#B8C9D9' },
  { emoji: '😟', label: 'Stressed',    color: '#C9B8E8' },
  { emoji: '😩', label: 'Overwhelmed', color: '#F4A58A' },
  { emoji: '🥰', label: 'Grateful',    color: '#F9C0C0' },
];

export default function HomeScreen() {
  const {
    hydration, goals, streak, mood,
    updateHydration, checkInGoal, logMood,
    getPetStats, getPetMood, getPetLevel, getPetTrait, getDayProgress, getWeekDays,
    isHardDay, markHardDay, clearHardDay,
    currentDayMode, setDayMode,
  } = useApp();

  const [showDayMode, setShowDayMode] = useState(false);
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);

  // After AppContext hydrates from AsyncStorage, show the right modal
  useEffect(() => {
    if (!currentDayMode) {
      setShowDayMode(true);
    } else if (mood === null) {
      setShowMoodPrompt(true);
    }
  }, [currentDayMode]);
  const [habitatWidth, setHabitatWidth] = useState(340);

  const petMood  = getPetMood();
  const petStats = getPetStats();
  const weekDays = getWeekDays();
  const today    = new Date().toDateString();

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';

  // Pippin bounce
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: -8, duration: 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bounce, { toValue:  0, duration: 600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: -4, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bounce, { toValue:  0, duration: 400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.delay(1800),
      ])
    ).start();
  }, []);

  // Pippin wiggle on action
  const wiggle = useRef(new Animated.Value(0)).current;
  function triggerWiggle() {
    Animated.sequence([
      Animated.timing(wiggle, { toValue:  10, duration: 80, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue:   8, duration: 80, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue:  -8, duration: 80, useNativeDriver: true }),
      Animated.timing(wiggle, { toValue:   0, duration: 80, useNativeDriver: true }),
    ]).start();
  }

  function handleGoal(goalId) {
    checkInGoal(goalId);
    triggerWiggle();
  }

  function handleHydration() {
    updateHydration(Math.min(8, hydration + 1));
    triggerWiggle();
  }

  function handleDayModeSelect(mode) {
    setDayMode(mode);
    setShowDayMode(false);
    // After picking day mode, show mood prompt
    setShowMoodPrompt(true);
  }

  function handleMoodSelect(i) {
    logMood(i);
    triggerWiggle();
    setShowMoodPrompt(false);
  }

  const petStateMap = {
    happy: { bg: ['#C8E6C9', '#E8F5E9'], msg: 'Your buddy is doing great today!', msgColor: '#388E3C' },
    okay:  { bg: ['#FFF9C4', '#FFFDE7'], msg: "Pippin needs a little love 💛",    msgColor: '#F9A825' },
    sad:   { bg: ['#FFCDD2', '#FFEBEE'], msg: "Pippin needs your help ❤️",        msgColor: '#C62828' },
  };
  const baseState = petStateMap[petMood];
  const { bg } = baseState;
  const msg      = isHardDay           ? "I'm right here with you 💙"
                 : currentDayMode === 'sub' ? 'Rest up. I\'ll hold things down 🐹'
                 : baseState.msg;
  const msgColor = isHardDay           ? '#5B8DB8'
                 : currentDayMode === 'sub' ? '#5B9E8F'
                 : baseState.msgColor;

  const featuredGoals = goals.filter(g => g.featured).slice(0, 6).map(g => {
    const weekDone = g.checkins.filter(d => (new Date() - new Date(d)) / 86400000 <= 7).length;
    return { ...g, done: g.checkins.includes(today), weekDone };
  });
  const doneCount     = featuredGoals.filter(g => g.done).length;
  const totalGoals    = featuredGoals.length;
  const threePerRow   = totalGoals >= 5;

  const overallLabel = isHardDay ? 'Here to help you' : petStats.overall >= 60 ? 'Well cared for' : petStats.overall >= 20 ? 'Needs attention' : 'Needs your help';

  // X eyes only when the teacher has been completely inactive for 3+ days and stats are near zero
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
  const hasRecentActivity = goals.some(g => g.checkins.some(d => new Date(d) > threeDaysAgo));
  const isCritical = petStats.overall < 5 && !hasRecentActivity && streak.count > 0;
  const moodLabel    = mood !== null ? MOODS[mood]?.label : '—';
  const energyPct    = `${petStats.energy}%`;
  const petLevel     = getPetLevel();
  const petTrait     = getPetTrait();
  const dayProgress  = getDayProgress();
  const levelColor   = ['#A8C5A0', '#7EB5A0', '#5B9E8F', '#3D8070', '#2A5E52'][petLevel.level - 1];
  const daysToNext   = petLevel.nextThreshold ? petLevel.nextThreshold - petLevel.totalDays : 0;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingLine}>{greeting}</Text>
            <Text style={styles.nameLine}>Kennady ☀️</Text>
            <Text style={styles.tagline}>Let's protect your peace today.</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => setShowMoodPrompt(true)}>
            <Text style={{ fontSize: mood !== null ? 22 : 20 }}>{mood !== null ? MOODS[mood].emoji : '🌿'}</Text>
          </TouchableOpacity>
        </View>

        {/* Pippin Card */}
        <View style={styles.petCard}>
          {/* Habitat — fully covers everything above the water tracker */}
          <View style={styles.habitatSection} onLayout={e => setHabitatWidth(e.nativeEvent.layout.width)}>
            <View style={styles.habitatBg}>
              <PippinHabitat width={habitatWidth} height={300} mood={petMood} />
            </View>
            {/* Name — upper-left overlay */}
            <View style={styles.petNameOverlay}>
              <Text style={styles.pippinName}>Pippin ✏️</Text>
              <Text style={styles.pippinSubtitle}>
                {petTrait ? petTrait.subtitle : 'Your little hamster'}
              </Text>
              {petTrait && (
                <View style={[styles.traitPill, { backgroundColor: levelColor + 'DD' }]}>
                  <Text style={styles.traitText}>{petTrait.emoji} {petTrait.name}</Text>
                </View>
              )}
            </View>
            <View style={styles.stageWrap}>
              <Animated.View style={{ transform: [{ rotate: wiggle.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] }) }] }}>
                <PippinCharacter mood={petMood} dayState={isHardDay ? 'awake' : currentDayMode === 'sub' ? 'happy' : dayProgress.state} size={170} critical={isCritical && !isHardDay && currentDayMode !== 'sub'} />
              </Animated.View>
            </View>
            {/* Message bubble — lower-left inside habitat */}
            <View style={styles.msgBubbleWrap}>
              <View style={styles.msgBubble}>
                <Text style={styles.msgHeart}>💚</Text>
                <Text style={[styles.msgText, { color: msgColor }]}>{msg}</Text>
              </View>
              <View style={styles.msgTail} />
            </View>
          </View>
          {/* Stats bar — right below the habitat image */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>😊</Text>
              <Text style={styles.statKey}>Mood</Text>
              <Text style={styles.statVal}>{moodLabel}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={styles.statKey}>Energy</Text>
              <Text style={styles.statVal}>{energyPct}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💙</Text>
              <Text style={styles.statKey}>Care</Text>
              <Text style={styles.statVal}>{overallLabel}</Text>
            </View>
          </View>
          {/* Water tracker */}
          <View style={[styles.waterSection, { backgroundColor: bg[1] }]}>
            <View style={styles.hydrationRow}>
              <Text style={styles.hydrationLabel}>💧 Water today</Text>
              <Text style={styles.hydrationCount}>{hydration}/8</Text>
            </View>
            <View style={styles.cupsRow}>
              {[1,2,3,4,5,6,7,8].map(i => (
                <TouchableOpacity key={i} onPress={() => handleHydration(i)} style={[styles.cup, hydration >= i && styles.cupFilled]}>
                  <Text style={{ fontSize: 16 }}>{hydration >= i ? '💧' : '○'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Level progress strip */}
          <View style={[styles.levelStrip, { borderTopColor: levelColor + '33' }]}>
            <View style={[styles.levelBadgeSmall, { backgroundColor: levelColor }]}>
              <Text style={styles.levelBadgeText}>Lv {petLevel.level}</Text>
            </View>
            <View style={styles.levelStripCenter}>
              <Text style={styles.levelStripName}>{petLevel.name}</Text>
              <View style={styles.levelStripTrack}>
                <View style={[styles.levelStripFill, { width: `${Math.round(petLevel.progress * 100)}%`, backgroundColor: levelColor }]} />
              </View>
            </View>
            <Text style={styles.levelStripCaption}>
              {petLevel.nextThreshold ? `${daysToNext}d to Lv ${petLevel.level + 1}` : '🌟 Max'}
            </Text>
          </View>
        </View>

        {/* Hard Day support card */}
        {isHardDay && (
          <HardDayCard onFeelBetter={clearHardDay} />
        )}

        {/* Sub Day card */}
        {currentDayMode === 'sub' && <SubDayCard />}

        {/* Goals — full width tiles */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {currentDayMode === 'sub' ? '💛 Goals — no pressure today' : '📋 Today\'s Goals'}
          </Text>
          <Text style={styles.doneCount}>{doneCount} of {totalGoals} done</Text>
        </View>

        <View style={styles.tilesGrid}>
          {featuredGoals.map(goal => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.tile,
                threePerRow ? styles.tileThird : styles.tileHalf,
                { backgroundColor: goal.done ? '#C8E6C9' : '#fff' },
              ]}
              onPress={() => !goal.done && handleGoal(goal.id)}
              disabled={goal.done}
            >
              <View style={styles.tileTop}>
                <View style={[styles.tileCheck, goal.done && styles.tileCheckDone]}>
                  {goal.done && <Text style={styles.tileCheckMark}>✓</Text>}
                </View>
                <Text style={styles.tilePetHint}>{goal.petEmoji || '✨'}</Text>
              </View>
              <Text style={threePerRow ? styles.tileEmojiSm : styles.tileEmoji}>{goal.emoji}</Text>
              <Text style={[styles.tileTitle, threePerRow && styles.tileTitleSm]} numberOfLines={2}>{goal.title}</Text>
              <Text style={styles.tileWeekly}>{goal.weekDone}/{goal.target}x this week</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quote + Streak row */}
        <View style={styles.bottomRow}>
          <View style={[styles.quoteCard]}>
            <Text style={styles.quoteDecor}>🌿 ☕</Text>
            <Text style={styles.quoteText}>Small steps today, big impact tomorrow.</Text>
            <Text style={styles.quoteHeart}>💙</Text>
          </View>

          <View style={styles.streakCard}>
            <View style={styles.streakTop}>
              <View style={styles.streakFlame}>
                <Text style={{ fontSize: 24 }}>🔥</Text>
              </View>
              <View>
                <Text style={styles.streakCount}>{streak.count} day streak</Text>
                <Text style={styles.streakSub}>Keep it up!</Text>
              </View>
            </View>
            <View style={styles.weekRow}>
              {weekDays.map(d => (
                <View key={d.label} style={styles.dayCol}>
                  <View style={[styles.dayDot, d.done && styles.dayDotDone]}>
                    {d.done && <Text style={styles.dayCheck}>✓</Text>}
                  </View>
                  <Text style={styles.dayLabel}>{d.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ===== DAY MODE MODAL ===== */}
      <DayModeModal visible={showDayMode} onSelect={handleDayModeSelect} />

      {/* ===== MOOD CHECK-IN MODAL ===== */}
      <Modal visible={showMoodPrompt} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.moodModal}>
            <Text style={styles.moodModalEmoji}>🐹</Text>
            <Text style={styles.moodModalTitle}>How are you feeling?</Text>
            <Text style={styles.moodModalSub}>Pippin wants to know. This helps{'\n'}track your wellbeing over time.</Text>
            <View style={styles.moodGrid}>
              {MOODS.map((m, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.moodBtn, mood === i && { backgroundColor: m.color, transform: [{ scale: 1.05 }] }]}
                  onPress={() => handleMoodSelect(i)}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={styles.moodLabel}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.skipBtn} onPress={() => setShowMoodPrompt(false)}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.hardDayBtn} onPress={() => { markHardDay(); setShowMoodPrompt(false); }}>
              <Text style={styles.hardDayBtnText}>💙 Having a hard day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EA' },
  content: { padding: 16, paddingBottom: 32 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greetingLine: { fontSize: 16, color: '#6B7C6B', fontWeight: '500' },
  nameLine: { fontSize: 26, fontWeight: '800', color: '#2A3E2A', lineHeight: 32 },
  tagline: { fontSize: 13, color: '#8A9E8A', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0EDD8', alignItems: 'center', justifyContent: 'center' },

  // Pet card
  petCard: { borderRadius: 20, marginBottom: 16, overflow: 'hidden', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  habitatSection: { height: 300, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  habitatBg: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  petNameOverlay: { position: 'absolute', top: 14, left: 14, zIndex: 10 },
  stageWrap: { width: 200, height: 168, marginTop: 50, alignItems: 'center', justifyContent: 'flex-end' },
  pippinName: { fontSize: 22, fontWeight: '800', color: '#2A3E2A', textShadowColor: 'rgba(255,255,255,0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  pippinSubtitle: { fontSize: 12, color: '#4A6741', fontWeight: '600', textShadowColor: 'rgba(255,255,255,0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  msgBubbleWrap: { alignSelf: 'flex-start', marginLeft: 14, marginTop: 10 },
  msgBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14, gap: 8, maxWidth: 220 },
  msgTail: { width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 4, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: 'rgba(255,255,255,0.92)', marginLeft: 18 },
  waterSection: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  hydrationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 8 },
  hydrationLabel: { fontSize: 13, fontWeight: '700', color: '#2A3E2A' },
  hydrationCount: { fontSize: 13, fontWeight: '700', color: '#4FC3F7' },
  cupsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 4 },
  cup: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  cupFilled: { backgroundColor: 'rgba(79,195,247,0.25)' },
  traitPill: { marginTop: 5, alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  traitText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  levelStrip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 10, borderTopWidth: 1 },
  levelBadgeSmall: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  levelBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  levelStripCenter: { flex: 1 },
  levelStripName: { fontSize: 11, fontWeight: '700', color: '#2A3E2A', marginBottom: 4 },
  levelStripTrack: { height: 5, backgroundColor: '#EBEBEB', borderRadius: 3, overflow: 'hidden' },
  levelStripFill: { height: '100%', borderRadius: 3 },
  levelStripCaption: { fontSize: 11, color: '#9A9A9A', fontWeight: '600' },
  msgHeart: { fontSize: 20 },
  msgText: { fontSize: 13, fontWeight: '600', lineHeight: 18, flex: 1 },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 8 },
  statIcon: { fontSize: 18, marginBottom: 2 },
  statKey: { fontSize: 11, color: '#8A9E8A', fontWeight: '500' },
  statVal: { fontSize: 12, fontWeight: '700', color: '#2A3E2A', marginTop: 2 },

  // Goals section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2A3E2A' },
  doneCount: { fontSize: 12, color: '#7B9E87', fontWeight: '700' },

  // Tiles grid - 2 per row, full width
  tilesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  tile: {
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  tileHalf:  { width: '47.5%' },
  tileThird: { width: '31%', padding: 10 },
  tileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tileCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#CCC', alignItems: 'center', justifyContent: 'center' },
  tileCheckDone: { backgroundColor: '#7B9E87', borderColor: '#7B9E87' },
  tileCheckMark: { color: '#fff', fontSize: 13, fontWeight: '800' },
  tilePetHint: { fontSize: 10, color: '#9A9A9A', fontWeight: '600' },
  tileEmoji:   { fontSize: 28, marginBottom: 6 },
  tileEmojiSm: { fontSize: 22, marginBottom: 4 },
  tileTitle:   { fontSize: 13, fontWeight: '700', color: '#2A3E2A', lineHeight: 17, marginBottom: 4 },
  tileTitleSm: { fontSize: 11 },
  tileWeekly:  { fontSize: 10, color: '#9A9A9A', fontWeight: '600' },
  tileBar: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  tileBarFill: { height: '100%', borderRadius: 2 },

  // Bottom row
  bottomRow: { flexDirection: 'row', gap: 10 },
  quoteCard: { flex: 1, backgroundColor: '#EAF4EC', borderRadius: 16, padding: 14 },
  quoteDecor: { fontSize: 18, marginBottom: 6 },
  quoteText: { fontSize: 13, color: '#4A6741', fontWeight: '600', lineHeight: 18 },
  quoteHeart: { fontSize: 16, marginTop: 8 },
  streakCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  streakTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  streakFlame: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  streakCount: { fontSize: 13, fontWeight: '800', color: '#2A3E2A' },
  streakSub: { fontSize: 10, color: '#9A9A9A' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 3 },
  dayDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  dayDotDone: { backgroundColor: '#7B9E87' },
  dayCheck: { color: '#fff', fontSize: 11, fontWeight: '800' },
  dayLabel: { fontSize: 9, color: '#9A9A9A' },

  // Mood modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  moodModal: { backgroundColor: '#fff', borderRadius: 28, padding: 28, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  moodModalEmoji: { fontSize: 48, marginBottom: 10 },
  moodModalTitle: { fontSize: 22, fontWeight: '800', color: '#2A3E2A', marginBottom: 6 },
  moodModalSub: { fontSize: 14, color: '#8A9E8A', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 20 },
  moodBtn: { width: 90, alignItems: 'center', padding: 12, borderRadius: 14, backgroundColor: '#F5F5F5' },
  moodEmoji: { fontSize: 30, marginBottom: 4 },
  moodLabel: { fontSize: 12, color: '#444', fontWeight: '600' },
  skipBtn: { paddingVertical: 10 },
  skipText: { color: '#AAAAAA', fontSize: 14 },
  hardDayBtn: { marginTop: 4, paddingVertical: 10, paddingHorizontal: 22, borderRadius: 20, backgroundColor: '#EBF2FA', borderWidth: 1.5, borderColor: '#5B8DB8' },
  hardDayBtnText: { fontSize: 14, fontWeight: '700', color: '#5B8DB8' },
});
