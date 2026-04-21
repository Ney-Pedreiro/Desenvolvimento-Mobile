import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useDevices, type Device } from '@/contexts/DevicesContext';
import { useAppTheme } from '@/contexts/ThemeContext';

const getIconName = (type: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (type) {
    case 'weather': return 'weather-sunny';
    case 'climate': return 'weather-windy';
    default: return 'thermometer';
  }
};

const getTemperatureColor = (temp: number) => {
  if (temp < 18) return '#2563eb';
  if (temp < 24) return '#16a34a';
  if (temp < 28) return '#ea580c';
  return '#dc2626';
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { devices, removeDevice, isLoading } = useDevices();
  const [search, setSearch] = useState('');
  const { resolvedTheme } = useAppTheme();
  const colors = Colors[resolvedTheme];
  const isDark = resolvedTheme === 'dark';

  const cardBg = isDark ? '#1e293b' : 'white';
  const borderColor = isDark ? '#334155' : '#e5e7eb';
  const bgColor = isDark ? '#0f172a' : '#f0f7ff';
  const inputBg = isDark ? '#1e293b' : 'white';

  const filtered = useMemo(
    () => devices.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
    ),
    [devices, search]
  );

  const handleDelete = (device: Device) => {
    Alert.alert(
      'Excluir dispositivo',
      `Tem certeza que deseja excluir "${device.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removeDevice(device.id) },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <AppText style={[styles.title, { color: colors.text }]}>Meus Dispositivos</AppText>

        <View style={[styles.searchBar, { backgroundColor: inputBg, borderColor }]}>
          <Feather name="search" size={18} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar dispositivo ou local..."
            placeholderTextColor={colors.icon}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} accessibilityLabel="Limpar busca">
              <Feather name="x" size={18} color={colors.icon} />
            </TouchableOpacity>
          )}
        </View>

        <Button
          title="Adicionar Dispositivo"
          onPress={() => router.push('/add-device')}
          style={{ ...styles.addButton, backgroundColor: cardBg, borderColor }}
          textStyle={{ color: colors.text }}
        />

        {isLoading ? (
          <AppText style={[styles.centerText, { color: colors.icon }]}>
            Carregando dispositivos...
          </AppText>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="devices" size={52} color={colors.icon} />
            <AppText style={[styles.emptyText, { color: colors.icon }]}>
              {search ? 'Nenhum dispositivo encontrado.' : 'Nenhum dispositivo cadastrado.'}
            </AppText>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                cardBg={cardBg}
                borderColor={borderColor}
                colors={colors}
                onEdit={() => router.push(`/add-device?deviceId=${device.id}` as never)}
                onDelete={() => handleDelete(device)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

function DeviceCard({
  device,
  cardBg,
  borderColor,
  colors,
  onEdit,
  onDelete,
}: {
  device: Device;
  cardBg: string;
  borderColor: string;
  colors: typeof Colors.light;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isOnline = device.status === 'online';

  return (
    <View style={[
      styles.card,
      { backgroundColor: cardBg, borderColor },
      !isOnline && styles.cardOffline,
    ]}>
      <View style={styles.cardHeader}>
        <View style={styles.deviceInfo}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name={getIconName(device.type)} size={20} color="#2563eb" />
          </View>
          <View>
            <AppText style={[styles.deviceName, { color: colors.text }]}>{device.name}</AppText>
            <AppText style={[styles.deviceLocation, { color: colors.icon }]}>{device.location}</AppText>
          </View>
        </View>

        <View style={[styles.badge, { backgroundColor: isOnline ? '#22c55e' : '#6b7280' }]}>
          <View style={[styles.badgeDot, { backgroundColor: isOnline ? '#bbf7d0' : '#d1d5db' }]} />
          <AppText style={styles.badgeText}>{isOnline ? 'Conectado' : 'Offline'}</AppText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: borderColor }]} />

      <View style={styles.metrics}>
        <View style={styles.metricRow}>
          <View style={styles.metricLabel}>
            <MaterialCommunityIcons name="thermometer" size={16} color={colors.icon} />
            <AppText style={[styles.metricText, { color: colors.icon }]}>Temperatura</AppText>
          </View>
          <AppText style={[styles.tempValue, { color: getTemperatureColor(device.temperature) }]}>
            {device.temperature}°C
          </AppText>
        </View>

        {device.humidity !== undefined && (
          <View style={styles.metricRow}>
            <View style={styles.metricLabel}>
              <MaterialCommunityIcons name="water-percent" size={16} color={colors.icon} />
              <AppText style={[styles.metricText, { color: colors.icon }]}>Umidade</AppText>
            </View>
            <AppText style={[styles.humidityValue, { color: '#2563eb' }]}>
              {device.humidity}%
            </AppText>
          </View>
        )}
      </View>

      <View style={[styles.divider, { backgroundColor: borderColor, marginTop: 12 }]} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
          accessibilityLabel={`Editar ${device.name}`}
          accessibilityRole="button"
        >
          <Feather name="edit-2" size={14} color="#2563eb" />
          <AppText style={styles.actionEditText}>Editar</AppText>
        </TouchableOpacity>

        <View style={[styles.actionDivider, { backgroundColor: borderColor }]} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
          accessibilityLabel={`Excluir ${device.name}`}
          accessibilityRole="button"
        >
          <Feather name="trash-2" size={14} color="#ef4444" />
          <AppText style={styles.actionDeleteText}>Excluir</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 15 },
  addButton: { borderWidth: 1, marginBottom: 20, height: 48 },
  centerText: { textAlign: 'center', marginTop: 40 },
  emptyState: { alignItems: 'center', marginTop: 64, gap: 12 },
  emptyText: { fontSize: 15, textAlign: 'center' },
  grid: { gap: 14 },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardOffline: { opacity: 0.55 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deviceInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrapper: { backgroundColor: '#dbeafe', padding: 8, borderRadius: 8 },
  deviceName: { fontSize: 15, fontWeight: '600' },
  deviceLocation: { fontSize: 13, marginTop: 1 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    gap: 5,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', color: 'white' },
  divider: { height: 1, marginBottom: 12 },
  metrics: { gap: 10 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricText: { fontSize: 13 },
  tempValue: { fontSize: 22, fontWeight: '700' },
  humidityValue: { fontSize: 17, fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 0,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  actionDivider: { width: 1, marginVertical: 4 },
  actionEditText: { fontSize: 13, fontWeight: '500', color: '#2563eb' },
  actionDeleteText: { fontSize: 13, fontWeight: '500', color: '#ef4444' },
});
