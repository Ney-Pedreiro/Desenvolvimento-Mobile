import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/index.js';
import { ApiError } from '../utils/errors.js';
import { getPrismaClient } from '../lib/prisma.js';

const prisma = getPrismaClient();

export class TaskService {
  async getTasks(userId: string): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return tasks as Task[];
  }

  async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new ApiError(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    if (task.userId !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to access this task');
    }

    return task as Task;
  }

  async createTask(userId: string, data: CreateTaskRequest): Promise<Task> {
    // Validar dados
    if (!data.title) {
      throw new ApiError(400, 'INVALID_INPUT', 'Title is required');
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        completed: false,
        userId,
      },
    });

    return task as Task;
  }

  async updateTask(
    id: string,
    userId: string,
    data: UpdateTaskRequest
  ): Promise<Task> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new ApiError(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    if (task.userId !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to update this task');
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.completed !== undefined && { completed: data.completed }),
      },
    });

    return updated as Task;
  }

  async deleteTask(id: string, userId: string): Promise<void> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new ApiError(404, 'TASK_NOT_FOUND', 'Task not found');
    }

    if (task.userId !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to delete this task');
    }

    await prisma.task.delete({
      where: { id },
    });
  }
}
