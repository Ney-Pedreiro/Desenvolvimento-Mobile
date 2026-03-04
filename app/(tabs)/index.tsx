import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');

interface Device {
  id: string;
  name: string;
  location: string;
  temperature: number;
  humidity?: number;
  status: 'online' | 'offline';
  type: 'temperature' | 'weather' | 'climate';
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Sensor Sala',
    location: 'Sala de Estar',
    temperature: 23.5,
    humidity: 45,
    status: 'online',
    type: 'climate',
  },
  {
    id: '2',
    name: 'Sensor Quarto',
    location: 'Quarto Principal',
    temperature: 21.2,
    humidity: 50,
    status: 'online',
    type: 'climate',
  },
  {
    id: '3',
    name: 'Sensor Cozinha',
    location: 'Cozinha',
    temperature: 26.8,
    status: 'online',
    type: 'temperature',
  },
];

const getIconName = (type: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (type) {
    case 'weather':
      return 'weather-sunny';
    case 'climate':
      return 'weather-windy';
    default:
      return 'thermometer';
  }
};

const getTemperatureColor = (temp: number) => {
  if (temp < 18) return '#2563eb'; // blue-600
  if (temp < 24) return '#16a34a'; // green-600
  if (temp < 28) return '#ea580c'; // orange-600
  return '#dc2626'; // red-600
};

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [devices] = useState<Device[]>(mockDevices);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
      >
        <View style={styles.headerRow}>
          <AppText style={styles.headerTitle}>Meus Dispositivos</AppText>
        </View>

        <Button
          title="Adicionar Dispositivo"
          onPress={() => router.push('/add-device' as any)}
          style={styles.addButton}
          textStyle={styles.addButtonText}
        />

        <View style={styles.grid}>
          {devices.map((device) => {
            const iconName = getIconName(device.type);
            const isOffline = device.status === 'offline';

            return (
              <View
                key={device.id}
                style={[
                  styles.card,
                  isOffline && styles.cardOffline
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.deviceInfoContainer}>
                    <View style={styles.iconWrapper}>
                      <MaterialCommunityIcons name={iconName} size={20} color="#2563eb" />
                    </View>
                    <View>
                      <AppText style={styles.deviceName}>{device.name}</AppText>
                      <AppText style={styles.deviceLocation}>{device.location}</AppText>
                    </View>
                  </View>

                  <View style={[
                    styles.badge,
                    { backgroundColor: device.status === 'online' ? '#22c55e' : '#9ca3af' }
                  ]}>
                    <AppText style={styles.badgeText}>
                      {device.status === 'online' ? 'Online' : 'Offline'}
                    </AppText>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.metricRow}>
                    <View style={styles.metricLabelContainer}>
                      <MaterialCommunityIcons name="thermometer" size={16} color="#6b7280" />
                      <AppText style={styles.metricLabel}>Temperatura</AppText>
                    </View>
                    <AppText style={[
                      styles.tempValue,
                      { color: getTemperatureColor(device.temperature) }
                    ]}>
                      {device.temperature}°C
                    </AppText>
                  </View>

                  {device.humidity !== undefined && (
                    <View style={styles.metricRow}>
                      <View style={styles.metricLabelContainer}>
                        <MaterialCommunityIcons name="water-percent" size={16} color="#6b7280" />
                        <AppText style={styles.metricLabel}>Umidade</AppText>
                      </View>
                      <AppText style={styles.humidityValue}>
                        {device.humidity}%
                      </AppText>
                    </View>
                  )}

                  <View style={styles.footer}>
                    {device.temperature > 24 ? (
                      <View style={styles.trendContainer}>
                        <Feather name="trending-up" size={14} color="#ef4444" />
                        <AppText style={styles.trendTextWarning}>Acima do ideal</AppText>
                      </View>
                    ) : (
                      <View style={styles.trendContainer}>
                        <Feather name="trending-down" size={14} color="#22c55e" />
                        <AppText style={styles.trendTextSuccess}>Temperatura ideal</AppText>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 24,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#374151',
    marginLeft: 8,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardOffline: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  deviceInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    backgroundColor: '#dbeafe', // blue-100
    padding: 8,
    borderRadius: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  deviceLocation: {
    fontSize: 14,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  cardContent: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  tempValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  humidityValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendTextWarning: {
    fontSize: 12,
    color: '#6b7280',
  },
  trendTextSuccess: {
    fontSize: 12,
    color: '#6b7280',
  },
});
