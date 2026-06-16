import { Router } from 'express';
import { DeviceController } from '../controllers/devices.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
const deviceController = new DeviceController();

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

router.get('/', (req, res) => deviceController.getDevices(req as any, res));
router.get('/:id', (req, res) => deviceController.getDeviceById(req as any, res));
router.post('/', (req, res) => deviceController.createDevice(req as any, res));
router.put('/:id', (req, res) => deviceController.updateDevice(req as any, res));
router.delete('/:id', (req, res) => deviceController.deleteDevice(req as any, res));

export default router;
