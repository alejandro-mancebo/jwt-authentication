import { Router } from 'express';
import UsersController from '../../controllers/usersController.js';
// import { AuthenticateToken } from '../../middleware/authenticateToken.js';

const router = Router();

router.route('/')
  .get(UsersController.getAllUsers)
  .post(UsersController.createNewUser)
  .put(UsersController.updateUser)
  .delete(UsersController.deleteUser);

router.route('/:id')
  .get(UsersController.getUser);

export default router;