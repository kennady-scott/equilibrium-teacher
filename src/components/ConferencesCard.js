import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const PURPLE       = '#9B7AB8';
const PURPLE_DARK  = '#6B4E8A';
const PURPLE_LIGHT = '#F5EEF8';
const PURPLE_MID   = '#E4D4F0';

const PACKS = [
  { id: 'selfcare', emoji: '🫀', label: 'You First' },
  { id: 'language', emoji: '💬', label: 'Say This' },
  { id: 'admin',    emoji: '🛡️',  label: 'Loop In' },
];

const SELF_CARE = [
  { id: 'water',   emoji: '💧', label: 'Drank water this block' },
  { id: 'food',    emoji: '🥪', label: 'Ate something today' },
  { id: 'breath1', emoji: '🌬️', label: 'Took a breath before last conference' },
  { id: 'unclench',emoji: '😮‍💨', label: 'Shoulders down, jaw unclenched' },
  { id: 'step',    emoji: '🚶', label: 'Stepped out for 2 min between' },
  { id: 'kind',    emoji: '💜', label: 'Being patient with myself today' },
];

// Each card: { instead, say }
const SAY_THIS = [
  {
    instead: "He won't pay attention",
    say:     "He's building his focus stamina — we're working on strategies together.",
  },
  {
    instead: "She's always disrupting class",
    say:     "She's still learning how to express her needs in appropriate ways.",
  },
  {
    instead: "He never does his work",
    say:     "We're figuring out what helps him get started independently.",
  },
  {
    instead: "She's lazy",
    say:     "She hasn't connected with her motivation yet — we're exploring what clicks for her.",
  },
  {
    instead: "He's a behavior problem",
    say:     "He has some significant needs and we're working hard to support him.",
  },
  {
    instead: "She doesn't care",
    say:     "Her behavior is telling us something isn't working for her — we're listening.",
  },
  {
    instead: "He lies constantly",
    say:     "He sometimes struggles with honesty — we're working on that skill.",
  },
  {
    instead: "She's mean to other kids",
    say:     "She's working on developing stronger social-emotional skills.",
  },
];

const ADMIN_CUES = [
  {
    title:  'Parent raises their voice or becomes aggressive',
    script: '"I want to handle this the right way. Let me bring in [admin] so we can all get on the same page together."',
  },
  {
    title:  'You feel personally threatened or accused',
    script: '"I think it would be best to pause and reschedule with administration present. I want this to go well for everyone."',
  },
  {
    title:  'IEP or 504 questions you can\'t answer',
    script: '"That\'s an important question — I want to give you accurate info. Let me loop in our support team before I answer."',
  },
  {
    title:  'Parent requests something outside your authority',
    script: '"I really appreciate you sharing that. That decision would need to go through administration — I\'ll make sure it gets to them."',
  },
  {
    title:  'Conversation is going in circles',
    script: '"I can see how much you care about your child. Let\'s schedule a follow-up with admin so we can make a real plan together."',
  },
];

export default function ConferencesCard() {
  const [activePack, setActivePack] = useState('selfcare');
  const [checked, setChecked]       = useState({});
  const [cardIndex, setCardIndex]   = useState(0);
  const [flipped, setFlipped]       = useState(false);

  function toggleCheck(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const selfcareDone = SELF_CARE.filter(i => checked[i.id]).length;
  const allSelfDone  = selfcareDone === SELF_CARE.length;

  const card = SAY_THIS[cardIndex];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>🗣️ Conferences</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🔥 Streak safe</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        Marathon mode. You've got this — but let's make sure you take care of yourself too.
      </Text>

      {/* Pack tabs */}
      <View style={styles.tabs}>
        {PACKS.map(p => (
          <TouchableOpacity
            key={p.id}
            style={[styles.tab, activePack === p.id && styles.tabActive]}
            onPress={() => setActivePack(p.id)}
            activeOpacity={0.75}
          >
            <Text style={styles.tabEmoji}>{p.emoji}</Text>
            <Text style={[styles.tabLabel, activePack === p.id && styles.tabLabelActive]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Pack 1: You First ── */}
      {activePack === 'selfcare' && (
        <View>
          <Text style={styles.packHint}>Quick check-ins between conferences. Tap each one done.</Text>
          <View style={styles.checklist}>
            {SELF_CARE.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.checkRow, checked[item.id] && styles.checkRowDone]}
                onPress={() => toggleCheck(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, checked[item.id] && styles.checkboxDone]}>
                  {checked[item.id] && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkEmoji}>{item.emoji}</Text>
                <Text style={[styles.checkLabel, checked[item.id] && styles.checkLabelDone]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {allSelfDone && (
            <View style={styles.doneMsg}>
              <Text style={styles.doneMsgText}>You're taking care of yourself. Pippin approves. 🐹💜</Text>
            </View>
          )}
        </View>
      )}

      {/* ── Pack 2: Say This ── */}
      {activePack === 'language' && (
        <View>
          <Text style={styles.packHint}>Professional language for challenging moments. Swipe through the cards.</Text>

          <View style={styles.flashCard}>
            <View style={styles.flashCardInner}>
              <View style={styles.flashAvoid}>
                <Text style={styles.flashAvoidLabel}>❌  Instead of saying...</Text>
                <Text style={styles.flashAvoidText}>"{card.instead}"</Text>
              </View>
              <View style={styles.flashDivider} />
              <View style={styles.flashSay}>
                <Text style={styles.flashSayLabel}>✅  Try this instead...</Text>
                <Text style={styles.flashSayText}>"{card.say}"</Text>
              </View>
            </View>
          </View>

          {/* Nav */}
          <View style={styles.cardNav}>
            <TouchableOpacity
              style={[styles.navBtn, cardIndex === 0 && styles.navBtnDisabled]}
              onPress={() => cardIndex > 0 && setCardIndex(cardIndex - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.navBtnText}>← Prev</Text>
            </TouchableOpacity>
            <Text style={styles.cardCounter}>{cardIndex + 1} / {SAY_THIS.length}</Text>
            <TouchableOpacity
              style={[styles.navBtn, cardIndex === SAY_THIS.length - 1 && styles.navBtnDisabled]}
              onPress={() => cardIndex < SAY_THIS.length - 1 && setCardIndex(cardIndex + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.navBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 Focus on the behavior, not the child's character. Parents hear "your child isn't trying" — reframe to what you're actively doing to help.
            </Text>
          </View>
        </View>
      )}

      {/* ── Pack 3: Loop In Admin ── */}
      {activePack === 'admin' && (
        <View>
          <Text style={styles.packHint}>You don't have to handle everything alone. Here's when to bring in backup.</Text>
          <View style={styles.adminList}>
            {ADMIN_CUES.map((cue, i) => (
              <View key={i} style={styles.adminCue}>
                <View style={styles.adminCueHeader}>
                  <Text style={styles.adminCueIcon}>⚠️</Text>
                  <Text style={styles.adminCueTitle}>{cue.title}</Text>
                </View>
                <View style={styles.scriptBox}>
                  <Text style={styles.scriptLabel}>Say this →</Text>
                  <Text style={styles.scriptText}>{cue.script}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 Bringing in admin is not a failure — it's professional judgment. Parents respect teachers who know when to escalate.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: '800', color: PURPLE_DARK },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: PURPLE,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: PURPLE },
  subtitle: { fontSize: 13, color: '#5A3E70', lineHeight: 20, marginBottom: 16 },

  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  tabEmoji: { fontSize: 14 },
  tabLabel: { fontSize: 12, fontWeight: '700', color: '#9A7AB0' },
  tabLabelActive: { color: '#fff' },

  packHint: { fontSize: 12, color: '#7A5A90', lineHeight: 18, marginBottom: 14, fontStyle: 'italic' },

  // Checklist (Pack 1)
  checklist: { gap: 8 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  checkRowDone: { borderColor: PURPLE, backgroundColor: PURPLE_MID },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C8B0DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: PURPLE, borderColor: PURPLE },
  checkmark: { fontSize: 12, color: '#fff', fontWeight: '800' },
  checkEmoji: { fontSize: 16 },
  checkLabel: { fontSize: 14, color: '#5A3E70', fontWeight: '500', flex: 1 },
  checkLabelDone: { color: PURPLE_DARK, fontWeight: '700' },

  doneMsg: {
    marginTop: 14,
    backgroundColor: PURPLE,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  doneMsgText: { fontSize: 15, fontWeight: '700', color: '#fff', textAlign: 'center' },

  // Flashcards (Pack 2)
  flashCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: PURPLE_MID,
    overflow: 'hidden',
    marginBottom: 12,
  },
  flashCardInner: {},
  flashAvoid: {
    backgroundColor: '#FFF0F0',
    padding: 16,
  },
  flashAvoidLabel: { fontSize: 11, fontWeight: '700', color: '#C04040', marginBottom: 8, letterSpacing: 0.5 },
  flashAvoidText: { fontSize: 15, color: '#7A2020', fontWeight: '600', lineHeight: 22, fontStyle: 'italic' },
  flashDivider: { height: 1.5, backgroundColor: PURPLE_MID },
  flashSay: {
    backgroundColor: '#F0F7EE',
    padding: 16,
  },
  flashSayLabel: { fontSize: 11, fontWeight: '700', color: '#4A8040', marginBottom: 8, letterSpacing: 0.5 },
  flashSayText: { fontSize: 15, color: '#2A5020', fontWeight: '600', lineHeight: 22, fontStyle: 'italic' },
  cardNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: PURPLE,
    borderRadius: 10,
  },
  navBtnDisabled: { backgroundColor: '#D0C0DC' },
  navBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  cardCounter: { fontSize: 13, fontWeight: '700', color: PURPLE_DARK },

  // Admin cues (Pack 3)
  adminList: { gap: 12 },
  adminCue: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: PURPLE_MID,
  },
  adminCueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    paddingBottom: 10,
    backgroundColor: PURPLE_MID,
  },
  adminCueIcon: { fontSize: 14, marginTop: 1 },
  adminCueTitle: { fontSize: 13, fontWeight: '700', color: PURPLE_DARK, flex: 1, lineHeight: 19 },
  scriptBox: { padding: 12 },
  scriptLabel: { fontSize: 11, fontWeight: '700', color: '#7A5A90', marginBottom: 5, letterSpacing: 0.5 },
  scriptText: { fontSize: 13, color: '#3A2050', lineHeight: 20, fontStyle: 'italic' },

  tipBox: {
    marginTop: 14,
    backgroundColor: PURPLE_MID,
    borderRadius: 12,
    padding: 12,
  },
  tipText: { fontSize: 12, color: PURPLE_DARK, lineHeight: 18 },
});
