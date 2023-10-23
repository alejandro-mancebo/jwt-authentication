import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import { connectMongoDB } from './src/config/mongoose.js';
import 'dotenv/config';

import authRoutes from './src/authRoutes/authLoginRoutes.js';

const PORT = process.env.AUTH_SERVER_PORT || 5500;

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());

app.use('/auth', authRoutes);

try {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log('The Authentification Server is running on port:', PORT);
  });
} catch (error) {
  console.log(error)
}
