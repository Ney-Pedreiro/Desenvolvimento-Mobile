import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { InputWithLabel } from '@/components/molecules/InputWithLabel';

export default function AddDeviceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [deviceId, setDeviceId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('temperature');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!deviceId || !name || !location) {
        Alert.alert("Erro", "Por favor preencha todos os campos obrigatórios.");
        return;
    }

    setLoading(true);
    // Mock device creation
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Sucesso",
        `${name} foi configurado e está pronto para uso.`,
        [{ text: "OK", onPress: () => router.replace('/(tabs)') }]
      );
    }, 1000);
  };

  const types = [
    { label: 'Temperatura', value: 'temperature' },
    { label: 'Clima (Temp + Umid)', value: 'climate' },
    { label: 'Meteorológico (Externo)', value: 'weather' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.headerNav, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backLink}
        >
          <Feather name="arrow-left" size={20} color="#2563eb" />
          <AppText style={styles.backLinkText}>Voltar ao Dashboard</AppText>
        </TouchableOpacity>
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
                <MaterialCommunityIcons name="thermometer" size={24} color="white" />
              </View>
              <View style={styles.headerTextContainer}>
                <AppText style={styles.title}>Adicionar Novo Dispositivo</AppText>
                <AppText style={styles.description}>
                  Configure um novo sensor IoT para monitoramento
                </AppText>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldContainer}>
                <InputWithLabel
                  label="ID do Dispositivo"
                  placeholder="Ex: SENSOR-001"
                  value={deviceId}
                  onChangeText={setDeviceId}
                />
                <AppText style={styles.hintText}>
                  Identificador único do dispositivo (geralmente encontrado na etiqueta)
                </AppText>
              </View>

              <View style={styles.fieldContainer}>
                <InputWithLabel
                  label="Nome do Dispositivo"
                  placeholder="Ex: Sensor Sala"
                  value={name}
                  onChangeText={setName}
                />
                <AppText style={styles.hintText}>
                  Um nome amigável para identificar o dispositivo
                </AppText>
              </View>

              <View style={styles.fieldContainer}>
                <InputWithLabel
                  label="Localização"
                  placeholder="Ex: Sala de Estar"
                  value={location}
                  onChangeText={setLocation}
                />
                <AppText style={styles.hintText}>
                  Onde o dispositivo está instalado
                </AppText>
              </View>

              <View style={styles.fieldContainer}>
                <AppText style={styles.label}>Tipo de Sensor</AppText>
                <View style={styles.typeSelector}>
                  {types.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[
                        styles.typeOption,
                        type === t.value && styles.typeOptionSelected
                      ]}
                      onPress={() => setType(t.value)}
                    >
                      <AppText style={[
                        styles.typeOptionText,
                        type === t.value && styles.typeOptionTextSelected
                      ]}>
                        {t.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
                <AppText style={styles.hintText}>
                  Escolha o tipo baseado nas funcionalidades do sensor
                </AppText>
              </View>

              <View style={styles.instructionsBox}>
                <AppText style={styles.instructionsTitle}>Instruções de Configuração</AppText>
                <View style={styles.instructionItem}>
                  <AppText style={styles.instructionText}>1. Conecte o dispositivo à fonte de energia</AppText>
                </View>
                <View style={styles.instructionItem}>
                  <AppText style={styles.instructionText}>2. Aguarde o LED azul piscar indicando modo de pareamento</AppText>
                </View>
                <View style={styles.instructionItem}>
                  <AppText style={styles.instructionText}>3. Preencha o formulário acima com as informações</AppText>
                </View>
                <View style={styles.instructionItem}>
                  <AppText style={styles.instructionText}>4. Clique em "Adicionar Dispositivo" para finalizar</AppText>
                </View>
              </View>

              <View style={styles.footer}>
                <Button
                  title="Adicionar Dispositivo"
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.submitButton}
                />
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={() => router.back()}
                  style={styles.cancelButton}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f7ff',
  },
  headerNav: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  backLinkText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
  },
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  iconContainer: {
    backgroundColor: '#2563eb',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
  },
  form: {
    gap: 20,
  },
  fieldContainer: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  typeSelector: {
    gap: 8,
  },
  typeOption: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  typeOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  typeOptionTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  instructionsBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  instructionItem: {
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 12,
    color: '#1e3a8a',
    lineHeight: 18,
  },
  footer: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#2563eb',
  },
  cancelButton: {
    borderColor: '#e5e7eb',
  },
});
