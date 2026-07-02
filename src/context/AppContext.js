import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const AppContext = createContext();

const MAX_HYDRATION = 8;
const WATER_STREAK_GOAL = 5;
const MAX_FEATURED = 6;

// Total completed days needed to reach each level (index = level - 1)
const LEVEL_THRESHOLDS = [0, 10, 25, 50, 75];
const LEVEL_NAMES = ['New Buddy', 'Settled Buddy', 'Confident Buddy', 'Companion Guide', 'Legacy Buddy'];

// featured = shown as a tile on the home screen (up to 6)
const defaultGoals = [
  { id: 'breathing', title: 'Deep breathing or meditation', emoji: '🌿', petStat: 'calm',   petEmoji: '😊', target: 3, checkins: [], featured: true },
  { id: 'walk',      title: 'Walk break during the day',    emoji: '🚶', petStat: 'energy', petEmoji: '⚡', target: 3, checkins: [], featured: true },
  { id: 'lunch',     title: 'Healthy lunch',                emoji: '🥗', petStat: 'hunger', petEmoji: '🍎', target: 5, checkins: [], featured: true },
];

const defaultPet = { name: 'Pippin', type: 'hamster' };

export function AppProvider({ children, userId }) {
  const [pet, setPet]                       = useState(defaultPet);
  const [hydration, setHydration]           = useState(0);
  const [goals, setGoals]                   = useState(defaultGoals);
  const [journalEntries, setJournalEntries] = useState([]);
  const [streak, setStreak]                 = useState({ count: 0, days: {}, totalDays: 0 });
  const [mood, setMood]                     = useState(null);
  const [energy, setEnergy]                 = useState(null);
  const [hardDay, setHardDayState]          = useState(null); // stores date string when active
  const [dayMode, setDayModeState]          = useState(null); // { date, mode } — resets each day
  const [pippinBoost, setPippinBoostState]  = useState(null); // 'celebrating' | null — transient
  const [loaded, setLoaded]                 = useState(false);

  const saveTimerRef = useRef(null);
  const pendingSavesRef = useRef({});

  useEffect(() => { loadData(); }, [userId]);

  async function loadData() {
    try {
      if (userId) {
        // Load from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          if (data.hydration != null)    setHydration(data.hydration);
          if (data.goals) {
            const migrated = data.goals.map((g, i) =>
              g.featured === undefined ? { ...g, featured: i < 6 } : g
            );
            setGoals(migrated);
          }
          if (data.journal_entries)     setJournalEntries(data.journal_entries);
          if (data.streak)              setStreak(data.streak);
          if (data.mood != null)        setMood(data.mood);
          if (data.energy != null)      setEnergy(data.energy);
          if (data.hard_day && data.hard_day === new Date().toDateString()) setHardDayState(data.hard_day);
          if (data.day_mode && data.day_mode.date === new Date().toDateString()) setDayModeState(data.day_mode);
        }
      } else {
        // Fallback: load from AsyncStorage (offline / unauthenticated)
        const keys = ['hydration', 'goals', 'journalEntries', 'streak', 'mood', 'energy', 'hardDay', 'dayMode'];
        const results = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(results.map(([k, v]) => [k, v ? JSON.parse(v) : null]));
        if (data.hydration != null) setHydration(data.hydration);
        if (data.goals) {
          const migrated = data.goals.map((g, i) =>
            g.featured === undefined ? { ...g, featured: i < 6 } : g
          );
          setGoals(migrated);
        }
        if (data.journalEntries)  setJournalEntries(data.journalEntries);
        if (data.streak)          setStreak(data.streak);
        if (data.mood != null)    setMood(data.mood);
        if (data.energy != null)  setEnergy(data.energy);
        if (data.hardDay && data.hardDay === new Date().toDateString()) setHardDayState(data.hardDay);
        if (data.dayMode && data.dayMode.date === new Date().toDateString()) setDayModeState(data.dayMode);
      }
    } catch (e) {}
    setLoaded(true);
  }

  // Debounced save — batches rapid changes into one upsert every 800ms
  function save(key, value) {
    if (userId) {
      const columnMap = { hydration: 'hydration', goals: 'goals', journalEntries: 'journal_entries', streak: 'streak', mood: 'mood', energy: 'energy', hardDay: 'hard_day', dayMode: 'day_mode' };
      const col = columnMap[key];
      if (!col) return;
      pendingSavesRef.current[col] = value;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const pending = pendingSavesRef.current;
        pendingSavesRef.current = {};
        supabase.from('profiles').upsert({ id: userId, ...pending, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      }, 800);
    } else {
      AsyncStorage.setItem(key, JSON.stringify(value));
    }
  }

  // A day counts toward the streak once the teacher has hit their water
  // goal, checked in at least one goal, and written a journal entry.
  function syncStreakForToday(nextHydration, nextGoals, nextJournalEntries) {
    const now = new Date();
    const dow = now.getDay(); // 0=Sun, 6=Sat
    if (dow === 0 || dow === 6) return; // weekends don't count
    if (currentDayMode === 'sick' || currentDayMode === 'sub') return; // sick/sub days don't count

    const today = now.toDateString();
    if (streak.days[today]) return; // already counted

    const waterDone   = nextHydration >= WATER_STREAK_GOAL;
    const goalDone     = nextGoals.some(g => g.checkins.includes(today));
    const journalDone = nextJournalEntries.some(e => new Date(e.date).toDateString() === today);

    if (waterDone && goalDone && journalDone) {
      const updatedStreak = {
        count: streak.count + 1,
        days: { ...streak.days, [today]: true },
        totalDays: (streak.totalDays || 0) + 1,
      };
      setStreak(updatedStreak);
      save('streak', updatedStreak);
    }
  }

  function updateHydration(cups) {
    setHydration(cups);
    save('hydration', cups);
    syncStreakForToday(cups, goals, journalEntries);
  }

  function checkInGoal(goalId) {
    const today = new Date().toDateString();
    const updated = goals.map(g => {
      if (g.id !== goalId || g.checkins.includes(today)) return g;
      return { ...g, checkins: [...g.checkins, today] };
    });
    setGoals(updated);
    save('goals', updated);
    syncStreakForToday(hydration, updated, journalEntries);
  }

  // Add a goal from the preset list or a custom one
  function addGoal(preset, customTitle) {
    const existing = goals.find(g => g.id === preset.id);
    if (existing) return; // already added
    const featuredCount = goals.filter(g => g.featured).length;
    const newGoal = {
      ...preset,
      id: preset.id || Date.now().toString(),
      title: customTitle || preset.title,
      checkins: [],
      featured: featuredCount < MAX_FEATURED,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    save('goals', updated);
  }

  function removeGoal(goalId) {
    const updated = goals.filter(g => g.id !== goalId);
    setGoals(updated);
    save('goals', updated);
  }

  function toggleFeatured(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const featuredCount = goals.filter(g => g.featured).length;
    if (!goal.featured && featuredCount >= MAX_FEATURED) return; // cap at 6
    const updated = goals.map(g => g.id === goalId ? { ...g, featured: !g.featured } : g);
    setGoals(updated);
    save('goals', updated);
  }

  function updateGoalTitle(goalId, newTitle) {
    const updated = goals.map(g => g.id === goalId ? { ...g, title: newTitle } : g);
    setGoals(updated);
    save('goals', updated);
  }

  function addJournalEntry(text) {
    const entry = { id: Date.now().toString(), text, date: new Date().toISOString() };
    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    save('journalEntries', updated);
    syncStreakForToday(hydration, goals, updated);
  }

  function logMood(value) { setMood(value); save('mood', value); }
  function logEnergy(value) { setEnergy(value); save('energy', value); }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const boostTimerRef = useRef(null);
  function triggerPippinCelebration() {
    if (boostTimerRef.current) clearTimeout(boostTimerRef.current);
    setPippinBoostState('celebrating');
    boostTimerRef.current = setTimeout(() => setPippinBoostState(null), 3000);
  }

  function setDayMode(mode) {
    const val = { date: new Date().toDateString(), mode };
    setDayModeState(val);
    save('dayMode', val);
  }
  const currentDayMode = dayMode?.date === new Date().toDateString() ? dayMode.mode : null;

  function markHardDay() {
    const today = new Date().toDateString();
    setHardDayState(today);
    save('hardDay', today);
  }
  function clearHardDay() {
    setHardDayState(null);
    save('hardDay', null);
  }
  const isHardDay = hardDay === new Date().toDateString();

  function getPetStats() {
    const today = new Date().toDateString();
    const thirst = Math.round((hydration / MAX_HYDRATION) * 100);

    const weekCheckins = (goalId) => {
      const g = goals.find(g => g.id === goalId);
      return g ? g.checkins.filter(d => (new Date() - new Date(d)) / 86400000 <= 7).length : 0;
    };

    const walkGoal  = goals.find(g => g.petStat === 'energy');
    const lunchGoal = goals.find(g => g.petStat === 'hunger');
    const calmGoal  = goals.find(g => g.petStat === 'calm');

    const energyPct  = walkGoal  ? Math.min(100, Math.round((weekCheckins(walkGoal.id)  / walkGoal.target)  * 100)) : 0;
    const hungerPct  = lunchGoal ? Math.min(100, Math.round((weekCheckins(lunchGoal.id) / lunchGoal.target) * 100)) : 0;
    const calmBase   = calmGoal  ? Math.min(100, Math.round((weekCheckins(calmGoal.id)  / calmGoal.target)  * 100)) : 0;
    const moodBonus  = mood !== null ? Math.round((mood / 5) * 40) : 0;
    const calmPct    = Math.min(100, calmBase + moodBonus);
    const overall    = Math.round((thirst + energyPct + hungerPct + calmPct) / 4);

    return { thirst, energy: energyPct, hunger: hungerPct, calm: calmPct, overall };
  }

  function getDayProgress() {
    const today = new Date().toDateString();
    const moodDone    = mood !== null;
    const waterDone   = hydration >= WATER_STREAK_GOAL;
    const goalDone    = goals.some(g => g.checkins.includes(today));
    const journalDone = journalEntries.some(e => new Date(e.date).toDateString() === today);
    const actions = [moodDone, waterDone, goalDone, journalDone];
    const count   = actions.filter(Boolean).length;
    // Map to visual state name
    const state = count === 0 ? 'sleeping'
                : count === 1 ? 'tired'
                : count === 2 ? 'awake'
                : count === 3 ? 'happy'
                : 'celebrating';
    return { count, actions, state, moodDone, waterDone, goalDone, journalDone };
  }

  function getPetTrait() {
    const { level } = getPetLevel();
    if (level < 2) return null;

    const calmCount   = goals.filter(g => g.petStat === 'calm').reduce((s, g) => s + g.checkins.length, 0);
    const energyCount = goals.filter(g => g.petStat === 'energy').reduce((s, g) => s + g.checkins.length, 0);
    const hungerCount = goals.filter(g => g.petStat === 'hunger').reduce((s, g) => s + g.checkins.length, 0);
    const journalCount = journalEntries.length;

    const scores = { thoughtful: journalCount * 1.5, energetic: energyCount, nourished: hungerCount, calm: calmCount };
    const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

    return {
      thoughtful: { name: 'Thoughtful',  emoji: '📖', subtitle: 'Your thoughtful hamster',  description: 'Pippin has grown wise from your reflections.' },
      energetic:  { name: 'Energetic',   emoji: '⚡', subtitle: 'Your energetic hamster',   description: 'Pippin is full of energy thanks to your movement goals.' },
      nourished:  { name: 'Nourished',   emoji: '🌱', subtitle: 'Your nourished hamster',   description: 'Pippin is glowing from your healthy habits.' },
      calm:       { name: 'Calm',        emoji: '🍃', subtitle: 'Your calm little hamster', description: 'Pippin radiates peace from your mindfulness practice.' },
    }[dominant];
  }

  function getPetLevel() {
    const total = streak.totalDays || 0;
    let level = 1;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (total >= LEVEL_THRESHOLDS[i]) { level = i + 1; break; }
    }
    const nextThreshold = level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] : null;
    return {
      level,
      name: LEVEL_NAMES[level - 1],
      totalDays: total,
      nextThreshold,
      progress: nextThreshold
        ? (total - LEVEL_THRESHOLDS[level - 1]) / (nextThreshold - LEVEL_THRESHOLDS[level - 1])
        : 1,
    };
  }

  function getPetMood() {
    const { overall } = getPetStats();
    if (overall >= 60) return 'happy';
    if (overall >= 20) return 'okay';
    return 'sad';
  }

  function getWeekDays() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    return days.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { label, done: !!streak.days[d.toDateString()] };
    });
  }

  if (!loaded) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F0EA' }}>
      <Text style={{ fontSize: 40 }}>🐹</Text>
      <Text style={{ fontSize: 16, color: '#7A9C7A', marginTop: 12 }}>Loading Pippin...</Text>
    </View>
  );

  return (
    <AppContext.Provider value={{
      pet, hydration, goals, journalEntries, streak, mood, energy,
      updateHydration, checkInGoal, addGoal, removeGoal, toggleFeatured,
      updateGoalTitle, addJournalEntry, logMood, logEnergy,
      getPetStats, getPetMood, getPetLevel, getPetTrait, getDayProgress, getWeekDays,
      isHardDay, markHardDay, clearHardDay,
      currentDayMode, setDayMode,
      pippinBoost, triggerPippinCelebration,
      MAX_FEATURED, signOut,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
