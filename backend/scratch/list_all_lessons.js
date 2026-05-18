import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function listAll() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Lesson = mongoose.model('Lesson', new mongoose.Schema({course: String, slug: String, title: String}));
  const lessons = await Lesson.find();
  console.log(JSON.stringify(lessons, null, 2));
  await mongoose.disconnect();
}

listAll();
