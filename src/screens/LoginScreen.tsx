import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

import { useAuthStore } from '@store/authStore';
import { AuthErrors, validateAuthForm } from '@src/utils/authValidation';
import { COLORS } from '@src/theme/colors';

export function LoginScreen() {
  const theme = useTheme();
  const primary = COLORS.clearChill;
  const { login, loading, error } = useAuthStore((state) => ({
    login: state.login,
    loading: state.loading,
    error: state.error,
  }));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AuthErrors>({
    username: '',
    password: '',
    form: '',
  });
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);

  const handleSubmit = async () => {
    const { valid, errors: validationErrors } = validateAuthForm(username, password);
    setErrors(validationErrors);

    if (!valid) return;

    const result = await login(username, password);
    if (!result.success && result.error) {
      setErrors((prev) => ({ ...prev, form: result.error ?? '' }));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: COLORS.textPrimary }]}>Авторизация</Text>
      <View style={[styles.titleUnderline, { backgroundColor: primary }]} />

      <TextInput
        label="Логин"
        placeholder="Введите ваш логин"
        value={username}
        onChangeText={(value) => {
          setUsername(value);
          setErrors((prev) => ({ ...prev, username: '' }));
        }}
        mode="outlined"
        outlineColor={focusedField === 'username' ? primary : COLORS.inputBorder}
        activeOutlineColor={primary}
        theme={{ roundness: 12 }}
        style={[
          styles.input,
          {
            backgroundColor:
              focusedField === 'username' ? COLORS.inputBackgroundFocused : COLORS.inputBackground,
          },
        ]}
        textColor={COLORS.textPrimary}
        placeholderTextColor={COLORS.inputPlaceholder}
        error={!!errors.username}
        onFocus={() => setFocusedField('username')}
        onBlur={() => setFocusedField((current) => (current === 'username' ? null : current))}
      />
      {errors.username ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.username}</Text>
      ) : null}

      <TextInput
        label="Пароль"
        placeholder="Введите ваш пароль"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setErrors((prev) => ({ ...prev, password: '' }));
        }}
        mode="outlined"
        outlineColor={focusedField === 'password' ? primary : COLORS.inputBorder}
        activeOutlineColor={primary}
        theme={{ roundness: 12 }}
        style={[
          styles.input,
          {
            backgroundColor:
              focusedField === 'password' ? COLORS.inputBackgroundFocused : COLORS.inputBackground,
          },
        ]}
        textColor={COLORS.textPrimary}
        placeholderTextColor={COLORS.inputPlaceholder}
        secureTextEntry
        error={!!errors.password}
      />
      {errors.password ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.password}</Text>
      ) : null}

      {(errors.form || error) && (
        <Text style={[styles.formError, { color: theme.colors.error }]}>
          {errors.form || error}
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        buttonColor={primary}
        style={styles.button}
        labelStyle={[styles.buttonLabel, loading && styles.buttonLabelLoading]}
      >
        Войти
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 48,
    height: 3,
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: COLORS.inputBackground,
  },
  button: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonLabelLoading: {
    color: '#ffffff',
  },
  errorText: {
    fontSize: 12,
    marginBottom: 4,
  },
  formError: {
    fontSize: 13,
    marginTop: 4,
  },
});
