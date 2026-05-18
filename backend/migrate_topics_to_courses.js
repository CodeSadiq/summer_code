import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    // 1. Migrate Topics to Courses
    console.log('Migrating Topics to Courses...');
    const topics = await db.collection('topics').find().toArray();
    if (topics.length > 0) {
      // Mongoose model "Course" uses the "courses" collection
      await db.collection('courses').insertMany(topics);
      console.log(`✅ Migrated ${topics.length} topics to courses.`);
    } else {
      console.log('ℹ️ No topics found to migrate.');
    }

    // 2. Update Questions (topicId -> courseId)
    console.log('Updating Questions: topicId -> courseId...');
    const qResult = await db.collection('questions').updateMany(
      { topicId: { $exists: true } },
      [
        { $set: { courseId: '$topicId' } },
        { $unset: 'topicId' }
      ]
    );
    console.log(`✅ Updated ${qResult.modifiedCount} questions.`);

    // 3. Update Progress (topicId -> courseId)
    console.log('Updating Progress: topicId -> courseId...');
    const pResult = await db.collection('progresses').updateMany(
      { topicId: { $exists: true } },
      [
        { $set: { courseId: '$topicId' } },
        { $unset: 'topicId' }
      ]
    );
    console.log(`✅ Updated ${pResult.modifiedCount} progress records.`);

    console.log('\nMigration complete! You can now delete the "topics" collection safely if everything looks good.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
