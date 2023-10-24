import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import { connectMongoDB } from './src/config/mongoose.js';
import 'dotenv/config';

// import authRoutes from './src/authRoutes/authLoginRoutes.js';
import registerRoutes from './src/routes/registerRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import refreshTokenRouter from './src/routes/refreshTokenRoutes.js';

const PORT = process.env.AUTH_SERVER_PORT || 5500;

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());

// app.use('/auth', authRoutes);
app.use('/register', registerRoutes);
app.use('/auth', authRoutes);
app.use('/refresh', refreshTokenRouter);


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
