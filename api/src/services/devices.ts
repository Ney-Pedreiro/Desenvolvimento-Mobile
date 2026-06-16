import { Device, CreateDeviceRequest, UpdateDeviceRequest } from '../types/index.js';
import { ApiError } from '../utils/errors.js';
import { getPrismaClient } from '../lib/prisma.js';

const prisma = getPrismaClient();

export class DeviceService {
  async getDevices(userId: string): Promise<Device[]> {
    const devices = await prisma.device.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return devices as Device[];
  }

  async getDeviceById(id: string, userId: string): Promise<Device> {
    const device = await prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new ApiError(404, 'DEVICE_NOT_FOUND', 'Device not found');
    }

    if (device.userId !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to access this device');
    }

    return device as Device;
  }

  async createDevice(userId: string, data: CreateDeviceRequest): Promise<Device> {
    // Validar dados
    if (!data.name || !data.location || !data.type) {
      throw new ApiError(400, 'INVALID_INPUT', 'Name, location, and type are required');
    }

    const device = await prisma.device.create({
      data: {
        name: data.name,
        location: data.location,
        type: data.type,
        temperature: data.temperature || 0,
        humidity: data.humidity,
        status: 'offline',
        userId,
      },
    });

    return device as Device;
  }

  async updateDevice(
    id: string,
    userId: string,
    data: UpdateDeviceRequest
  ): Promise<Device> {
    const device = await prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new ApiError(404, 'DEVICE_NOT_FOUND', 'Device not found');
    }

    if (device.userId !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to update this device');
    }

    const updated = await prisma.device.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.location && { location: data.location }),
        ...(data.type && { type: data.type }),
        ...(data.temperature !== undefined && { temperature: data.temperature }),
        ...(data.humidity !== undefined && { humidity: data.humidity }),
        ...(data.status && { status: data.status }),
      },
    });

    return updated as Device;
  }

  async deleteDevice(id: string, userId: string): Promise<void> {
    const device = await prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new ApiError(404, 'DEVICE_NOT_FOUND', 'Device not found');
    }

    if (device.userId !== userId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to delete this device');
    }

    await prisma.device.delete({
      where: { id },
    });
  }
}
