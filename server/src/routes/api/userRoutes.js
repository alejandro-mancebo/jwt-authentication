import { Router } from 'express';
import { AuthenticateToken } from '../../middleware/authenticateToken.js';

import { users } from '../../data/users.data.js';

const usersRouter = Router();


// usersRouter.get('/users', (request, response) => {
//   response.json(users);
// });


// usersRouter.get('/user', AuthenticateToken, (request, response) => {
//   response.json(users.filter(user => user.email == request.user.email));
// });

export default usersRouter;

