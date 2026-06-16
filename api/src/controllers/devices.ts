import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { CreateDeviceRequest, UpdateDeviceRequest } from '../types/index.js';
import { DeviceService } from '../services/devices.js';
import { ApiError } from '../utils/errors.js';

const deviceService = new DeviceService();

export class DeviceController {
  async getDevices(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const devices = await deviceService.getDevices(userId);

      res.status(200).json({
        success: true,
        data: devices,
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

  async getDeviceById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const device = await deviceService.getDeviceById(id, userId);

      res.status(200).json({
        success: true,
        data: device,
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

  async createDevice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const { name, location, type, temperature, humidity } = req.body as CreateDeviceRequest;

      const device = await deviceService.createDevice(userId, {
        name,
        location,
        type,
        temperature,
        humidity,
      });

      res.status(201).json({
        success: true,
        data: device,
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

  async updateDevice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      const data = req.body as UpdateDeviceRequest;

      const device = await deviceService.updateDevice(id, userId, data);

      res.status(200).json({
        success: true,
        data: device,
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

  async deleteDevice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(401, 'UNAUTHORIZED', 'User not authenticated');
      }

      await deviceService.deleteDevice(id, userId);

      res.status(200).json({
        success: true,
        message: 'Device deleted successfully',
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
