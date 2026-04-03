import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins temporarily for troubleshooting
app.use(express.json());

// Serve uploaded audio files as static
const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  console.log('Creating audio directory:', audioDir);
  fs.mkdirSync(audioDir, { recursive: true });
}
app.use('/audio', express.static(audioDir));

// Multer: save audio to server/public/audio/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, audioDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const ext = path.extname(file.originalname);
    cb(null, `audio-${unique}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50 MB max

// Upload audio for a block's teaching script
app.post('/api/admin/upload-audio', upload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received' });
  const audioUrl = `http://localhost:${PORT}/audio/${req.file.filename}`;
  res.json({ success: true, audioUrl, filename: req.file.filename });
});

// For now, load from JSON file to make it work offline / without DB set up easily
const lessonsDataPath = path.join(__dirname, 'data', 'lessons.json');

app.get('/api/lessons', (req, res) => {
  try {
    const rawData = fs.readFileSync(lessonsDataPath);
    const lessons = JSON.parse(rawData);
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load lessons' });
  }
});

app.get('/api/lessons/:slug', (req, res) => {
  try {
    const rawData = fs.readFileSync(lessonsDataPath);
    const lessons = JSON.parse(rawData);
    const lesson = lessons.find(l => l.slug === req.params.slug);
    
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load lesson' });
  }
});

app.post('/api/admin/save-lesson', (req, res) => {
  try {
    const newLesson = req.body;
    const rawData = fs.readFileSync(lessonsDataPath);
    let lessons = JSON.parse(rawData);
    
    const index = lessons.findIndex(l => l.slug === newLesson.slug);
    if (index >= 0) {
      lessons[index] = newLesson;
    } else {
      lessons.push(newLesson);
    }
    
    fs.writeFileSync(lessonsDataPath, JSON.stringify(lessons, null, 2));
    res.json({ success: true, lesson: newLesson });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save lesson' });
  }
});

app.delete('/api/admin/delete-lesson/:slug', (req, res) => {
  try {
    const rawData = fs.readFileSync(lessonsDataPath);
    let lessons = JSON.parse(rawData);
    const filtered = lessons.filter(l => l.slug !== req.params.slug);
    fs.writeFileSync(lessonsDataPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

app.put('/api/admin/reorder-lessons', (req, res) => {
  try {
    const { slugs } = req.body;
    const rawData = fs.readFileSync(lessonsDataPath);
    let lessons = JSON.parse(rawData);
    const reordered = slugs.map((slug, i) => {
      const lesson = lessons.find(l => l.slug === slug);
      return { ...lesson, chapterOrder: i + 1 };
    });
    fs.writeFileSync(lessonsDataPath, JSON.stringify(reordered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder lessons' });
  }
});

const topicsDataPath = path.join(__dirname, 'data', 'topics.json');

app.get('/api/topics', (req, res) => {
  try {
    const rawData = fs.readFileSync(topicsDataPath);
    const topics = JSON.parse(rawData);
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load topics' });
  }
});

app.post('/api/admin/save-topic', (req, res) => {
  try {
    const newTopic = req.body;
    const rawData = fs.readFileSync(topicsDataPath);
    let topics = JSON.parse(rawData);
    
    const index = topics.findIndex(t => t.id === newTopic.id);
    if (index >= 0) {
      topics[index] = newTopic;
    } else {
      topics.push(newTopic);
    }
    
    fs.writeFileSync(topicsDataPath, JSON.stringify(topics, null, 2));
    res.json({ success: true, topic: newTopic });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save topic' });
  }
});

app.delete('/api/admin/delete-topic/:topicId', (req, res) => {
  try {
    const { topicId } = req.params;
    const rawData = fs.readFileSync(topicsDataPath);
    let topics = JSON.parse(rawData);
    
    topics = topics.filter(t => t.id !== topicId);
    
    fs.writeFileSync(topicsDataPath, JSON.stringify(topics, null, 2));
    res.json({ success: true, topicId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
