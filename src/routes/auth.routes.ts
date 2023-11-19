import { Router } from 'express';
import { loginTrainer, createTrainer } from '../controllers/auth/trainer';
import { loginUser, createUser } from '../controllers/auth/user';
import middleware from '../middleware';

const router = Router();
router.put('/trainer', loginTrainer);
router.post('/trainer', createTrainer);
router.put('/user', loginUser);
router.post('/user', middleware.trainer, createUser);

export default router;
