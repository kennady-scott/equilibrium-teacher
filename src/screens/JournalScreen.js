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
    "What drew you to teaching in the first place?",
    "What's one habit you want to build for yourself this year?",
    "How do you want your students to describe your classroom?",
    "What worried you last year that you want to handle differently?",
    "What does a sustainable week look like for you?",
    "Who do you want to be for your students on a hard day?",
    "What are you giving yourself permission to not do this year?",
    "What's one small ritual that could ground your mornings?",
    "What does 'enough' look like for you this year?",
    "What strengths are you bringing into this classroom?",
    "How will you know if you're actually taking care of yourself?",
    "What's one relationship at work you want to invest in?",
    "What are you most nervous about, and what might help?",
    "What do you want to feel on your drive home each day?",
    "What's a promise you want to make to yourself this year?",
    "How do you want to handle the first really tough day?",
    "What does your ideal Sunday evening look like?",
    "What's one thing from summer you want to hold onto?",
    "What kind of energy do you want to bring into the room?",
    "What would make this year feel meaningful, not just survivable?",
    "What's one fear you want to set down before the first bell?",
    "How do you want to greet your students each morning?",
    "What boundary did you struggle to keep last year?",
    "Write a short letter to your mid-year self.",
  ],
  // September — Finding Your Footing
  8: [
    "What's surprisingly hard already, and what might help?",
    "When did you last feel genuinely connected to a student?",
    "What parts of the job are still giving you energy?",
    "What does a 'good enough' day look like right now?",
    "What's one thing you want to protect in your evenings or weekends?",
    "Write about a small moment this week that reminded you why you're here.",
    "What routine is starting to click for you?",
    "Which student is still a mystery you want to understand?",
    "What's draining more energy than it should?",
    "Where are you being too hard on yourself right now?",
    "What's one thing already going better than last year?",
    "How are your mornings feeling these days?",
    "What do you need more of to feel steady?",
    "What's a win from this week you almost overlooked?",
    "Who helped you this month — and did you thank them?",
    "What's one system in your classroom you want to simplify?",
    "When did you last laugh with your students?",
    "What are you still figuring out — and that's okay?",
    "What would make next week 10% easier?",
    "What's one boundary you've kept, and how did it feel?",
    "Where do you feel most confident right now?",
    "What's something you want to ask for help with?",
    "How is your body feeling at the end of the day?",
    "What would you tell a first-year teacher right now?",
    "What part of your day do you look forward to?",
    "What expectation of yourself could you loosen?",
    "Write about a student who's growing on you.",
    "What do you want to remember about this early stretch?",
    "What's one small joy you can build into tomorrow?",
    "How have you changed since the first day?",
  ],
  // October — First Slump
  9: [
    "What's draining you most right now, and what's one small thing that might help?",
    "Name one thing that's working, even if everything else feels hard.",
    "What would you tell yourself at the start of this school year?",
    "Write about a student moment that made you feel like this job matters.",
    "What needs to change before Thanksgiving?",
    "If a colleague was struggling like you are, what would you tell them?",
    "What's the heaviest thing you're carrying this week?",
    "Where have you been running on empty?",
    "What's one thing you can take off your plate?",
    "When did you last feel truly rested?",
    "What are you proud of surviving this month?",
    "What would a real break look like this weekend?",
    "Who can you lean on right now?",
    "What small comfort can you give yourself today?",
    "What's one expectation you can lower without guilt?",
    "Where is your energy going that isn't serving you?",
    "What made you smile at school this week, even briefly?",
    "What do you need to hear right now?",
    "What's one boundary you need to reinforce?",
    "How is this season affecting your mood outside of work?",
    "What would help you fall asleep easier tonight?",
    "What's a hard truth you've been avoiding?",
    "Which part of your job still feels meaningful?",
    "What's one thing you can say no to this week?",
    "Write about a student who needs you right now.",
    "What would 'good enough' look like this week?",
    "What are you learning about your limits?",
    "What's one way you can be gentler with yourself?",
    "Who reminds you why you started?",
    "What do you want the rest of fall to feel like?",
  ],
  // November — Gratitude & Endurance
  10: [
    "Name something small that brought you joy in the classroom this week.",
    "What are you proud of making it to Thanksgiving?",
    "Write about a relationship at work that sustains you.",
    "What does rest actually look like for you — not just the absence of work?",
    "Gratitude check: what's something about teaching you wouldn't trade?",
    "What's one thing you need from break to come back feeling okay?",
    "Who are you grateful for this year, and why?",
    "What's a moment from this month you want to remember?",
    "What has a student taught you recently?",
    "What are you learning to appreciate about yourself?",
    "What's one comfort you're looking forward to over break?",
    "Where have you grown since August?",
    "What made you feel supported this month?",
    "What's a small tradition that brings you peace?",
    "Who deserves a thank-you from you this week?",
    "What part of your classroom feels like home?",
    "What's something hard that's also been worth it?",
    "How do you want to spend your break to actually recharge?",
    "What are you proud of your students for?",
    "What's a strength you leaned on this month?",
    "What's one thing you're grateful your past self did?",
    "Where did you find unexpected joy recently?",
    "What do you want to say yes to more often?",
    "Write about a colleague who makes the days lighter.",
    "What's one worry you can release before break?",
    "What has this season asked of you, and how have you answered?",
    "What are you most looking forward to right now?",
    "What's a kindness someone showed you lately?",
    "How can you carry gratitude into December?",
    "What would make this break restorative, not just busy?",
  ],
  // December — Recharge & Release
  11: [
    "What are you releasing before the new year?",
    "Write about a moment this semester that reminded you why you teach.",
    "What would feel like enough rest this holiday?",
    "What's one thing you want to do differently in January?",
    "Write a letter to your January self — what do you want her/him to remember?",
    "What did this semester cost you, and what did it give you?",
    "What are you proud of from this first half of the year?",
    "What weight are you ready to set down?",
    "What does a slow morning feel like to you?",
    "Who do you want to reconnect with over break?",
    "What's a memory from this semester that makes you smile?",
    "What do you want less of next semester?",
    "What do you want more of next semester?",
    "How do you want to feel on the first day back?",
    "What's one way you neglected yourself this fall?",
    "What would a guilt-free rest day look like?",
    "What are you grateful survived this semester?",
    "What's a lesson this semester taught you?",
    "What do you want to forgive yourself for?",
    "What's something joyful you can plan for the break?",
    "How has teaching stretched you this year?",
    "What do you want to leave in this calendar year?",
    "What's a hope you have for the spring?",
    "Who supported you this semester that you want to thank?",
    "What does your body need most right now?",
    "What's one small win you want to celebrate?",
    "What would make January feel like a fresh start?",
    "What are you carrying that isn't yours to hold?",
    "Write about who you were in August vs. who you are now.",
    "What intention do you want to set for the new year?",
  ],
  // January — Recommit & Renew
  0: [
    "What does a fresh start mean for you right now?",
    "What's one intention you're setting for this semester?",
    "Who needs extra care from you this month — a student, a colleague, yourself?",
    "What did the fall teach you about yourself?",
    "What would you stop doing if you could?",
    "How do you want to feel by June?",
    "What's one habit you want to rebuild this month?",
    "What are you recommitting to as a teacher?",
    "What's a small change that could make a big difference?",
    "What do you want to protect this semester?",
    "What's one goal that's just for you, not your students?",
    "Where do you want to give yourself more grace?",
    "What worked last semester that you want to keep?",
    "What are you leaving behind in the fall?",
    "What does balance look like for you right now?",
    "Who do you want to be more present for?",
    "What's one boundary you want to hold firmly this spring?",
    "What are you most hopeful about this semester?",
    "What would make your mornings feel calmer?",
    "What's a fear you want to move through this year?",
    "What do you need to say no to more often?",
    "What's one way you can invest in yourself this month?",
    "Where do you want to feel more confident?",
    "What's a relationship you want to strengthen?",
    "What does success look like by spring break?",
    "What are you ready to try again?",
    "What do you want your classroom to feel like this semester?",
    "What's one thing you're grateful to start fresh with?",
    "How do you want to handle the long winter stretch?",
    "Write a small promise to yourself for the months ahead.",
  ],
  // February — Dig Deep
  1: [
    "What's keeping you going right now?",
    "When did you last feel proud of yourself as a teacher?",
    "What relationship in your classroom needs more investment?",
    "What would replenish you most right now?",
    "Name something you're tolerating that you shouldn't be.",
    "Write about a student who has surprised you this year.",
    "What's the hardest part of this stretch of winter?",
    "Where are you finding small pockets of light?",
    "What do you need to keep going through February?",
    "What are you doing better than you give yourself credit for?",
    "Who has your back right now?",
    "What's draining you that you can actually change?",
    "What would a good day look like this week?",
    "Where have you grown since January?",
    "What's a small joy you can hold onto today?",
    "What's weighing on you that you haven't said out loud?",
    "What do you want to feel more of this month?",
    "Who could use kindness from you this week?",
    "What's one way you can truly rest this weekend?",
    "What have you been too hard on yourself about?",
    "What keeps you coming back to this work?",
    "What's a win you can celebrate right now?",
    "What do you need to forgive yourself for?",
    "How is your energy these days, honestly?",
    "What's one boundary you want to protect this month?",
    "Write about a student you're proud of.",
    "What would make the rest of winter feel lighter?",
    "What are you learning about your own resilience?",
    "What small comfort can you build into tomorrow?",
    "What do you want to remember when this stretch passes?",
  ],
  // March — Persevere
  2: [
    "What does 'pushing through' feel like in your body right now?",
    "What's your why — why are you still here?",
    "Name something hard you've already survived this year.",
    "What does your classroom feel like right now, honestly?",
    "Who in your life understands what this stretch is like?",
    "What would make spring break feel like a real reset?",
    "Where are you running low, and what might refill you?",
    "What's one thing you're proud of holding together?",
    "What do you need to make it to spring break?",
    "What small win happened this week?",
    "What are you looking forward to most right now?",
    "What's one thing you can let go of this week?",
    "Who do you want to lean on more?",
    "Where have you surprised yourself lately?",
    "What does your body need after these long weeks?",
    "What's a boundary you've kept that you're proud of?",
    "What would help you feel less stretched thin?",
    "What keeps your spark alive on hard days?",
    "What's one comfort you can give yourself today?",
    "Which student is quietly growing right now?",
    "What do you need to hear this week?",
    "What's a worry you can set down?",
    "How do you want to spend spring break to truly rest?",
    "What are you learning about perseverance?",
    "What's one thing going better than it feels?",
    "Where can you ask for help right now?",
    "What made you smile at school recently?",
    "What's a small hope you're holding for spring?",
    "What would make tomorrow 10% easier?",
    "Write about how far you've come since fall.",
  ],
  // April — Testing Season & Spring
  3: [
    "How are you protecting your energy during testing season?",
    "What will you let go of once testing is over?",
    "Write about a student you're quietly rooting for right now.",
    "What do you need to hear but no one is saying?",
    "How has this year already changed you?",
    "Spring check-in: where are you compared to where you thought you'd be?",
    "What's the biggest pressure you're feeling right now?",
    "How can you keep testing in perspective for yourself?",
    "What small joy can you protect during this busy stretch?",
    "What are you proud of your students for, beyond scores?",
    "What do you want to remember about who your students really are?",
    "Where do you need to give yourself grace this month?",
    "What's one way you can decompress after testing days?",
    "What are you looking forward to as the year winds down?",
    "How is spring shifting your mood?",
    "What's a boundary you need during testing week?",
    "What do you want to celebrate before the year ends?",
    "Who has helped you through this season?",
    "What's draining you that will pass soon?",
    "What's one thing you can do this weekend just for you?",
    "What are you learning about handling pressure?",
    "What's a small win from this week?",
    "Which student surprised you recently?",
    "What do you need to feel steady right now?",
    "How do you want to show up for your students during testing?",
    "What's one worry you can release?",
    "What part of teaching still lights you up?",
    "What would make this stretch feel more manageable?",
    "What are you most proud of this spring?",
    "Write about a hope you have for the final weeks.",
  ],
  // May — The Final Push
  4: [
    "What are you most proud of from this year?",
    "Who do you want to celebrate before the year ends?",
    "What will you miss about this class?",
    "What's the hardest thing you navigated this year?",
    "Write a note — real or imaginary — to a student who changed you.",
    "What does this time of year do to your body and mind?",
    "What are you ready to be done with?",
    "What moment from this year made it all worth it?",
    "How do you want to close out this year with your students?",
    "What do you want to say to your class before they go?",
    "What are you grateful you made it through?",
    "What's one thing you'll do differently next year?",
    "Where did you grow the most this year?",
    "What do you need to make it through these final weeks?",
    "What's a memory from this year you want to keep?",
    "Who deserves your thanks before summer?",
    "What's draining you as the year ends?",
    "What are you looking forward to about summer?",
    "What did this class teach you?",
    "What's one boundary you want to protect through the finish line?",
    "What are you proud of your students for?",
    "How do you want to feel on the last day?",
    "What's a small joy in these final weeks?",
    "What do you want to forgive yourself for this year?",
    "What's one way to celebrate yourself soon?",
    "Which student will you think about over the summer?",
    "What did you learn about yourself this year?",
    "What's a win you almost forgot to notice?",
    "How do you want to spend your first week of summer?",
    "Write a thank-you to yourself for making it here.",
  ],
  // June — Reflect & Close
  5: [
    "What did this year teach you about yourself?",
    "Write about who you were in August vs. who you are now.",
    "What moment from this year will you carry with you?",
    "What would you do differently if you could start the year again?",
    "What do you need from summer to show up whole in August?",
    "Write about a student you'll think about long after this year ends.",
    "What are you most proud of from this year?",
    "What are you ready to release from this year?",
    "What surprised you about yourself this year?",
    "What relationship this year mattered most?",
    "What's a lesson you'll take into next year?",
    "What did you survive that you weren't sure you could?",
    "What made this year meaningful?",
    "What do you want to leave behind?",
    "What are you grateful for as this year closes?",
    "How did your students change you?",
    "What's one thing you'd tell your August self?",
    "What do you want to celebrate about yourself?",
    "What's a moment of pure joy from this year?",
    "What did teaching cost you this year, and what did it give?",
    "Who helped you through this year?",
    "What do you want to do first this summer?",
    "What part of yourself do you want to reclaim?",
    "What's a hope you have for next year?",
    "What are you proud of pushing through?",
    "What would real rest look like this summer?",
    "What did you learn about your limits?",
    "What's a small win from the whole year worth remembering?",
    "How do you want to feel by August?",
    "Write a closing letter to this school year.",
  ],
  // July — Restore
  6: [
    "What does real rest feel like when you finally reach it?",
    "What parts of yourself got set aside this year that you want to reclaim?",
    "What are you looking forward to about next year?",
    "Write about something outside of teaching that makes you you.",
    "What does the best version of your life look like right now?",
    "What's one thing you want to remember when August arrives again?",
    "What brings you joy that has nothing to do with school?",
    "How does your body feel now that you can breathe?",
    "What are you doing this summer just for fun?",
    "Who do you want to spend more time with?",
    "What hobby or interest do you want to pick back up?",
    "What does a perfect summer day look like for you?",
    "What have you been able to let go of?",
    "What are you learning about yourself in this slower season?",
    "What do you want to protect when the school year returns?",
    "What's a boundary you want to carry into next year?",
    "What are you most grateful for this summer?",
    "What does taking care of yourself look like right now?",
    "What's a dream you want to make room for?",
    "How do you want to start next year differently?",
    "What refills you that you forgot you needed?",
    "What are you proud of about your life outside of work?",
    "What would make this summer feel complete?",
    "What's a small pleasure you're savoring?",
    "Who are you when you're not being a teacher?",
    "What do you want more of in your life?",
    "What have you rediscovered about yourself?",
    "What's one intention for next school year?",
    "How do you want to feel walking into August?",
    "Write about the life you're building beyond the classroom.",
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
