import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.get('/verify', authMiddleware, (req, res) => authController.verify(req, res));

export default router;
