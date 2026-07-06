import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function SignInScreen({ onNavigateToSignUp }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  async function handleSignIn() {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (err) setError(err.message);
  }

  async function handleForgotPassword() {
    if (!email) { setError('Enter your email above first.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (err) setError(err.message);
    else setError('Check your email for a reset link.');
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🐹</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to Refill</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@school.edu"
            placeholderTextColor="#B0B8B0"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#B0B8B0"
            secureTextEntry
          />

          <TouchableOpacity style={styles.btn} onPress={handleSignIn} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Sign In</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onNavigateToSignUp} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F0EA' },
  container: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  logo: { fontSize: 64, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#2A3E2A', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: 15, color: '#7A9C7A', textAlign: 'center', marginBottom: 32 },
  errorBox: { backgroundColor: '#FDECEA', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#F5C2C7' },
  errorText: { fontSize: 14, color: '#9B1C1C', lineHeight: 20 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  label: { fontSize: 13, fontWeight: '700', color: '#4A6741', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F5F0EA', borderRadius: 12, padding: 14, fontSize: 15, color: '#2A3E2A', borderWidth: 1.5, borderColor: 'transparent' },
  btn: { backgroundColor: '#7B9E87', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  forgotBtn: { alignItems: 'center', marginTop: 14 },
  forgotText: { fontSize: 13, color: '#7A9C7A', fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontSize: 14, color: '#8A9E8A' },
  footerLink: { fontSize: 14, color: '#7B9E87', fontWeight: '800' },
});
