import { Router } from 'express';
import AuthController from '../controllers/authController.js';

const router = Router();

router.post('/', AuthController.handleLogin);

export default router;