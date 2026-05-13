import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const questionSchema = new mongoose.Schema({
  topicId: String,
  lessonId: String,
  type: { type: String, enum: ['mcq', 'output', 'debug', 'coding'] },
  question: String,
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

async function clear() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Question.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} questions!`);
    process.exit();
  } catch (err) {
    console.error('Clearing failed:', err);
    process.exit(1);
  }
}

clear();
