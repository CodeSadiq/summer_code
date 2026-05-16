import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkDB() {
  console.log('Connecting to:', process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI);
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  const q = await Question.findOne({ topicId: 'HTML' });
  console.log('Sample Question from DB:', JSON.stringify(q, null, 2));
  await mongoose.disconnect();
}

checkDB();
