import { Router } from 'express';
import LogoutController from '../controllers/logoutController.js';

const router = Router();

router.post('/', LogoutController.handleLogout);

export default router;