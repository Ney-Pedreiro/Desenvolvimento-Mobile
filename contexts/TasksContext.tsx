import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TasksContextData {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  isLoading: boolean;
}

const TasksContext = createContext<TasksContextData>({} as TasksContextData);

const STORAGE_KEY = '@clima-tech/tasks';

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    async function loadTasks() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setTasks(JSON.parse(raw));
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, isLoading }}>
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
