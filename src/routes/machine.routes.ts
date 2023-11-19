import { Router } from 'express';
import { postMachine, getMachine } from '../controllers/machines';
import _middleware from '../middleware';

const router = Router();

router.get('/', getMachine);
router.post('/', _middleware.trainer, postMachine);

export default router;
