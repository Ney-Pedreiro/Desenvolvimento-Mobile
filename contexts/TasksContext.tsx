import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TasksContextData {
  tasks: Task[];
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const TasksContext = createContext<TasksContextData>({} as TasksContextData);
const STORAGE_KEY = '@clima-tech/tasks';

export function TasksProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch {
      return null;
    }
  };

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) {
        setTasks([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.data || []);
        // Cache localmente
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data.data || []));
      } else {
        // Se falhar, tentar carregar do cache local
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          setTasks(JSON.parse(cached));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
      setError('Erro ao carregar tarefas');
      // Carregar do cache se houver
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          setTasks(JSON.parse(cached));
        }
      } catch {
        setTasks([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Buscar tarefas ao iniciar e quando autenticação muda
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchTasks]);

  const addTask = useCallback(async (title: string) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar tarefa');
      }

      const result = await response.json();
      setTasks(prev => [...prev, result.data]);
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      throw err;
    }
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar tarefa');
      }

      const result = await response.json();
      setTasks(prev => prev.map(t => t.id === id ? result.data : t));
    } catch (err) {
      console.error('Erro ao marcar tarefa:', err);
      throw err;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar tarefa');
      }

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Erro ao remover tarefa:', err);
      throw err;
    }
  }, []);

  return (
    <TasksContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        toggleTask, 
        deleteTask, 
        isLoading,
        error,
        refetch: fetchTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de um TasksProvider');
  }
  return context;
}
