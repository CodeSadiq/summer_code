import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('📡 Starting backend...');
console.log('🔗 MONGODB_URI:', process.env.MONGODB_URI ? 'Detected (ends with ...' + process.env.MONGODB_URI.slice(-20) + ')' : 'MISSING');

app.use(cors());
app.use(express.json());

// MongoDB Connection with improved error handling
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 15000, 
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch(err => {
    const errorPrefix = '\n❌ MONGODB CONNECTION ERROR:';
    const errorMsg = `\n---------------------------\n${err.message}\n---------------------------\n👉 TIP: Check if your IP address is whitelisted in MongoDB Atlas.\n👉 TIP: Verify your MONGODB_URI in the .env file.\n`;
    console.error(errorPrefix);
    console.error(errorMsg);
    fs.writeFileSync(path.join(__dirname, 'db-error.log'), errorPrefix + errorMsg);
  });



// Schemas & Models
const topicSchema = new mongoose.Schema({
  id: String,
  name: String,
  subtitle: String,
  icon: String,
  description: String,
  status: String,
}, { timestamps: true });

const lessonSchema = new mongoose.Schema({
  id: String,
  title: String,
  slug: { type: String, unique: true },
  course: String,
  chapterOrder: Number,
  description: String,
  blocks: [Object],
}, { timestamps: true });

const audioFileSchema = new mongoose.Schema({
  filename: { type: String, unique: true },
  data: Buffer,
  contentType: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  completedLessons: [String], // Array of lesson slugs
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const AudioFile = mongoose.model('AudioFile', audioFileSchema);
const User = mongoose.model('User', userSchema);


// Serve uploaded audio files as static
const audioDir = path.join(__dirname, 'public', 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
app.use('/audio', express.static(audioDir));

// Multer: save audio to server/public/audio/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, audioDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `audio-${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// --- API ROUTES ---

// --- HEALTH & STATUS ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    dbState: mongoose.connection.readyState,
    dbStatus: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState]
  });
});

// --- STUDENT AUTH ---

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, error: 'Email already exists' });

    const user = new User({ name, email, password, completedLessons: [] });
    await user.save();
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid email or password' });

    res.json({ 
      success: true, 
      token: 'student-token-' + user._id, 
      user: { name: user.name, email: user.email, completedLessons: user.completedLessons } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {


  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: 'google-auth-' + sub, // Dummy password for Google users
        completedLessons: [],
      });
      await user.save();
    }

    res.json({
      success: true,
      token: 'student-token-' + user._id,
      user: { name: user.name, email: user.email, completedLessons: user.completedLessons, picture }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ success: false, error: 'Google authentication failed' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'Email not found' });
    
    // In a real app, send email with token. Here we just confirm.
    res.json({ success: true, message: 'Reset request received. Check your email for instructions (Simulated).' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { password: newPassword },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- STUDENT PROFILE & PROGRESS ---

app.post('/api/student/update-progress', async (req, res) => {
  try {
    const { email, lessonSlug } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { $addToSet: { completedLessons: lessonSlug } },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, completedLessons: user.completedLessons });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/student/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, user: { name: user.name, email: user.email, completedLessons: user.completedLessons } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (password === adminPass) {
    res.json({ success: true, token: 'mock-token-' + Date.now() });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect password' });
  }
});

// 0. Serve Audio from DB
app.get('/api/audio-db/:filename', async (req, res) => {

  try {
    const file = await AudioFile.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).send('Not found');
    res.set('Content-Type', file.contentType || 'audio/mpeg');
    res.send(file.data);
  } catch (err) {
    res.status(500).send('Error');
  }
});

// 1. Admin: Upload Audio
app.post('/api/admin/upload-audio', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    console.log('❌ Upload failed: No file received');
    return res.status(400).json({ error: 'No file received' });
  }

  console.log(`📡 Audio received: ${req.file.originalname} -> ${req.file.filename}`);

  try {
    // Save to DB
    const audioData = fs.readFileSync(req.file.path);
    console.log(`📖 Reading file from: ${req.file.path} (${audioData.length} bytes)`);
    
    await AudioFile.findOneAndUpdate(
      { filename: req.file.filename },
      {
        filename: req.file.filename,
        data: audioData,
        contentType: req.file.mimetype
      },
      { upsert: true }
    );
    console.log('✅ Audio saved to MongoDB Atlas');

    const audioUrl = `/api/audio-db/${req.file.filename}`;
    res.json({ success: true, audioUrl, filename: req.file.filename });
  } catch (err) {
    console.error('❌ DB Audio upload failed:', err);
    // Fallback to local URL if DB fails
    const audioUrl = `/audio/${req.file.filename}`;
    res.json({ success: true, audioUrl, filename: req.file.filename, note: 'Saved locally only' });
  }
});


// 2. Lessons: Get All
app.get('/api/lessons', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected. Check your Atlas IP whitelist.');
    const lessons = await Lesson.find().sort({ chapterOrder: 1 }).maxTimeMS(3000);
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load lessons', details: error.message });
  }
});

// 3. Lesson: Get by Slug
app.get('/api/lessons/:slug', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected.');
    const lesson = await Lesson.findOne({ slug: req.params.slug }).maxTimeMS(3000);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load lesson', details: error.message });
  }
});

// 4. Admin: Save/Update Lesson
app.post('/api/admin/save-lesson', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected.');
    const newLessonData = req.body;
    const lesson = await Lesson.findOneAndUpdate(
      { slug: newLessonData.slug },
      newLessonData,
      { upsert: true, new: true }
    ).maxTimeMS(3000);
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save lesson', details: error.message });
  }
});

// 5. Admin: Delete Lesson
app.delete('/api/admin/delete-lesson/:slug', async (req, res) => {
  try {
    await Lesson.deleteOne({ slug: req.params.slug });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// 6. Topics: Get All
app.get('/api/topics', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) throw new Error('Database not connected.');
    const topics = await Topic.find().sort({ createdAt: 1 }).maxTimeMS(3000);
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load topics', details: error.message });
  }
});

// 7. Admin: Save/Update Topic
app.post('/api/admin/save-topic', async (req, res) => {
  try {
    const newTopicData = req.body;
    const topic = await Topic.findOneAndUpdate(
      { id: newTopicData.id },
      newTopicData,
      { upsert: true, new: true }
    );
    res.json({ success: true, topic });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save topic' });
  }
});

// 8. Admin: Delete Topic
app.delete('/api/admin/delete-topic/:topicId', async (req, res) => {
  try {
    await Topic.deleteOne({ id: req.params.topicId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// 9. (Self-Healing) Data Migration Tool: File to MongoDB
app.get('/api/admin/migrate-data', async (req, res) => {
  try {
    const lessonsPath = path.join(__dirname, 'data', 'lessons.json');
    const topicsPath = path.join(__dirname, 'data', 'topics.json');

    let count = { lessons: 0, topics: 0, audio: 0 };

    if (fs.existsSync(lessonsPath)) {
      const lessons = JSON.parse(fs.readFileSync(lessonsPath));
      for (let l of lessons) {
        await Lesson.findOneAndUpdate({ slug: l.slug }, l, { upsert: true });
        count.lessons++;
      }
    }

    if (fs.existsSync(topicsPath)) {
      const topics = JSON.parse(fs.readFileSync(topicsPath));
      for (let t of topics) {
        await Topic.findOneAndUpdate({ id: t.id }, t, { upsert: true });
        count.topics++;
      }
    }

    // New: Migrate Audio Files to DB
    const audioFiles = fs.readdirSync(audioDir);
    for (let filename of audioFiles) {
      const filePath = path.join(audioDir, filename);
      if (fs.lstatSync(filePath).isFile()) {
        const audioData = fs.readFileSync(filePath);
        await AudioFile.findOneAndUpdate(
          { filename },
          {
            filename,
            data: audioData,
            contentType: filename.endsWith('.mp3') ? 'audio/mpeg' : 'audio/wav'
          },
          { upsert: true }
        );
        count.audio++;
      }
    }

    res.json({ success: true, message: 'All current data (Lessons, Topics, and Audio) has been successfully stored in your MongoDB cloud database.', results: count });
  } catch (err) {
    res.status(500).json({ error: 'Migration failed', details: err.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
