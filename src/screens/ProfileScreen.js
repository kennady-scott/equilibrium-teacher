import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

const BADGES = [
  { id: 'first_checkin', emoji: '🌱', label: 'First Step', desc: 'Completed your first goal check-in', condition: (s) => s.totalCheckins >= 1 },
  { id: 'streak_3', emoji: '🔥', label: '3-Day Streak', desc: 'Showed up 3 days in a row', condition: (s) => s.streakCount >= 3 },
  { id: 'streak_7', emoji: '⚡', label: 'Week Warrior', desc: 'Kept a 7-day streak', condition: (s) => s.streakCount >= 7 },
  { id: 'hydration_5', emoji: '💧', label: 'Hydration Hero', desc: 'Hit 5+ cups in a day', condition: (s) => s.hydration >= 5 },
  { id: 'hydration_8', emoji: '🌊', label: 'Ocean Mode', desc: 'Hit all 8 cups in a day', condition: (s) => s.hydration >= 8 },
  { id: 'journal_3', emoji: '📖', label: 'Reflector', desc: 'Wrote 3 journal entries', condition: (s) => s.journalCount >= 3 },
  { id: 'journal_10', emoji: '🌸', label: 'Deep Thinker', desc: 'Wrote 10 journal entries', condition: (s) => s.journalCount >= 10 },
  { id: 'goals_5', emoji: '🏅', label: 'Goal Getter', desc: 'Completed 5 goal check-ins', condition: (s) => s.totalCheckins >= 5 },
  { id: 'goals_20', emoji: '🏆', label: 'Champion', desc: 'Completed 20 goal check-ins', condition: (s) => s.totalCheckins >= 20 },
  { id: 'mood_log', emoji: '🎭', label: 'Self-Aware', desc: 'Logged your mood', condition: (s) => s.moodLogged },
];

export default function ProfileScreen() {
  const { name, updateName, streak, hydration, journalEntries, goals, mood, signOut, deleteAccount } = useApp();

  const [nameDraft, setNameDraft] = useState(name);
  const [savedFlash, setSavedFlash] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleSaveName() {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === name) return;
    updateName(trimmed);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This permanently deletes your account and all your data — journal entries, goals, and streak history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you sure?',
              'This is permanent and cannot be reversed.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, delete my account',
                  style: 'destructive',
                  onPress: async () => {
                    setDeleting(true);
                    try {
                      await deleteAccount();
                    } catch (e) {
                      Alert.alert('Something went wrong', e.message || 'Please try again.');
                      setDeleting(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }

  const totalCheckins = goals.reduce((sum, g) => sum + g.checkins.length, 0);
  const stats = {
    streakCount: streak.count,
    hydration,
    journalCount: journalEntries.length,
    totalCheckins,
    moodLogged: mood !== null,
  };

  const earned = BADGES.filter(b => b.condition(stats));
  const locked = BADGES.filter(b => !b.condition(stats));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Your Journey</Text>
      <Text style={styles.subtitle}>Every small step counts.</Text>

      {/* Name */}
      <Text style={styles.sectionLabel}>Your Name</Text>
      <View style={styles.nameCard}>
        <TextInput
          style={styles.nameInput}
          value={nameDraft}
          onChangeText={setNameDraft}
          onBlur={handleSaveName}
          onSubmitEditing={handleSaveName}
          placeholder="Enter your name"
          placeholderTextColor="#B8B8B8"
          returnKeyType="done"
          maxLength={40}
        />
        <TouchableOpacity
          style={[styles.nameSaveBtn, (!nameDraft.trim() || nameDraft.trim() === name) && { opacity: 0.4 }]}
          onPress={handleSaveName}
          disabled={!nameDraft.trim() || nameDraft.trim() === name}
        >
          <Text style={styles.nameSaveText}>{savedFlash ? 'Saved ✓' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{streak.count}</Text>
          <Text style={styles.summaryLabel}>day streak</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{journalEntries.length}</Text>
          <Text style={styles.summaryLabel}>journal entries</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{totalCheckins}</Text>
          <Text style={styles.summaryLabel}>goal check-ins</Text>
        </View>
      </View>

      {/* Earned badges */}
      <Text style={styles.sectionLabel}>Earned Badges</Text>
      {earned.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyText}>Start your journey to earn badges!</Text>
        </View>
      ) : (
        <View style={styles.badgeGrid}>
          {earned.map(b => (
            <View key={b.id} style={styles.badge}>
              <Text style={styles.badgeEmoji}>{b.emoji}</Text>
              <Text style={styles.badgeLabel}>{b.label}</Text>
              <Text style={styles.badgeDesc}>{b.desc}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Locked badges */}
      <Text style={styles.sectionLabel}>Still to Earn</Text>
      <View style={styles.badgeGrid}>
        {locked.map(b => (
          <View key={b.id} style={[styles.badge, styles.badgeLocked]}>
            <Text style={[styles.badgeEmoji, { opacity: 0.25 }]}>{b.emoji}</Text>
            <Text style={[styles.badgeLabel, { color: '#BBBBBB' }]}>{b.label}</Text>
            <Text style={styles.badgeDesc}>{b.desc}</Text>
          </View>
        ))}
      </View>

      {/* Affirmation */}
      <View style={styles.affirmCard}>
        <Text style={styles.affirmText}>"You can't pour from an empty cup — and every day you show up here, you're filling yours."</Text>
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={handleDeleteAccount}
        activeOpacity={0.7}
        disabled={deleting}
      >
        <Text style={styles.deleteText}>{deleting ? 'Deleting…' : 'Delete account'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F3EE' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#2D2D2D' },
  subtitle: { fontSize: 15, color: '#9A9A9A', marginBottom: 20 },
  nameCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  nameInput: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#2D2D2D', borderWidth: 1.5, borderColor: '#E8E0D8' },
  nameSaveBtn: { backgroundColor: '#7B9E87', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center' },
  nameSaveText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  summaryCard: { backgroundColor: '#7B9E87', borderRadius: 20, padding: 20, flexDirection: 'row', marginBottom: 24 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 28, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2, textAlign: 'center' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 4 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#9A9A9A', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 24 },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyText: { color: '#9A9A9A', textAlign: 'center', fontSize: 14 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  badge: { width: '47%', backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  badgeLocked: { backgroundColor: '#F7F7F7' },
  badgeEmoji: { fontSize: 32, marginBottom: 6 },
  badgeLabel: { fontSize: 13, fontWeight: '700', color: '#2D2D2D', textAlign: 'center' },
  badgeDesc: { fontSize: 11, color: '#9A9A9A', textAlign: 'center', marginTop: 4, lineHeight: 15 },
  affirmCard: { backgroundColor: '#EEF6F2', borderRadius: 16, padding: 20, marginBottom: 20 },
  affirmText: { fontSize: 15, fontStyle: 'italic', color: '#4A7A5E', lineHeight: 24, textAlign: 'center' },
  signOutBtn: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#E8E0D8', marginBottom: 16 },
  signOutText: { fontSize: 15, fontWeight: '700', color: '#C0392B' },
  deleteBtn: { alignItems: 'center', paddingVertical: 12 },
  deleteText: { fontSize: 13, fontWeight: '600', color: '#B0392B', textDecorationLine: 'underline' },
});
