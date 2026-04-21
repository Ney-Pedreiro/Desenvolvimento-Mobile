import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Device {
  id: string;
  name: string;
  location: string;
  temperature: number;
  humidity?: number;
  status: 'online' | 'offline';
  type: 'temperature' | 'weather' | 'climate';
}

interface DevicesContextData {
  devices: Device[];
  addDevice: (data: { name: string; location: string; type: Device['type'] }) => void;
  updateDevice: (id: string, data: { name: string; location: string; type: Device['type'] }) => void;
  removeDevice: (id: string) => void;
  isLoading: boolean;
}

const DevicesContext = createContext<DevicesContextData>({} as DevicesContextData);
const STORAGE_KEY = '@clima-tech/devices';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const INITIAL_DEVICES: Device[] = [
  { id: '1', name: 'Sensor Sala', location: 'Sala de Estar', temperature: 23.5, humidity: 45, status: 'online', type: 'climate' },
  { id: '2', name: 'Sensor Quarto', location: 'Quarto Principal', temperature: 21.2, humidity: 50, status: 'online', type: 'climate' },
  { id: '3', name: 'Sensor Cozinha', location: 'Cozinha', temperature: 26.8, status: 'online', type: 'temperature' },
];

export function DevicesProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => setDevices(raw ? JSON.parse(raw) : INITIAL_DEVICES))
      .catch(() => setDevices(INITIAL_DEVICES))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(devices)).catch(console.error);
    }
  }, [devices, isLoading]);

  const addDevice = useCallback((data: { name: string; location: string; type: Device['type'] }) => {
    setDevices(prev => [...prev, {
      ...data,
      id: generateId(),
      temperature: 0,
      status: 'online',
    }]);
  }, []);

  const updateDevice = useCallback((id: string, data: { name: string; location: string; type: Device['type'] }) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  }, []);

  const removeDevice = useCallback((id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  }, []);

  return (
    <DevicesContext.Provider value={{ devices, addDevice, updateDevice, removeDevice, isLoading }}>
      {children}
    </DevicesContext.Provider>
  );
}

export function useDevices() {
  const ctx = useContext(DevicesContext);
  if (!ctx) throw new Error('useDevices deve ser usado dentro de DevicesProvider');
  return ctx;
}
