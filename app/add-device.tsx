import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { InputWithLabel } from '@/components/molecules/InputWithLabel';
import { useDevices, type Device } from '@/contexts/DevicesContext';
import { useThemeColor } from '@/hooks/use-theme-color';

type SensorType = Device['type'];

const TYPES: { label: string; value: SensorType }[] = [
  { label: 'Temperatura', value: 'temperature' },
  { label: 'Clima (Temp + Umid)', value: 'climate' },
  { label: 'Meteorológico (Externo)', value: 'weather' },
];

export default function AddDeviceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { deviceId } = useLocalSearchParams<{ deviceId?: string }>();
  const { addDevice, updateDevice, devices } = useDevices();

  const isEditing = Boolean(deviceId);
  const existing = isEditing ? devices.find(d => d.id === deviceId) : undefined;
  const cancelTextColor = useThemeColor({ dark: '#0a7ea4' }, 'tint');

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<SensorType>('temperature');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setLocation(existing.location);
      setType(existing.type);
    }
  }, [existing]);

  const handleSubmit = () => {
    if (!name || !location) {
      Alert.alert('Erro', 'Por favor preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (isEditing && deviceId) {
        updateDevice(deviceId, { name, location, type });
        setLoading(false);
        Alert.alert(
          'Sucesso',
          `${name} foi atualizado com sucesso.`,
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        addDevice({ name, location, type });
        setLoading(false);
        Alert.alert(
          'Sucesso',
          `${name} foi adicionado e está pronto para uso.`,
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    }, 800);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerNav, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backLink}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={20} color="#2563eb" />
          <AppText style={styles.backLinkText}>Voltar</AppText>
        </TouchableOpacity>

        {!isEditing && (
          <TouchableOpacity
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPress={() => router.push('/scan-device' as any)}
            style={styles.qrButton}
            accessibilityLabel="Escanear QR code do dispositivo"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="qrcode-scan" size={22} color="#2563eb" />
            <AppText style={styles.qrButtonText}>Escanear QR</AppText>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={isEditing ? 'pencil' : 'thermometer'}
                  size={24}
                  color="white"
                />
              </View>
              <View style={styles.headerText}>
                <AppText style={styles.title}>
                  {isEditing ? 'Editar Dispositivo' : 'Adicionar Dispositivo'}
                </AppText>
                <AppText style={styles.description}>
                  {isEditing
                    ? 'Atualize as informações do sensor'
                    : 'Configure um novo sensor IoT para monitoramento'}
                </AppText>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldContainer}>
                <InputWithLabel
                  label="Nome do Dispositivo"
                  placeholder="Ex: Sensor Sala"
                  value={name}
                  onChangeText={setName}
                />
                <AppText style={styles.hint}>Um nome amigável para identificar o dispositivo</AppText>
              </View>

              <View style={styles.fieldContainer}>
                <InputWithLabel
                  label="Localização"
                  placeholder="Ex: Sala de Estar"
                  value={location}
                  onChangeText={setLocation}
                />
                <AppText style={styles.hint}>Onde o dispositivo está instalado</AppText>
              </View>

              <View style={styles.fieldContainer}>
                <AppText style={styles.label}>Tipo de Sensor</AppText>
                <View style={styles.typeSelector}>
                  {TYPES.map(t => (
                    <TouchableOpacity
                      key={t.value}
                      style={[styles.typeOption, type === t.value && styles.typeSelected]}
                      onPress={() => setType(t.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: type === t.value }}
                    >
                      <AppText style={[styles.typeText, type === t.value && styles.typeTextSelected]}>
                        {t.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {!isEditing && (
                <View style={styles.instructionsBox}>
                  <AppText style={styles.instructionsTitle}>Instruções de Configuração</AppText>
                  {[
                    '1. Conecte o dispositivo à fonte de energia',
                    '2. Aguarde o LED azul piscar (modo de pareamento)',
                    '3. Preencha o formulário ou escaneie o QR code',
                    '4. Clique em "Adicionar Dispositivo" para finalizar',
                  ].map((step, i) => (
                    <AppText key={i} style={styles.instructionText}>{step}</AppText>
                  ))}
                </View>
              )}

              <Button
                title={isEditing ? 'Salvar Alterações' : 'Adicionar Dispositivo'}
                onPress={handleSubmit}
                loading={loading}
                style={styles.submitButton}
              />
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => router.back()}
                style={styles.cancelButton}
                textStyle={{ color: cancelTextColor }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f7ff' },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  backLinkText: { fontSize: 14, color: '#2563eb', fontWeight: '500' },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  qrButtonText: { fontSize: 14, color: '#2563eb', fontWeight: '600' },
  scrollContent: { padding: 20 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  iconContainer: {
    backgroundColor: '#2563eb',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  description: { fontSize: 13, color: '#6b7280' },
  form: { gap: 20 },
  fieldContainer: { gap: 4 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 },
  hint: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  typeSelector: { gap: 8 },
  typeOption: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  typeSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  typeText: { fontSize: 14, color: '#374151' },
  typeTextSelected: { color: '#2563eb', fontWeight: '600' },
  instructionsBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  instructionsTitle: { fontSize: 14, fontWeight: '600', color: '#1e40af', marginBottom: 4 },
  instructionText: { fontSize: 12, color: '#1e3a8a', lineHeight: 20 },
  submitButton: { backgroundColor: '#2563eb' },
  cancelButton: { borderColor: '#e5e7eb' },
});
