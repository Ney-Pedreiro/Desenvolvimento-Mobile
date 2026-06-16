import { Router } from 'express';
import { TaskController } from '../controllers/tasks.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();
const taskController = new TaskController();

// Aplicar autenticação em todas as rotas
router.use(authMiddleware);

router.get('/', (req, res) => taskController.getTasks(req as any, res));
router.get('/:id', (req, res) => taskController.getTaskById(req as any, res));
router.post('/', (req, res) => taskController.createTask(req as any, res));
router.put('/:id', (req, res) => taskController.updateTask(req as any, res));
router.delete('/:id', (req, res) => taskController.deleteTask(req as any, res));

export default router;
