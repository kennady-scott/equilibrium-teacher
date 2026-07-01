import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function SignUpScreen({ onNavigateToSignIn }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [done, setDone]           = useState(false);

  async function handleSignUp() {
    if (!firstName || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 8)              { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm)             { setError('Passwords don\'t match.'); return; }
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { first_name: firstName.trim() } },
    });
    setLoading(false);
    if (err) setError(err.message);
    else setDone(true);
  }

  if (done) {
    return (
      <View style={styles.doneContainer}>
        <Text style={styles.doneLogo}>🐹</Text>
        <Text style={styles.doneTitle}>Check your email!</Text>
        <Text style={styles.doneSub}>
          We sent a confirmation link to {email.trim()}.{'\n'}
          Click it to activate your account, then come back here to sign in.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={onNavigateToSignIn} activeOpacity={0.85}>
          <Text style={styles.btnText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🐹</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.sub}>Join Equilibrium — your daily reset.</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Your first name"
            placeholderTextColor="#B0B8B0"
            autoCapitalize="words"
            autoCorrect={false}
          />
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
            placeholder="At least 8 characters"
            placeholderTextColor="#B0B8B0"
            secureTextEntry
          />
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Same password again"
            placeholderTextColor="#B0B8B0"
            secureTextEntry
          />

          <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Create Account</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToSignIn} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Sign in</Text>
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
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontSize: 14, color: '#8A9E8A' },
  footerLink: { fontSize: 14, color: '#7B9E87', fontWeight: '800' },
  doneContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#F5F0EA' },
  doneLogo: { fontSize: 72, marginBottom: 20 },
  doneTitle: { fontSize: 26, fontWeight: '800', color: '#2A3E2A', marginBottom: 16, textAlign: 'center' },
  doneSub: { fontSize: 15, color: '#7A9C7A', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
});
