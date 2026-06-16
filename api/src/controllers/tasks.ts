import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { CreateTaskRequest, UpdateTaskRequest } from '../types/index.js';
import { TaskService } from '../services/tasks.js';
import { ApiError } from '../utils/errors.js';

const taskService = new TaskService();

export class TaskController {
  async getTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const tasks = await taskService.getTasks(userId);

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const task = await taskService.getTaskById(id, userId);

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const { title } = req.body as CreateTaskRequest;

      const task = await taskService.createTask(userId, { title });

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const data = req.body as UpdateTaskRequest;

      const task = await taskService.updateTask(id, userId, data);

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      await taskService.deleteTask(id, userId);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
