import { Router } from 'express';
import RegisterController from '../controllers/registerController.js';

const router = Router();

router.post('/', RegisterController.handleSignUp);

export default router;