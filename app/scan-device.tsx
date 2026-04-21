import { Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atoms/AppText';
import { Button } from '@/components/atoms/Button';
import { useDevices, type Device } from '@/contexts/DevicesContext';

export default function ScanDeviceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addDevice } = useDevices();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleScan = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return;
      setScanned(true);

      let name = `Sensor ${data.slice(0, 8)}`;
      let location = 'Não definido';
      let type: Device['type'] = 'temperature';

      try {
        const parsed = JSON.parse(data);
        if (parsed.name) name = parsed.name;
        if (parsed.location) location = parsed.location;
        if (parsed.type === 'climate' || parsed.type === 'weather' || parsed.type === 'temperature') {
          type = parsed.type;
        }
      } catch {
        // usa o raw data como ID, valores padrão
      }

      addDevice({ name, location, type });
      Alert.alert('Dispositivo adicionado!', `"${name}" foi configurado com sucesso.`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    },
    [scanned, addDevice, router]
  );

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { paddingTop: insets.top + 20 }]}>
        <Feather name="camera-off" size={56} color="#6b7280" />
        <AppText style={styles.permissionTitle}>Acesso à câmera necessário</AppText>
        <AppText style={styles.permissionText}>
          Precisamos da câmera para escanear o QR code do dispositivo.
        </AppText>
        <Button title="Permitir câmera" onPress={requestPermission} style={styles.permissionButton} />
        <Button
          title="Cancelar"
          variant="outline"
          onPress={() => router.back()}
          style={styles.permissionButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      {/* overlay escurecido nas bordas */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={[styles.closeButton, { marginTop: insets.top + 10 }]}
          onPress={() => router.back()}
          accessibilityLabel="Fechar scanner"
          accessibilityRole="button"
        >
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            {/* cantos decorativos */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <AppText style={styles.scanHint}>
            Aponte para o QR code do dispositivo
          </AppText>
        </View>

        {scanned && (
          <TouchableOpacity
            style={[styles.rescanButton, { marginBottom: insets.bottom + 16 }]}
            onPress={() => setScanned(false)}
          >
            <Feather name="rotate-ccw" size={18} color="white" />
            <AppText style={styles.rescanText}>Escanear novamente</AppText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const CORNER_SIZE = 22;
const CORNER_THICKNESS = 3;
const CORNER_COLOR = '#2563eb';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f0f7ff',
    gap: 12,
  },
  permissionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', textAlign: 'center' },
  permissionText: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
  permissionButton: { width: '100%', marginTop: 4 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  closeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 10,
    borderRadius: 24,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  scanFrame: {
    width: 230,
    height: 230,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: CORNER_COLOR,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderBottomRightRadius: 4 },
  scanHint: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  rescanText: { color: 'white', fontWeight: '600', fontSize: 15 },
});
