import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from "cors";
import corsOptions from './src/config/corsOptions.js';
import cookieParser from 'cookie-parser';
import { connectMongoDB } from './src/config/mongoose.js';
import credentials from './src/middleware/credentials.js';

// Public API routes
// import authRoutes from './src/authRoutes/authLoginRoutes.js';
import registerRoutes from './src/routes/registerRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import refreshTokenRoutes from './src/routes/refreshTokenRoutes.js';
import logoutRoutes from './src/routes/logoutRoutes.js';

// Private API routes
import routes from './src/routes/api/users.js';
// import usersRoutes from './src/routes/api/userRoutes.js';
import { AuthenticateToken } from './src/middleware/authenticateToken.js';

const PORT = process.env.AUTH_SERVER_PORT || 5000;

const app = express();
app.use(bodyParser.json());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cors Origin Resourse Sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// app.use('/auth', authRoutes);
app.use('/signup', registerRoutes);
app.use('/auth', authRoutes);
app.use('/refresh', refreshTokenRoutes);
app.use('/logout', logoutRoutes);

// Verify Authorize token for the following APIs
app.use(AuthenticateToken);

// Api
app.use('/users', routes);
// app.use('/user-profile', routes);

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
    console.log('The Authentification Server is running on port:', PORT);
  });
} catch (error) {
  console.error('connectMongoDB:', error.message)
}
