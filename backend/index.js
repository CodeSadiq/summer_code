import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fetch from 'node-fetch';

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

// Multer: save audio to memory (then to DB)
const storage = multer.memoryStorage();
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

    const isAdmin = user.email === (process.env.ADMIN_EMAIL || 'sadiq.imam404@gmail.com');
    const responsePayload = {
      success: true,
      token: 'student-token-' + user._id,
      user: { name: user.name, email: user.email, completedLessons: user.completedLessons, role: isAdmin ? 'admin' : 'student' }
    };
    if (isAdmin) {
      responsePayload.adminToken = 'admin-token-' + user._id;
    }
    
    res.json(responsePayload);
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

    const isAdmin = user.email === (process.env.ADMIN_EMAIL || 'sadiq.imam404@gmail.com');
    const responsePayload = {
      success: true,
      token: 'student-token-' + user._id,
      user: { name: user.name, email: user.email, completedLessons: user.completedLessons, picture, role: isAdmin ? 'admin' : 'student' }
    };
    if (isAdmin) {
      responsePayload.adminToken = 'admin-token-' + user._id;
    }

    res.json(responsePayload);
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
  if (!req.file) return res.status(400).json({ error: 'No file received' });
  try {
    const filename = `manual-${Date.now()}-${req.file.originalname}`;
    await AudioFile.findOneAndUpdate(
      { filename },
      {
        filename,
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      { upsert: true }
    );
    res.json({ success: true, audioUrl: `/api/audio-db/${filename}`, filename });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Lessons: Get All
app.get('/api/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ chapterOrder: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load lessons' });
  }
});

// 3. Lesson: Get by Slug
app.get('/api/lessons/:slug', async (req, res) => {
  try {
    const lesson = await Lesson.findOne({ slug: req.params.slug });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load lesson' });
  }
});

// 4. Admin: Save/Update Lesson
app.post('/api/admin/save-lesson', async (req, res) => {
  try {
    const newLessonData = req.body;
    const lesson = await Lesson.findOneAndUpdate(
      { slug: newLessonData.slug },
      newLessonData,
      { upsert: true, new: true }
    );
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save lesson' });
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
    const topics = await Topic.find().sort({ createdAt: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load topics' });
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

// 9. Admin: Generate AI Audio (ElevenLabs - Official SDK)
app.post('/api/admin/generate-audio', async (req, res) => {
  const { text } = req.body;
  const apiKey = process.env.ELEVEN_LABS_KEY;
  const voiceId = process.env.ELEVEN_LABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';

  console.log(`📡 AI Generate: Using Voice ID [${voiceId}] for text: "${text?.slice(0, 30)}..."`);

  if (!apiKey || apiKey === 'YOUR_ELEVEN_LABS_KEY') {
    return res.status(400).json({ error: 'ElevenLabs API Key missing in .env' });
  }

  try {
    const elevenlabs = new ElevenLabsClient({ apiKey });
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    console.log('✅ SDK Request successful, consuming stream...');
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const buffer = Buffer.concat(chunks);
    console.log(`✅ Stream consumed. Buffer size: ${buffer.length} bytes`);

    const filename = `ai-sdk-${Date.now()}.mp3`;
    const audioUrl = `/api/audio-db/${filename}`;

    await AudioFile.findOneAndUpdate(
      { filename },
      { filename, data: buffer, contentType: 'audio/mpeg' },
      { upsert: true }
    );

    // Fetch remaining credits
    let credits = null;
    try {
      const userInfo = await elevenlabs.user.get();
      console.log('📡 ElevenLabs Subscription Data:', userInfo.subscription);

      const limit = userInfo.subscription?.character_limit || 0;
      const count = userInfo.subscription?.character_count || 0;
      const remaining = Math.max(0, limit - count);

      credits = {
        remaining,
        total: limit
      };
      console.log(`📊 Credits Remaining: ${credits.remaining} / ${credits.total}`);
    } catch (e) {
      console.error('Failed to fetch credits:', e);
    }

    res.json({ success: true, audioUrl, filename, credits });
  } catch (err) {
    console.error('❌ AI Generation failed:', err);
    res.status(500).json({ success: false, error: err.message || 'AI Generation failed' });
  }
});

// Get ElevenLabs Credits
app.get('/api/admin/elevenlabs-credits', async (req, res) => {
  const apiKey = process.env.ELEVEN_LABS_KEY;
  console.log('📡 Fetching ElevenLabs Credits...');

  if (!apiKey || apiKey === 'YOUR_ELEVEN_LABS_KEY' || apiKey === 'undefined') {
    console.error('❌ ElevenLabs API Key missing or invalid in .env');
    return res.status(400).json({ error: 'API Key missing' });
  }

  try {
    const elevenlabs = new ElevenLabsClient({ apiKey });
    const userInfo = await elevenlabs.user.get();
    const sub = userInfo.subscription || {};
    const limit = sub.character_limit ?? sub.characterLimit ?? 0;
    const count = sub.character_count ?? sub.characterCount ?? 0;
    const remaining = Math.max(0, limit - count);

    console.log(`✅ Credits calculated: ${remaining}`);
    res.json({
      remaining,
      total: limit,
      resetDate: sub.next_character_count_reset_unix ?? sub.nextCharacterCountResetUnix
    });
  } catch (err) {
    console.error('❌ ElevenLabs Credit Fetch Failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Diagnostic: List all available voices
app.get('/api/admin/list-voices', async (req, res) => {
  const apiKey = process.env.ELEVEN_LABS_KEY;
  if (!apiKey || apiKey === 'YOUR_ELEVEN_LABS_KEY') return res.status(400).json({ error: 'API Key missing' });
  try {
    const elevenlabs = new ElevenLabsClient({ apiKey });
    const voices = await elevenlabs.voices.getAll();
    const list = voices.voices.map(v => ({
      name: v.name,
      id: v.voice_id || v.voiceId,
      category: v.category
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Data Migration Tool
app.get('/api/admin/migrate-data', async (req, res) => {
  try {
    // Migration logic...
    res.json({ success: true, message: 'Migration triggered' });
  } catch (err) {
    res.status(500).json({ error: 'Migration failed' });
  }
});

// 11. Code Execution via Judge0
app.post('/api/execute', async (req, res) => {
  const { code, language, stdin } = req.body;
  
  const langMap = {
    'python': 71,
    'c': 50,
    'c++': 54,
    'cpp': 54,
    'javascript': 63,
    'java': 62
  };
  
  const language_id = langMap[(language || '').toLowerCase()];
  
  if (!language_id) {
    return res.status(400).json({ error: `Unsupported language for execution: ${language}` });
  }

  try {
    const judge0Url = process.env.JUDGE0_URL || 'https://ce.judge0.com';
    const response = await fetch(`${judge0Url}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_code: code, language_id, stdin })
    });
    
    if (!response.ok) {
        throw new Error(`Judge0 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.compile_output) {
      res.json({ output: data.compile_output, error: true });
    } else if (data.stderr) {
      res.json({ output: data.stderr, error: true });
    } else {
      res.json({ output: data.stdout || '', error: false });
    }
  } catch (err) {
    console.error('Code execution error:', err);
    res.status(500).json({ error: 'Code execution failed: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
