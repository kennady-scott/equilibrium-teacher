import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Platform, Alert,
} from 'react-native';
import { getOfferings, purchasePackage, restorePurchases } from '../lib/purchases';

const FEATURES = [
  { emoji: '🐹', text: 'Pippin — your daily hamster companion' },
  { emoji: '🎯', text: 'Daily wellness goals & streak tracking' },
  { emoji: '💧', text: 'Hydration, mood & energy logging' },
  { emoji: '📖', text: 'Private journal with guided prompts' },
  { emoji: '🍫', text: 'Testing Days, Conferences & special modes' },
  { emoji: '☁️', text: 'Synced across all your devices' },
];

export default function PaywallScreen({ onSubscribed }) {
  const [offering, setOffering]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring]  = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, just let them through — subscriptions are mobile-only
      onSubscribed();
      return;
    }
    getOfferings().then(o => {
      setOffering(o);
      setLoading(false);
    });
  }, []);

  async function handlePurchase(pkg) {
    setPurchasing(true);
    try {
      const { isActive } = await purchasePackage(pkg);
      if (isActive) onSubscribed();
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert('Something went wrong', e.message || 'Please try again.');
      }
    }
    setPurchasing(false);
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const { isActive } = await restorePurchases();
      if (isActive) {
        onSubscribed();
      } else {
        Alert.alert('No subscription found', 'We couldn\'t find an active subscription for this account.');
      }
    } catch (e) {
      Alert.alert('Restore failed', e.message || 'Please try again.');
    }
    setRestoring(false);
  }

  // Find the monthly package
  const monthlyPkg = offering?.availablePackages?.find(
    p => p.packageType === 'MONTHLY'
  ) ?? offering?.availablePackages?.[0];

  const price     = monthlyPkg?.product?.priceString ?? '$4.99';
  const trialDays = monthlyPkg?.product?.introPrice?.periodNumberOfUnits ?? 7;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pippin}>🐹</Text>
        <Text style={styles.title}>Refill</Text>
        <Text style={styles.subtitle}>
          Take care of you, so you can take care of them.
        </Text>
      </View>

      {/* Free trial badge */}
      <View style={styles.trialBadge}>
        <Text style={styles.trialText}>✨ Try free for {trialDays} days</Text>
      </View>

      {/* Feature list */}
      <View style={styles.featuresCard}>
        {FEATURES.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      {loading ? (
        <ActivityIndicator color="#7B9E87" size="large" style={{ marginVertical: 32 }} />
      ) : (
        <>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => monthlyPkg && handlePurchase(monthlyPkg)}
            disabled={purchasing || !monthlyPkg}
            activeOpacity={0.85}
          >
            {purchasing
              ? <ActivityIndicator color="#fff" />
              : (
                <>
                  <Text style={styles.ctaBtnText}>Start free trial</Text>
                  <Text style={styles.ctaBtnSub}>
                    then {price}/month — cancel anytime
                  </Text>
                </>
              )
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={handleRestore}
            disabled={restoring}
            activeOpacity={0.7}
          >
            {restoring
              ? <ActivityIndicator color="#7A9C7A" size="small" />
              : <Text style={styles.restoreText}>Restore purchases</Text>
            }
          </TouchableOpacity>

          <Text style={styles.legal}>
            Payment charged to your account after the {trialDays}-day free trial.
            Subscription renews automatically unless cancelled at least 24 hours
            before the end of the current period. Manage or cancel anytime in
            your device settings.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EA' },
  content: { padding: 28, paddingBottom: 48 },
  header: { alignItems: 'center', marginBottom: 24 },
  pippin: { fontSize: 80, marginBottom: 12 },
  title: { fontSize: 30, fontWeight: '800', color: '#2A3E2A', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#7A9C7A', textAlign: 'center', lineHeight: 24 },
  trialBadge: {
    backgroundColor: '#7B9E87',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 24,
  },
  trialText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  featuresCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  featureEmoji: { fontSize: 22, width: 36 },
  featureText: { fontSize: 15, color: '#2A3E2A', fontWeight: '500', flex: 1, lineHeight: 22 },
  ctaBtn: {
    backgroundColor: '#7B9E87',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#7B9E87',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaBtnText: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 2 },
  ctaBtnSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  restoreBtn: { alignItems: 'center', paddingVertical: 12, marginBottom: 16 },
  restoreText: { fontSize: 14, color: '#7A9C7A', fontWeight: '600' },
  legal: {
    fontSize: 11,
    color: '#B0B8B0',
    textAlign: 'center',
    lineHeight: 17,
  },
});
