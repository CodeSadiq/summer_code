import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const lessonSchema = new mongoose.Schema({
  title: String,
  slug: String,
  course: String,
  chapterOrder: Number,
});

const Lesson = mongoose.model('Lesson', lessonSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const lessons = await Lesson.find({ course: 'CSS' }).sort({ chapterOrder: 1 });
  console.log(JSON.stringify(lessons, null, 2));
  process.exit(0);
}

check();
