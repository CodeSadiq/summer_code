import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function verifyMigration() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Lesson = mongoose.model('Lesson', new mongoose.Schema({}, { strict: false }));

  const htmlLesson = await Lesson.findOne({ course: 'HTML' });
  console.log('\nHTML Lesson:', htmlLesson ? 'Found' : 'Not Found');
  
  const jsLesson = await Lesson.findOne({ course: 'JavaScript' });
  console.log('JavaScript Lesson:', jsLesson ? 'Found' : 'Not Found');

  const jsLessonById = await Lesson.findOne({ course: 'JS' });
  console.log('JS Lesson:', jsLessonById ? 'Found' : 'Not Found');

  await mongoose.disconnect();
}

verifyMigration();
