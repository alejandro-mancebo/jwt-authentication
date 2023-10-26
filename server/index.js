import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from "cors";
import { connectMongoDB } from './src/config/mongoose.js';

import routes from './src/routes/api/users.js';
// import usersRoutes from './src/routes/api/userRoutes.js';
import cookieParser from 'cookie-parser';
import { AuthenticateToken } from './src/middleware/authenticateToken.js';

const PORT = process.env.SERVER_PORT || 5000;

const app = express();
app.use(bodyParser.json());

// Cors Origin Resourse Sharing
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// Verify Authorize token for the following APIs
app.use(AuthenticateToken);

// Api
app.use('/users', routes);
app.use('/user-profile', routes);

// catch error from the previous middlewares
app.use((error, request, response, next) => {

  // skip if error has sent in response already
  if (response.headersSent) { return next(error); }

  // response catched error
  response
    .status(error.code || 500)
    .json({ message: error.message || 'An unknow error occurred!' });
});

try {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log('The server is running on port:', PORT);
  });
} catch (error) {
  console.log(error)
}
