import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Question = mongoose.model('Question', new mongoose.Schema({ topicId: String }));
  const counts = await Question.aggregate([
    { $group: { _id: '$topicId', count: { $sum: 1 } } }
  ]);
  console.log('Question counts by Topic:', counts);
  process.exit(0);
}

check();
