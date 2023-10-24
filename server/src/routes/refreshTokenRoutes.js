import { Router } from 'express';
import RefreshTokenController from '../controllers/refreshTokenController.js';

const router = Router();

router.get('/', RefreshTokenController.handleRefreshToken);

export default router;