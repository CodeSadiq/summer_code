import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const courseSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  englishDescription: String,
}, { strict: false });

const Course = mongoose.model('Course', courseSchema);

async function seedEnglishDescriptions() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Updating courses with English descriptions...');
    
    const courses = await Course.find();
    
    for (let course of courses) {
      if (!course.englishDescription) {
        course.englishDescription = `Master the essentials of ${course.name} from scratch with hands-on practice.`;
        await course.save();
        console.log(`Updated course ${course.name}`);
      }
    }
    
    console.log('Successfully seeded English descriptions!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedEnglishDescriptions();
