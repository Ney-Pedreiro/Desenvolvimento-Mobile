import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface Device {
  id: string;
  name: string;
  location: string;
  temperature: number;
  humidity?: number;
  status: 'online' | 'offline';
  type: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DevicesContextData {
  devices: Device[];
  addDevice: (data: { name: string; location: string; type: string }) => Promise<void>;
  updateDevice: (id: string, data: { name: string; location: string; type: string }) => Promise<void>;
  removeDevice: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DevicesContext = createContext<DevicesContextData>({} as DevicesContextData);
const STORAGE_KEY = '@clima-tech/devices';

export function DevicesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch {
      return null;
    }
  };

  const fetchDevices = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setDevices([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/devices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDevices(data.data || []);
        // Cache localmente
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data.data || []));
      } else {
        // Se falhar, tentar carregar do cache local
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          setDevices(JSON.parse(cached));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dispositivos:', err);
      setError('Erro ao carregar dispositivos');
      // Carregar do cache se houver
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          setDevices(JSON.parse(cached));
        }
      } catch {
        setDevices([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Buscar dispositivos ao iniciar e quando autenticação muda
  useEffect(() => {
    if (isAuthenticated) {
      fetchDevices();
    } else {
      setDevices([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchDevices]);

  const addDevice = useCallback(async (data: { name: string; location: string; type: string }) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/api/devices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar dispositivo');
      }

      const result = await response.json();
      setDevices(prev => [...prev, result.data]);
    } catch (err) {
      console.error('Erro ao adicionar dispositivo:', err);
      throw err;
    }
  }, []);

  const updateDevice = useCallback(async (id: string, data: { name: string; location: string; type: string }) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/api/devices/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar dispositivo');
      }

      const result = await response.json();
      setDevices(prev => prev.map(d => d.id === id ? result.data : d));
    } catch (err) {
      console.error('Erro ao atualizar dispositivo:', err);
      throw err;
    }
  }, []);

  const removeDevice = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/api/devices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar dispositivo');
      }

      setDevices(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Erro ao remover dispositivo:', err);
      throw err;
    }
  }, []);

  return (
    <DevicesContext.Provider 
      value={{ 
        devices, 
        addDevice, 
        updateDevice, 
        removeDevice, 
        isLoading,
        error,
        refetch: fetchDevices,
      }}
    >
      {children}
    </DevicesContext.Provider>
  );
}

export function useDevices() {
  const ctx = useContext(DevicesContext);
  if (!ctx) throw new Error('useDevices deve ser usado dentro de DevicesProvider');
  return ctx;
}
