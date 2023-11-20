import { Router } from 'express';
import UsersController from '../../controllers/usersController.js';

const router = Router();

router.route('/')
  .get(UsersController.getAllUsers)
  .post(UsersController.createNewUser)
  .put(UsersController.updateUser)


router.route('/:id')
  .delete(UsersController.deleteUser);

router.route('/:id')
  .get(UsersController.getUser);

export default router;