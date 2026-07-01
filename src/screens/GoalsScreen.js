import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, TextInput, Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { GOAL_PRESETS } from '../utils/goalPresets';

export default function GoalsScreen() {
  const { goals, checkInGoal, addGoal, removeGoal, toggleFeatured, updateGoalTitle, MAX_FEATURED } = useApp();

  const [showPicker, setShowPicker]       = useState(false);
  const [showCustom, setShowCustom]       = useState(false);
  const [customTitle, setCustomTitle]     = useState('');
  const [editingGoal, setEditingGoal]     = useState(null); // { id, title }
  const [editTitle, setEditTitle]         = useState('');

  const today         = new Date().toDateString();
  const featuredCount = goals.filter(g => g.featured).length;
  const addedIds      = new Set(goals.map(g => g.id));

  function handleAddPreset(preset) {
    addGoal(preset);
    setShowPicker(false);
  }

  function handleAddCustom() {
    if (!customTitle.trim()) return;
    addGoal({ id: Date.now().toString(), emoji: '✏️', petStat: 'calm', petEmoji: '😊', target: 3 }, customTitle.trim());
    setCustomTitle('');
    setShowCustom(false);
  }

  function handleRemove(goalId) {
    removeGoal(goalId);
  }

  function handleEditSave() {
    if (!editTitle.trim() || !editingGoal) return;
    updateGoalTitle(editingGoal.id, editTitle.trim());
    setEditingGoal(null);
  }

  const STAT_COLORS = { calm: '#C8E6C9', energy: '#FFF9C4', hunger: '#DCEDC8' };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F0EA' }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Goals</Text>
        <Text style={styles.subtitle}>Up to {MAX_FEATURED} goals show as tiles on your home screen.</Text>

        {/* Featured count banner */}
        <View style={styles.featuredBanner}>
          <Text style={styles.featuredBannerText}>
            🏠 {featuredCount} of {MAX_FEATURED} home tiles used
          </Text>
          <View style={styles.featuredDots}>
            {Array.from({ length: MAX_FEATURED }).map((_, i) => (
              <View key={i} style={[styles.dot, i < featuredCount && styles.dotFilled]} />
            ))}
          </View>
        </View>

        {/* Goal list */}
        {goals.map(goal => {
          const todayDone = goal.checkins.includes(today);
          const weekDone  = goal.checkins.filter(d => (new Date() - new Date(d)) / 86400000 <= 7).length;
          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalCardTop}>
                <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalSub}>{weekDone}/{goal.target} this week · boosts {goal.petEmoji} {goal.petStat}</Text>
                </View>
                {/* Edit button */}
                <TouchableOpacity style={styles.iconBtn} onPress={() => { setEditingGoal(goal); setEditTitle(goal.title); }}>
                  <Text style={styles.iconBtnText}>✏️</Text>
                </TouchableOpacity>
                {/* Remove button */}
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleRemove(goal.id)}>
                  <Text style={styles.iconBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.goalCardBottom}>
                {/* Featured toggle */}
                <TouchableOpacity
                  style={[styles.featuredToggle, goal.featured && styles.featuredToggleOn]}
                  onPress={() => toggleFeatured(goal.id)}
                  disabled={!goal.featured && featuredCount >= MAX_FEATURED}
                >
                  <Text style={[styles.featuredToggleText, goal.featured && styles.featuredToggleTextOn]}>
                    {goal.featured ? '🏠 On home' : featuredCount >= MAX_FEATURED ? '🏠 Home full' : '🏠 Add to home'}
                  </Text>
                </TouchableOpacity>

                {/* Check in */}
                <TouchableOpacity
                  style={[styles.checkinBtn, todayDone && styles.checkinBtnDone]}
                  onPress={() => !todayDone && checkInGoal(goal.id)}
                  disabled={todayDone}
                >
                  <Text style={[styles.checkinBtnText, todayDone && styles.checkinBtnTextDone]}>
                    {todayDone ? '✅ Done today' : 'Check in'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Add buttons */}
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowPicker(true)}>
          <Text style={styles.addBtnText}>+ Choose from goal list</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addBtn, styles.addBtnOutline]} onPress={() => setShowCustom(true)}>
          <Text style={[styles.addBtnText, styles.addBtnOutlineText]}>✏️ Write my own goal</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ===== GOAL PICKER MODAL ===== */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Choose a Goal</Text>
            <Text style={styles.modalSub}>Tap one to add it to your list.</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {GOAL_PRESETS.map(preset => {
                const alreadyAdded = addedIds.has(preset.id);
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[styles.presetRow, alreadyAdded && styles.presetRowAdded]}
                    onPress={() => !alreadyAdded && handleAddPreset(preset)}
                    disabled={alreadyAdded}
                  >
                    <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                    <Text style={[styles.presetTitle, alreadyAdded && styles.presetTitleAdded]}>{preset.title}</Text>
                    {alreadyAdded
                      ? <Text style={styles.addedBadge}>Added ✓</Text>
                      : <Text style={styles.presetAdd}>+</Text>
                    }
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowPicker(false)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== CUSTOM GOAL MODAL ===== */}
      <Modal visible={showCustom} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSmall}>
            <Text style={styles.modalTitle}>Write Your Own Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Take a 10-minute walk outside"
              value={customTitle}
              onChangeText={setCustomTitle}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.modalClose, !customTitle.trim() && { opacity: 0.4 }]}
              onPress={handleAddCustom}
              disabled={!customTitle.trim()}
            >
              <Text style={styles.modalCloseText}>Add Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCustom(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== EDIT GOAL MODAL ===== */}
      <Modal visible={!!editingGoal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSmall}>
            <Text style={styles.modalTitle}>Edit Goal</Text>
            <TextInput
              style={styles.input}
              value={editTitle}
              onChangeText={setEditTitle}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.modalClose, !editTitle.trim() && { opacity: 0.4 }]}
              onPress={handleEditSave}
              disabled={!editTitle.trim()}
            >
              <Text style={styles.modalCloseText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingGoal(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: '#2A3E2A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#8A9E8A', marginBottom: 16 },

  featuredBanner: { backgroundColor: '#E8F5E9', borderRadius: 14, padding: 14, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featuredBannerText: { fontSize: 13, fontWeight: '700', color: '#388E3C' },
  featuredDots: { flexDirection: 'row', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#C8E6C9' },
  dotFilled: { backgroundColor: '#4CAF50' },

  goalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  goalCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  goalEmoji: { fontSize: 26, marginRight: 10 },
  goalTitle: { fontSize: 14, fontWeight: '700', color: '#2A3E2A' },
  goalSub: { fontSize: 11, color: '#9A9A9A', marginTop: 2 },
  iconBtn: { padding: 6 },
  iconBtnText: { fontSize: 16 },

  goalCardBottom: { flexDirection: 'row', gap: 8 },
  featuredToggle: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 10, padding: 10, alignItems: 'center' },
  featuredToggleOn: { backgroundColor: '#E8F5E9' },
  featuredToggleText: { fontSize: 12, fontWeight: '700', color: '#9A9A9A' },
  featuredToggleTextOn: { color: '#388E3C' },
  checkinBtn: { flex: 1, backgroundColor: '#F0FBF4', borderRadius: 10, padding: 10, alignItems: 'center' },
  checkinBtnDone: { backgroundColor: '#E8F5E9' },
  checkinBtnText: { fontSize: 12, fontWeight: '700', color: '#4CAF50' },
  checkinBtnTextDone: { color: '#81C784' },

  addBtn: { backgroundColor: '#7B9E87', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 10 },
  addBtnOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#7B9E87' },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  addBtnOutlineText: { color: '#7B9E87' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '85%' },
  modalSmall: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#2A3E2A', textAlign: 'center', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#8A9E8A', textAlign: 'center', marginBottom: 16 },

  presetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  presetRowAdded: { opacity: 0.45 },
  presetEmoji: { fontSize: 24, marginRight: 12, width: 32 },
  presetTitle: { flex: 1, fontSize: 15, color: '#2A3E2A', fontWeight: '500' },
  presetTitleAdded: { color: '#AAAAAA' },
  presetAdd: { fontSize: 22, color: '#7B9E87', fontWeight: '700', paddingHorizontal: 6 },
  addedBadge: { fontSize: 12, color: '#9A9A9A', fontWeight: '600' },

  modalClose: { backgroundColor: '#7B9E87', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16, marginBottom: 8 },
  modalCloseText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  input: { borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 4 },
  cancelText: { textAlign: 'center', color: '#AAAAAA', fontSize: 14, paddingVertical: 8 },
});
