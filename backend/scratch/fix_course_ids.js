import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function fixData() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Lesson = mongoose.model('Lesson', new mongoose.Schema({}, { strict: false }));
  const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));

  // 1. Fix JavaScript lessons: 'JavaScript' -> 'JS'
  console.log('Updating JavaScript lessons...');
  const res1 = await Lesson.updateMany({ course: 'JavaScript' }, { $set: { course: 'JS' } });
  console.log(`Updated ${res1.modifiedCount} lessons.`);

  // 2. Fix C lessons if needed (Name is 'C Programming', ID is 'C')
  console.log('Updating C lessons...');
  const res2 = await Lesson.updateMany({ course: 'C Programming' }, { $set: { course: 'C' } });
  console.log(`Updated ${res2.modifiedCount} lessons.`);

  // 3. Ensure questions also use the correct courseId
  console.log('Updating questions...');
  const res3 = await Question.updateMany({ courseId: 'JavaScript' }, { $set: { courseId: 'JS' } });
  console.log(`Updated ${res3.modifiedCount} questions (JS).`);
  
  const res4 = await Question.updateMany({ courseId: 'C Programming' }, { $set: { courseId: 'C' } });
  console.log(`Updated ${res4.modifiedCount} questions (C).`);

  await mongoose.disconnect();
  console.log('Done.');
}

fixData();
