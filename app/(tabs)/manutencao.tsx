import { Feather } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/atoms/AppText';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useTasks } from '@/contexts/TasksContext';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function ManutencaoScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, addTask, toggleTask, deleteTask, isLoading } = useTasks();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { resolvedTheme } = useAppTheme();
  const colors = Colors[resolvedTheme];
  const isDark = resolvedTheme === 'dark';

  const cardBg = isDark ? '#1e293b' : 'white';
  const borderColor = isDark ? '#334155' : '#e5e7eb';
  const inputBg = isDark ? '#1e293b' : 'white';

  const handleAddTask = useCallback(() => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  }, [newTaskTitle, addTask]);

  const pending = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <AppText style={[styles.title, { color: colors.text }]}>Manutenção</AppText>

        <View style={styles.addTaskRow}>
          <TextInput
            style={[styles.input, { color: colors.text, backgroundColor: inputBg, borderColor }]}
            placeholder="Nova tarefa de manutenção..."
            placeholderTextColor={colors.icon}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTask}
            accessibilityLabel="Adicionar tarefa"
            accessibilityRole="button"
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <AppText style={[styles.hint, { color: colors.icon }]}>Carregando tarefas...</AppText>
        ) : tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={52} color={colors.icon} />
            <AppText style={[styles.emptyText, { color: colors.icon }]}>
              Nenhuma tarefa de manutenção.
            </AppText>
          </View>
        ) : (
          <>
            {pending.length > 0 && (
              <>
                <AppText style={[styles.sectionLabel, { color: colors.icon }]}>
                  Pendentes ({pending.length})
                </AppText>
                <View style={styles.list}>
                  {pending.map(task => (
                    <View key={task.id} style={[styles.taskItem, { backgroundColor: cardBg, borderColor }]}>
                      <TouchableOpacity
                        onPress={() => toggleTask(task.id)}
                        accessibilityLabel={`Marcar "${task.title}" como concluída`}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: false }}
                      >
                        <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={24} color="#9ca3af" />
                      </TouchableOpacity>
                      <AppText style={[styles.taskTitle, { color: colors.text }]}>{task.title}</AppText>
                      <TouchableOpacity
                        onPress={() => deleteTask(task.id)}
                        accessibilityLabel={`Deletar "${task.title}"`}
                        accessibilityRole="button"
                      >
                        <Feather name="trash-2" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}

            {done.length > 0 && (
              <>
                <AppText style={[styles.sectionLabel, { color: colors.icon, marginTop: 24 }]}>
                  Concluídas ({done.length})
                </AppText>
                <View style={styles.list}>
                  {done.map(task => (
                    <View key={task.id} style={[styles.taskItem, { backgroundColor: cardBg, borderColor, opacity: 0.65 }]}>
                      <TouchableOpacity
                        onPress={() => toggleTask(task.id)}
                        accessibilityLabel={`Marcar "${task.title}" como pendente`}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: true }}
                      >
                        <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#22c55e" />
                      </TouchableOpacity>
                      <AppText style={[styles.taskTitle, styles.taskDone, { color: colors.icon }]}>
                        {task.title}
                      </AppText>
                      <TouchableOpacity
                        onPress={() => deleteTask(task.id)}
                        accessibilityLabel={`Deletar "${task.title}"`}
                        accessibilityRole="button"
                      >
                        <Feather name="trash-2" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  addTaskRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  input: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  list: { gap: 8 },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  taskTitle: { flex: 1, fontSize: 15 },
  taskDone: { textDecorationLine: 'line-through' },
  emptyState: { alignItems: 'center', marginTop: 64, gap: 12 },
  emptyText: { fontSize: 15, textAlign: 'center' },
  hint: { textAlign: 'center', marginTop: 40 },
});
