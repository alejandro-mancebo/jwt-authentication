import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from "cors";
import cookieParser from 'cookie-parser';
import { connectMongoDB } from './src/config/mongoose.js';


// import authRoutes from './src/authRoutes/authLoginRoutes.js';
import registerRoutes from './src/routes/registerRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import refreshTokenRoutes from './src/routes/refreshTokenRoutes.js';
import logoutRoutes from './src/routes/logoutRoutes.js';

const PORT = process.env.AUTH_SERVER_PORT || 5500;

const app = express();
app.use(bodyParser.json());

// Cors Origin Resourse Sharing
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://localhost:5500',
    'http://localhost:5173',
  ],
  credentials: true
}));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// app.use('/auth', authRoutes);
app.use('/signup', registerRoutes);
app.use('/auth', authRoutes);
app.use('/refresh', refreshTokenRoutes);
app.use('/logout', logoutRoutes);

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
  console.log(error)
}
