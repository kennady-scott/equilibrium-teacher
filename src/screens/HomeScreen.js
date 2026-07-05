import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Easing, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import StreakInfoModal from '../components/StreakInfoModal';
import PippinCharacter from '../components/PippinCharacter';
import PippinHabitat from '../components/PippinHabitat';
import HardDayCard from '../components/HardDayCard';
import SubDayCard from '../components/SubDayCard';
import SickDayCard from '../components/SickDayCard';
import ConferencesCard from '../components/ConferencesCard';
import TestingCard from '../components/TestingCard';
import DayModeModal, { DAY_MODE_META } from '../components/DayModeModal';
import WaterBottle from '../components/WaterBottle';
import PippinAction, { sceneForGoal } from '../components/PippinAction';

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
    name, hydration, goals, streak, mood,
    updateHydration, checkInGoal, logMood,
    getPetStats, getPetMood, getPetLevel, getPetTrait, getDayProgress, getWeekDays,
    isHardDay, markHardDay, clearHardDay,
    currentDayMode, setDayMode,
    pippinBoost, triggerPippinCelebration,
  } = useApp();

  const [showDayMode, setShowDayMode] = useState(false);
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);

  // Auto-prompt once per app open: ask for the day type if none is set yet,
  // otherwise nudge for mood. Runs a single time so re-selecting a day type
  // later (via the header pill) never re-triggers or races with this.
  const autoPromptedRef = useRef(false);
  useEffect(() => {
    if (autoPromptedRef.current) return;
    autoPromptedRef.current = true;
    if (!currentDayMode) {
      setShowDayMode(true);
    } else if (mood === null) {
      setShowMoodPrompt(true);
    }
  }, [currentDayMode, mood]);
  const [habitatWidth, setHabitatWidth] = useState(340);
  const [bottleKey, setBottleKey] = useState(null);
  const [goalAction, setGoalAction] = useState(null); // { scene, key }
  const [showStreakInfo, setShowStreakInfo] = useState(false);

  // Show the streak explainer once, the first time the app is opened
  useEffect(() => {
    AsyncStorage.getItem('streakInfoSeen').then(seen => {
      if (!seen) setShowStreakInfo(true);
    });
  }, []);
  function dismissStreakInfo() {
    setShowStreakInfo(false);
    AsyncStorage.setItem('streakInfoSeen', '1');
  }

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
    // Pippin acts out the goal that was just checked in
    setGoalAction({ scene: sceneForGoal(goalId), key: Date.now() });
  }

  function handleHydration(i) {
    // Tap a cup to set that level; tap the current top cup to un-fill it.
    const next = hydration === i ? i - 1 : i;
    updateHydration(next);
    triggerWiggle();
    // Adding water = give Pippin a drink from the bottle
    if (next > hydration) setBottleKey(Date.now());
  }

  function handleDayModeSelect(mode) {
    setDayMode(mode);
    setShowDayMode(false);
    // Prompt for mood only on the first pick of the day, not on later changes
    if (mood === null) setShowMoodPrompt(true);
  }

  function handleMoodSelect(i) {
    logMood(i);
    triggerWiggle();
    setShowMoodPrompt(false);
  }

  const PIPPIN_REMINDERS = [
    "You matter just as much as your students 💚",
    "Taking care of me means taking care of yourself 🐹",
    "You showed up today. That already counts 🌟",
    "Your feelings are valid, even on the hard days 💙",
    "Rest is not a reward — it's part of the job 🌿",
    "What would you tell a struggling friend? Tell yourself that 💛",
    "You can't pour from an empty cup. Let's fill yours 🐹",
    "Small kindnesses to yourself add up more than you know 🌱",
    "Being gentle with yourself is a skill worth practicing 💜",
    "Your wellbeing is the foundation everything else rests on 💚",
    "I noticed how hard you're working. Don't forget to breathe 🌬️",
    "You are doing better than you think 🐹",
    "One good moment today is enough. You don't need a perfect day 🌤️",
    "The kids remember how you made them feel. You're doing that well 💛",
    "Checking in on yourself counts as self-care 🐹",
  ];
  // Rotate daily so the message changes each day but stays stable within a day
  const dayIndex = new Date().getDate() + new Date().getMonth() * 31;
  const dailyReminder = PIPPIN_REMINDERS[dayIndex % PIPPIN_REMINDERS.length];

  // Daily motivational quote for educators (rotates each day, offset from the
  // Pippin reminder so the two lines never coincide)
  const DAILY_QUOTES = [
    "Teaching is the one profession that creates all other professions.",
    "The influence of a good teacher can never be erased.",
    "You have not failed until you quit trying — and you're still here.",
    "Small steps today, big impact tomorrow.",
    "To the world you may be one teacher, but to one student you may be the world.",
    "Rest so you can rise. You can't teach on empty.",
    "Every child you reach is a ripple that outlives the lesson.",
    "You are planting seeds you may never see bloom — plant them anyway.",
    "Progress, not perfection. That goes for you too.",
    "A teacher takes a hand, opens a mind, and touches a heart.",
    "The days are long, but the years are meaningful.",
    "Your patience today becomes someone's confidence tomorrow.",
    "You don't have to be perfect to be exactly what a student needs.",
    "Great teachers aren't made in easy years. Look how far you've come.",
    "Take care of the teacher — the classroom depends on her.",
    "The best thing you can bring to your students is a rested, cared-for you.",
    "Some of the most important work you do won't show up on any test.",
    "Be the reason a student believes in good people.",
    "You are doing sacred, ordinary, extraordinary work.",
    "Celebrate the small wins — they add up to a whole year.",
  ];
  const dailyQuote = DAILY_QUOTES[(dayIndex + 7) % DAILY_QUOTES.length];

  const petStateMap = {
    happy: { bg: ['#C8E6C9', '#E8F5E9'], msgColor: '#388E3C' },
    okay:  { bg: ['#FFF9C4', '#FFFDE7'], msgColor: '#F9A825' },
    sad:   { bg: ['#FFCDD2', '#FFEBEE'], msgColor: '#C62828' },
  };
  const baseState = petStateMap[petMood];
  const { bg } = baseState;
  const msg      = isHardDay                         ? "I'm right here with you 💙"
                 : currentDayMode === 'sub'           ? 'Rest up. I\'ll hold things down 🐹'
                 : currentDayMode === 'sick'          ? 'Feel better soon. I\'ve got you 🐹'
                 : currentDayMode === 'conferences'   ? 'Deep breath. You\'re doing great 💜'
                 : currentDayMode === 'testing'       ? 'Your students are ready 🍫'
                 : dailyReminder;
  const msgColor = isHardDay                         ? '#5B8DB8'
                 : currentDayMode === 'sub'           ? '#5B9E8F'
                 : currentDayMode === 'sick'          ? '#D4696B'
                 : currentDayMode === 'conferences'   ? '#9B7AB8'
                 : currentDayMode === 'testing'       ? '#D4854A'
                 : baseState.msgColor;

  const featuredGoals = goals.filter(g => g.featured).slice(0, 6).map(g => {
    const weekDone = g.checkins.filter(d => (new Date() - new Date(d)) / 86400000 <= 7).length;
    return { ...g, done: g.checkins.includes(today), weekDone };
  });
  const doneCount     = featuredGoals.filter(g => g.done).length;
  const totalGoals    = featuredGoals.length;
  const threePerRow   = totalGoals >= 5;

  const overallLabel = isHardDay ? 'Here to help you' : petStats.overall >= 60 ? 'Well cared for' : petStats.overall >= 20 ? 'Needs attention' : 'Needs your help';
  // Care heart color tracks how cared-for Pippin is (blue on a hard day)
  const careHeart = isHardDay ? '💙' : petStats.overall >= 60 ? '💚' : petStats.overall >= 20 ? '💛' : '❤️';

  // X eyes only when the teacher has been completely inactive for 3+ days and stats are near zero
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
  const hasRecentActivity = goals.some(g => g.checkins.some(d => new Date(d) > threeDaysAgo));
  const isCritical = petStats.overall < 5 && !hasRecentActivity && streak.count > 0;
  const moodLabel    = mood !== null ? MOODS[mood]?.label : '—';
  const energyPct    = `${petStats.energy}%`;
  const petLevel     = getPetLevel();
  const petTrait     = getPetTrait();
  const dayProgress  = getDayProgress();

  // Pippin wakes up the first time the teacher does anything each day, and
  // then stays awake — he never dozes back off after finishing an action.
  const engagedToday = mood !== null || hydration > 0 || dayProgress.goalDone || dayProgress.journalDone;

  // Behavior mirrors the teacher's mood + energy. Once he's up for the day
  // the lively states (run/play) still fire, but he never drops to sleeping.
  // mood indices: 0 Great, 1 Okay, 2 Tired, 3 Stressed, 4 Overwhelmed, 5 Grateful.
  const goodMood = mood === 0 || mood === 5;
  const behaviorAllowed = !pippinBoost && !isHardDay && currentDayMode !== 'sub' && currentDayMode !== 'sick';
  const pippinBehavior = !behaviorAllowed ? null
    : goodMood && petStats.energy >= 60      ? 'run'
    : mood !== null && petStats.energy >= 30  ? 'play'
    : null;

  // The idle pose. Before the teacher engages, Pippin naps (sleeping). Once
  // awake, floor him at "awake" so a low mood or reset energy can't put him
  // back to sleep between actions.
  const idleState = engagedToday && (dayProgress.state === 'sleeping' || dayProgress.state === 'tired')
    ? 'awake'
    : dayProgress.state;
  const levelColor   = ['#A8C5A0', '#7EB5A0', '#5B9E8F', '#3D8070', '#2A5E52'][petLevel.level - 1];
  const daysToNext   = petLevel.nextThreshold ? petLevel.nextThreshold - petLevel.totalDays : 0;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingLine}>{greeting}</Text>
            <Text style={styles.nameLine}>{name ? `${name} ☀️` : '☀️'}</Text>
            <Text style={styles.tagline}>Let's protect your peace today.</Text>
          </View>
          <View style={styles.headerRight}>
            {currentDayMode && DAY_MODE_META[currentDayMode] && (
              <TouchableOpacity
                style={[styles.dayModePill, { backgroundColor: DAY_MODE_META[currentDayMode].bg }]}
                onPress={() => setShowDayMode(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.dayModePillEmoji}>{DAY_MODE_META[currentDayMode].emoji}</Text>
                <Text style={[styles.dayModePillText, { color: DAY_MODE_META[currentDayMode].color }]} numberOfLines={1}>
                  {DAY_MODE_META[currentDayMode].label}
                </Text>
                <Text style={styles.dayModePillArrow}>↻</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.avatar} onPress={() => setShowMoodPrompt(true)}>
              <Text style={{ fontSize: mood !== null ? 22 : 20 }}>{mood !== null ? MOODS[mood].emoji : '🌿'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pippin Card */}
        <View style={styles.petCard}>
          {/* Habitat — fully covers everything above the water tracker */}
          <View style={styles.habitatSection} onLayout={e => setHabitatWidth(e.nativeEvent.layout.width)}>
            <View style={styles.habitatBg}>
              <PippinHabitat width={habitatWidth} height={300} mood={petMood} level={petLevel.level} />
            </View>
            {/* Name — upper-left overlay */}
            <View style={styles.petNameOverlay}>
              <Text style={styles.pippinName}>Pippin</Text>
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
                {goalAction ? (
                  <PippinAction key={goalAction.key} scene={goalAction.scene} size={170} onDone={() => setGoalAction(null)} />
                ) : (
                  <PippinCharacter mood={petMood} behavior={pippinBehavior} dayState={pippinBoost ?? (isHardDay ? 'awake' : (currentDayMode === 'sub' || currentDayMode === 'sick') ? 'happy' : idleState)} size={170} critical={isCritical && !isHardDay && currentDayMode !== 'sub'} level={petLevel.level} />
                )}
              </Animated.View>
            </View>
            {/* Water bottle — appears when the teacher logs a cup */}
            {bottleKey && (
              <View pointerEvents="none" style={styles.bottleWrap}>
                <WaterBottle key={bottleKey} onDone={() => setBottleKey(null)} />
              </View>
            )}
            {/* Message bubble — lower-left inside habitat */}
            <View style={styles.msgBubbleWrap}>
              <View style={styles.msgBubble}>
                <Text style={styles.msgHeart}>💚</Text>
                <Text style={[styles.msgText, { color: msgColor }]}>{msg}</Text>
              </View>
              <View style={styles.msgTail} />
            </View>
            {/* Chocolate bubble — testing days only */}
            {currentDayMode === 'testing' && (
              <TouchableOpacity
                style={styles.chocBubble}
                onPress={triggerPippinCelebration}
                activeOpacity={0.7}
              >
                <View style={styles.chocSpeech}>
                  <Text style={styles.chocSpeechText}>I heard we're testing today. I brought some chocolates for us to share 🍫</Text>
                </View>
                <View style={styles.chocSpeechTail} />
                <Text style={styles.chocIcon}>🍫</Text>
              </TouchableOpacity>
            )}
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
              <Text style={styles.statIcon}>{careHeart}</Text>
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

        {/* Sick Day card */}
        {currentDayMode === 'sick' && <SickDayCard />}

        {/* Conferences card */}
        {currentDayMode === 'conferences' && <ConferencesCard />}

        {/* Testing Period card */}
        {currentDayMode === 'testing' && <TestingCard />}

        {/* Goals — full width tiles */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {currentDayMode === 'sub' || currentDayMode === 'sick'
            ? '💛 Goals — no pressure today'
            : currentDayMode === 'conferences'
            ? '💜 Goals — survive the marathon'
            : currentDayMode === 'testing'
            ? '🧡 Testing Days — you\'ve already won'
            : '📋 Today\'s Goals'}
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
            <Text style={styles.quoteText}>{dailyQuote}</Text>
            <Text style={styles.quoteHeart}>💙</Text>
          </View>

          <TouchableOpacity style={styles.streakCard} activeOpacity={0.85} onPress={() => setShowStreakInfo(true)}>
            <View style={styles.streakTop}>
              <View style={styles.streakFlame}>
                <Text style={{ fontSize: 24 }}>🔥</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.streakCount}>{streak.count} day streak</Text>
                <Text style={styles.streakSub}>Keep it up!</Text>
              </View>
              <Text style={styles.streakInfoDot}>ⓘ</Text>
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
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ===== STREAK EXPLAINER (first launch + reopenable) ===== */}
      <StreakInfoModal visible={showStreakInfo} onClose={dismissStreakInfo} />

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
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bottleWrap: { position: 'absolute', top: 66, left: '50%', marginLeft: 52, zIndex: 5 },
  dayModePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, maxWidth: 150 },
  dayModePillEmoji: { fontSize: 14 },
  dayModePillText: { fontSize: 12, fontWeight: '700', flexShrink: 1 },
  dayModePillArrow: { fontSize: 14, fontWeight: '800', color: '#8A9E8A', marginLeft: 1 },

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
  streakInfoDot: { fontSize: 14, color: '#B8C4B8', fontWeight: '700' },
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

  // Chocolate bubble (testing days)
  chocBubble: { position: 'absolute', right: 12, top: 60, alignItems: 'flex-end' },
  chocSpeech: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: 10, maxWidth: 160, borderWidth: 1.5, borderColor: '#FADEC8' },
  chocSpeechText: { fontSize: 12, color: '#8A4820', fontWeight: '600', lineHeight: 17 },
  chocSpeechTail: { width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 0, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: 'rgba(255,255,255,0.95)', alignSelf: 'flex-end', marginRight: 28, marginTop: -1 },
  chocIcon: { fontSize: 36, marginTop: 4, alignSelf: 'flex-end', marginRight: 8 },
});
