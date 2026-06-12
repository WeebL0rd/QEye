import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme, radius, typography, spacing } from '../styles/theme';
import { ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = () => {
  const theme = useTheme();
  const { register } = useAuth();       
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    console.log('HANDLE REGISTER llamado');
    if (!displayName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      setLoading(true);
      console.log('DATOS:', { email, password, displayName });
      await register(email, password, displayName);
      router.replace('/home');
    } catch (error: any) {
      console.log('ERROR REGISTRO:', JSON.stringify(error?.response?.data || error?.message || error));
      Alert.alert('Error', error?.response?.data?.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, {
          backgroundColor: theme.surface,
          shadowColor: theme.shadow.color,
          shadowOpacity: theme.shadow.opacity,
          shadowRadius: theme.shadow.radius,
          shadowOffset: theme.shadow.offset,
          elevation: theme.shadow.elevation,
        }]}>
          <Text style={[typography.h1, styles.title, { color: theme.primary }]}>
            QEye
          </Text>
          <Text style={[typography.body, styles.subtitle, { color: theme.text.secondary }]}>
            Crea tu cuenta
          </Text>

          <TextInput
            style={[styles.input, {
              borderColor: theme.border,
              backgroundColor: theme.background,
              color: theme.text.primary,
            }]}
            placeholder="Nombre completo"
            placeholderTextColor={theme.text.disabled}
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextInput
            style={[styles.input, {
              borderColor: theme.border,
              backgroundColor: theme.background,
              color: theme.text.primary,
            }]}
            placeholder="Correo electrónico"
            placeholderTextColor={theme.text.disabled}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, {
              borderColor: theme.border,
              backgroundColor: theme.background,
              color: theme.text.primary,
            }]}
            placeholder="Contraseña"
            placeholderTextColor={theme.text.disabled}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={[styles.input, {
              borderColor: theme.border,
              backgroundColor: theme.background,
              color: theme.text.primary,
            }]}
            placeholder="Confirmar contraseña"
            placeholderTextColor={theme.text.disabled}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
          >
            <Text style={[typography.body, { color: theme.text.onPrimary, fontWeight: '700' }]}>
              Crear cuenta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[typography.small, styles.link, { color: theme.text.secondary }]}>
              ¿Ya tienes cuenta?{' '}
              <Text style={{ color: theme.primary, fontWeight: '700' }}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg + spacing.sm,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    fontSize: 15,
    marginBottom: spacing.sm + spacing.xs + 2,
  },
  btn: {
    borderRadius: radius.md,
    padding: spacing.md - 1,
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  link: {
    textAlign: 'center',
  },
});

export default RegisterScreen;