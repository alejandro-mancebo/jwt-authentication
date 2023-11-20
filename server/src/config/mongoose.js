import mongoose from 'mongoose';
import 'dotenv/config';

export const connectMongoDB = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGO_DB_CLOUD_URL)
    .then(() => {
      console.log('Connected to MongoDB Successfully!');
    })
    .catch((error) => {
      console.error(error.message);
    });
}
