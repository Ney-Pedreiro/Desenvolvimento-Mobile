import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atoms/AppText';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme, type ThemeMode } from '@/contexts/ThemeContext';

type ThemeOption = {
  label: string;
  value: ThemeMode;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const THEME_OPTIONS: ThemeOption[] = [
  { label: 'Sistema', value: 'system', icon: 'theme-light-dark' },
  { label: 'Claro', value: 'light', icon: 'weather-sunny' },
  { label: 'Escuro', value: 'dark', icon: 'weather-night' },
];

export default function ConfiguracoesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useAuth();
  const { themeMode, resolvedTheme, setThemeMode } = useAppTheme();
  const colors = Colors[resolvedTheme];
  const isDark = resolvedTheme === 'dark';

  const cardBg = isDark ? '#1e293b' : 'white';
  const borderColor = isDark ? '#334155' : '#e5e7eb';

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <AppText style={[styles.title, { color: colors.text }]}>Configurações</AppText>

        <AppText style={[styles.sectionLabel, { color: colors.icon }]}>Aparência</AppText>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          {THEME_OPTIONS.map((option, idx) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.row,
                idx < THEME_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor },
                themeMode === option.value && { backgroundColor: isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff' },
              ]}
              onPress={() => setThemeMode(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: themeMode === option.value }}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={22}
                color={themeMode === option.value ? '#2563eb' : colors.icon}
              />
              <AppText style={[
                styles.rowLabel,
                { color: themeMode === option.value ? '#2563eb' : colors.text },
              ]}>
                {option.label}
              </AppText>
              {themeMode === option.value && (
                <MaterialCommunityIcons name="check-circle" size={20} color="#2563eb" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <AppText style={[styles.sectionLabel, { color: colors.icon, marginTop: 28 }]}>Conta</AppText>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <TouchableOpacity
            style={styles.row}
            onPress={handleLogout}
            accessibilityLabel="Sair do aplicativo"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="logout" size={22} color="#ef4444" />
            <AppText style={[styles.rowLabel, { color: '#ef4444' }]}>Sair</AppText>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <AppText style={[styles.version, { color: colors.icon }]}>ClimaTech v1.0.0</AppText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  version: { textAlign: 'center', fontSize: 13, marginTop: 36 },
});
