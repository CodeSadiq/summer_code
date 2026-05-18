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
  
  const db = mongoose.connection.db;

  const topicsCount = await db.collection('topics').countDocuments();
  const coursesCount = await db.collection('courses').countDocuments();
  const questionsCount = await db.collection('questions').countDocuments();
  const lessonsCount = await db.collection('lessons').countDocuments();

  console.log('\nCounts:');
  console.log('Old Topics:', topicsCount);
  console.log('New Courses:', coursesCount);
  console.log('Questions:', questionsCount);
  console.log('Lessons:', lessonsCount);

  if (questionsCount === 0) {
    console.log('\nChecking if questions are in a different collection...');
    const collections = await db.listCollections().toArray();
    console.log('Available Collections:', collections.map(c => c.name));
  }

  await mongoose.disconnect();
}

verifyMigration();
