import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
