import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import { connectMongoDB } from './src/config/mongoose.js';
import 'dotenv/config';

// import routes from './src/routes/index.js';
import usersRoutes from './src/routes/userRoutes.js';

const PORT = process.env.SERVER_PORT || 5000;

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());

//Note: Fix the index router
// app.use('/api', routes);
app.use('/api', usersRoutes);

try {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log('The server is running on port:', PORT);
  });
} catch (error) {
  console.log(error)
}
