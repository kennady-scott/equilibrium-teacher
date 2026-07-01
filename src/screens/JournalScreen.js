import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';

// Prompts organized by month (0 = Jan). Rotate by day-of-month within the month.
const PROMPTS = {
  // August — Reset & Intentions
  7: [
    "What kind of teacher do you want to be this year?",
    "What are you leaving behind from last year?",
    "What are you most excited about walking into this fall?",
    "Describe your ideal classroom community.",
    "What does success look like for you by December?",
    "What's one boundary you want to actually honor this year?",
  ],
  // September — Finding Your Footing
  8: [
    "What's surprisingly hard already, and what might help?",
    "When did you last feel genuinely connected to a student?",
    "What parts of the job are still giving you energy?",
    "What does a 'good enough' day look like right now?",
    "What's one thing you want to protect in your evenings or weekends?",
    "Write about a small moment this week that reminded you why you're here.",
  ],
  // October — First Slump
  9: [
    "What's draining you most right now, and what's one small thing that might help?",
    "Name one thing that's working, even if everything else feels hard.",
    "What would you tell yourself at the start of this school year?",
    "Write about a student moment that made you feel like this job matters.",
    "What needs to change before Thanksgiving?",
    "If a colleague was struggling like you are, what would you tell them?",
  ],
  // November — Gratitude & Endurance
  10: [
    "Name something small that brought you joy in the classroom this week.",
    "What are you proud of making it to Thanksgiving?",
    "Write about a relationship at work that sustains you.",
    "What does rest actually look like for you — not just the absence of work?",
    "Gratitude check: what's something about teaching you wouldn't trade?",
    "What's one thing you need from break to come back feeling okay?",
  ],
  // December — Recharge & Release
  11: [
    "What are you releasing before the new year?",
    "Write about a moment this semester that reminded you why you teach.",
    "What would feel like enough rest this holiday?",
    "What's one thing you want to do differently in January?",
    "Write a letter to your January self — what do you want her/him to remember?",
    "What did this semester cost you, and what did it give you?",
  ],
  // January — Recommit & Renew
  0: [
    "What does a fresh start mean for you right now?",
    "What's one intention you're setting for this semester?",
    "Who needs extra care from you this month — a student, a colleague, yourself?",
    "What did the fall teach you about yourself?",
    "What would you stop doing if you could?",
    "How do you want to feel by June?",
  ],
  // February — Dig Deep
  1: [
    "What's keeping you going right now?",
    "When did you last feel proud of yourself as a teacher?",
    "What relationship in your classroom needs more investment?",
    "What would replenish you most right now?",
    "Name something you're tolerating that you shouldn't be.",
    "Write about a student who has surprised you this year.",
  ],
  // March — Persevere
  2: [
    "What does 'pushing through' feel like in your body right now?",
    "What's your why — why are you still here?",
    "Name something hard you've already survived this year.",
    "What does your classroom feel like right now, honestly?",
    "Who in your life understands what this stretch is like?",
    "What would make spring break feel like a real reset?",
  ],
  // April — Testing Season & Spring
  3: [
    "How are you protecting your energy during testing season?",
    "What will you let go of once testing is over?",
    "Write about a student you're quietly rooting for right now.",
    "What do you need to hear but no one is saying?",
    "How has this year already changed you?",
    "Spring check-in: where are you compared to where you thought you'd be?",
  ],
  // May — The Final Push
  4: [
    "What are you most proud of from this year?",
    "Who do you want to celebrate before the year ends?",
    "What will you miss about this class?",
    "What's the hardest thing you navigated this year?",
    "Write a note — real or imaginary — to a student who changed you.",
    "What does this time of year do to your body and mind?",
  ],
  // June — Reflect & Close
  5: [
    "What did this year teach you about yourself?",
    "Write about who you were in August vs. who you are now.",
    "What moment from this year will you carry with you?",
    "What would you do differently if you could start the year again?",
    "What do you need from summer to show up whole in August?",
    "Write about a student you'll think about long after this year ends.",
  ],
  // July — Restore
  6: [
    "What does real rest feel like when you finally reach it?",
    "What parts of yourself got set aside this year that you want to reclaim?",
    "What are you looking forward to about next year?",
    "Write about something outside of teaching that makes you you.",
    "What does the best version of your life look like right now?",
    "What's one thing you want to remember when August arrives again?",
  ],
};

const DECORATIONS = [
  { at: 1, emoji: '🌱', label: 'First Sprout' },
  { at: 7, emoji: '🌸', label: 'Wildflower' },
  { at: 14, emoji: '🌻', label: 'Sunflower' },
  { at: 21, emoji: '🍃', label: 'Full Bloom' },
  { at: 28, emoji: '🌿', label: 'Garden Grove' },
  { at: 35, emoji: '🎋', label: 'Bamboo Forest' },
  { at: 42, emoji: '🌴', label: 'Tropical Oasis' },
  { at: 56, emoji: '🦋', label: 'Butterfly Garden' },
  { at: 70, emoji: '🌈', label: 'Rainbow Reach' },
  { at: 84, emoji: '✨', label: 'Stardust' },
  { at: 100, emoji: '🏆', label: 'Century Strong' },
];

export default function JournalScreen() {
  const { journalEntries, addJournalEntry } = useApp();
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('write');

  const todayStr = new Date().toDateString();
  const todayEntry = journalEntries.find(e => new Date(e.date).toDateString() === todayStr);
  const totalEntries = journalEntries.length;

  const now = new Date();
  const monthPrompts = PROMPTS[now.getMonth()];
  const prompt = monthPrompts[(now.getDate() - 1) % monthPrompts.length];

  function handleSave() {
    if (!text.trim()) return;
    addJournalEntry(text.trim());
    setText('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const earnedDecorations = DECORATIONS.filter(d => totalEntries >= d.at);
  const nextDecoration = DECORATIONS.find(d => totalEntries < d.at);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Journal</Text>
        <Text style={styles.subtitle}>Reflect a little, grow a lot.</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['write', 'history', 'garden'].map(t => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'write' ? '✏️ Write' : t === 'history' ? '📖 History' : '🌿 Garden'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'write' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
              <Text style={styles.prompt}>"{prompt}"</Text>
            </View>

            {todayEntry ? (
              <View style={styles.card}>
                <Text style={styles.savedBadge}>✅ You journaled today</Text>
                <Text style={styles.savedEntry}>{todayEntry.text}</Text>
              </View>
            ) : (
              <View style={styles.card}>
                <TextInput
                  style={styles.input}
                  placeholder="Write your reflection here…"
                  value={text}
                  onChangeText={setText}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <TouchableOpacity style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]} onPress={handleSave} disabled={!text.trim()}>
                  <Text style={styles.saveBtnText}>{saved ? '✅ Saved!' : 'Save Reflection'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {nextDecoration && (
              <View style={styles.progressCard}>
                <Text style={styles.progressEmoji}>{nextDecoration.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progressLabel}>Next: {nextDecoration.label}</Text>
                  <Text style={styles.progressSub}>{nextDecoration.at - totalEntries} more entries to unlock</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {tab === 'history' && (
          <View>
            {journalEntries.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>📖</Text>
                <Text style={styles.emptyText}>Your journal is waiting for its first entry.</Text>
              </View>
            ) : (
              journalEntries.map(entry => (
                <View key={entry.id} style={styles.historyCard}>
                  <Text style={styles.historyDate}>
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.historyText}>{entry.text}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {tab === 'garden' && (
          <View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNum}>{totalEntries}</Text>
              <Text style={styles.statsLabel}>total entries</Text>
            </View>
            <Text style={styles.sectionLabel}>Earned</Text>
            {earnedDecorations.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyEmoji}>🌱</Text>
                <Text style={styles.emptyText}>Write your first entry to plant a seed.</Text>
              </View>
            ) : (
              earnedDecorations.map(d => (
                <View key={d.at} style={styles.decorationCard}>
                  <Text style={styles.decorEmoji}>{d.emoji}</Text>
                  <View>
                    <Text style={styles.decorLabel}>{d.label}</Text>
                    <Text style={styles.decorSub}>Unlocked at {d.at} entries</Text>
                  </View>
                </View>
              ))
            )}
            <Text style={styles.sectionLabel}>Coming up</Text>
            {DECORATIONS.filter(d => totalEntries < d.at).slice(0, 3).map(d => (
              <View key={d.at} style={[styles.decorationCard, styles.decorationLocked]}>
                <Text style={[styles.decorEmoji, { opacity: 0.3 }]}>{d.emoji}</Text>
                <View>
                  <Text style={[styles.decorLabel, { color: '#AAAAAA' }]}>{d.label}</Text>
                  <Text style={styles.decorSub}>Unlock at {d.at} entries</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F3EE' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#2D2D2D' },
  subtitle: { fontSize: 15, color: '#9A9A9A', marginBottom: 20 },
  tabs: { flexDirection: 'row', backgroundColor: '#EEE9E2', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff' },
  tabText: { fontSize: 13, color: '#9A9A9A', fontWeight: '600' },
  tabTextActive: { color: '#2D2D2D' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  dateText: { fontSize: 13, color: '#9A9A9A', marginBottom: 8 },
  prompt: { fontSize: 16, fontStyle: 'italic', color: '#2D2D2D', lineHeight: 24 },
  input: { fontSize: 15, color: '#2D2D2D', lineHeight: 22, minHeight: 120, marginBottom: 16 },
  saveBtn: { backgroundColor: '#7B9E87', borderRadius: 12, padding: 14, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: '#C8DDD0' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  savedBadge: { color: '#4CAF50', fontWeight: '700', marginBottom: 8 },
  savedEntry: { fontSize: 14, color: '#555', lineHeight: 22 },
  progressCard: { backgroundColor: '#F0FBF4', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressEmoji: { fontSize: 28 },
  progressLabel: { fontSize: 14, fontWeight: '700', color: '#2D2D2D' },
  progressSub: { fontSize: 12, color: '#7A7A7A' },
  emptyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center' },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: '#9A9A9A', textAlign: 'center', fontSize: 15 },
  historyCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  historyDate: { fontSize: 12, color: '#9A9A9A', fontWeight: '600', marginBottom: 6 },
  historyText: { fontSize: 14, color: '#2D2D2D', lineHeight: 20 },
  statsCard: { backgroundColor: '#7B9E87', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 20 },
  statsNum: { fontSize: 48, fontWeight: '800', color: '#fff' },
  statsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#9A9A9A', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  decorationCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  decorationLocked: { backgroundColor: '#F7F7F7' },
  decorEmoji: { fontSize: 28 },
  decorLabel: { fontSize: 15, fontWeight: '700', color: '#2D2D2D' },
  decorSub: { fontSize: 12, color: '#9A9A9A' },
});
