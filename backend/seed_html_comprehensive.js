import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const Question = mongoose.model('Question', new mongoose.Schema({
  courseId: String,
  lessonId: String,
  type: { type: String, enum: ['mcq', 'code'] },
  question: String,
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  hint: String,
  codeTemplate: String,
  language: String,
}, { timestamps: true }));

const htmlQuestions = [
  // Introduction
  {
    courseId: 'HTML',
    lessonId: 'html-introduction',
    type: 'mcq',
    question: 'HTML ka matlab kya hota hai?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Tool Multi Language', 'Hyper Text Modal Language'],
    correctAnswer: 'Hyper Text Markup Language',
    hint: 'Yeh web structure ke liye use hone wali markup language hai.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-introduction',
    type: 'mcq',
    question: 'HTML document ka extension kya hota hai?',
    options: ['.txt', '.js', '.html', '.css'],
    correctAnswer: '.html',
    hint: 'File save karte waqt hum .html extension use karte hain.'
  },

  // Basic Structure
  {
    courseId: 'html-basic-structure',
    lessonId: 'html-basic-structure',
    type: 'code',
    question: 'HTML document ka sabse pehla tag (Doctype) likhiye.',
    codeTemplate: '___',
    correctAnswer: '<!DOCTYPE html>',
    language: 'html',
    hint: 'Yeh browser ko batata hai ki yeh HTML5 document hai.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-basic-structure',
    type: 'mcq',
    question: 'Visible content kis tag ke andar likha jata hai?',
    options: ['<head>', '<body>', '<html>', '<title>'],
    correctAnswer: '<body>',
    hint: 'Body tag ke andar sara content hota hai jo screen par dikhta hai.'
  },

  // Elements
  {
    courseId: 'HTML',
    lessonId: 'html-elements-tags',
    type: 'mcq',
    question: 'Heading ke liye kitne levels hote hain?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '6',
    hint: 'h1 se lekar h6 tak headings hoti hain.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-elements-tags',
    type: 'code',
    question: 'Ek paragraph tag banaiye jisme "Hello World" likha ho.',
    codeTemplate: '<p>___</p>',
    correctAnswer: 'Hello World',
    language: 'html',
    hint: 'Opening aur closing p tags ke beech content aata hai.'
  },

  // Attributes
  {
    courseId: 'HTML',
    lessonId: 'html-attributes',
    type: 'mcq',
    question: 'Kis attribute se hum image ka path set karte hain?',
    options: ['href', 'src', 'alt', 'link'],
    correctAnswer: 'src',
    hint: 'src stands for source.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-attributes',
    type: 'code',
    question: 'Ek anchor tag banaiye jiska link "https://google.com" ho.',
    codeTemplate: '<a ___="https://google.com">Google</a>',
    correctAnswer: 'href',
    language: 'html',
    hint: 'Hypertext Reference attribute use hota hai.'
  },

  // Links
  {
    courseId: 'HTML',
    lessonId: 'html-links-hyperlinks',
    type: 'mcq',
    question: 'Link ko naye tab mein kholne ke liye target ki value kya honi chahiye?',
    options: ['_self', '_blank', '_parent', '_top'],
    correctAnswer: '_blank',
    hint: 'Starts with an underscore.'
  },

  // Images
  {
    courseId: 'HTML',
    lessonId: 'html-adding-images',
    type: 'mcq',
    question: 'Agar image load na ho, toh kaunsa text dikhayi deta hai?',
    options: ['src', 'alt', 'title', 'id'],
    correctAnswer: 'alt',
    hint: 'Alternative text attribute.'
  },

  // Lists
  {
    courseId: 'HTML',
    lessonId: 'html-lists',
    type: 'mcq',
    question: 'Bulleted list ke liye kaunsa tag use hota hai?',
    options: ['<ol>', '<ul>', '<li>', '<list>'],
    correctAnswer: '<ul>',
    hint: 'Unordered List.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-lists',
    type: 'code',
    question: 'Numbered list ke liye tag likhiye.',
    codeTemplate: '<___>\n  <li>Item 1</li>\n</___>',
    correctAnswer: 'ol',
    language: 'html',
    hint: 'Ordered List.'
  },

  // Tables
  {
    courseId: 'HTML',
    lessonId: 'html-tables',
    type: 'mcq',
    question: 'Table row ke liye kaunsa tag use hota hai?',
    options: ['<td>', '<th>', '<tr>', '<table>'],
    correctAnswer: '<tr>',
    hint: 'Table Row.'
  },

  // Forms
  {
    courseId: 'HTML',
    lessonId: 'html-forms-inputs',
    type: 'mcq',
    question: 'Checkbox banane ke liye input type kya hona chahiye?',
    options: ['text', 'radio', 'checkbox', 'button'],
    correctAnswer: 'checkbox',
    hint: 'Wahi naam jo function hai.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-forms-inputs',
    type: 'code',
    question: 'Input field ko mandatory banane ke liye kaunsa attribute use hota hai?',
    codeTemplate: '<input type="text" ___>',
    correctAnswer: 'required',
    language: 'html',
    hint: 'Required attribute.'
  },

  // Multimedia
  {
    courseId: 'HTML',
    lessonId: 'html-multimedia',
    type: 'mcq',
    question: 'Video play karne ke liye kaunsa tag use hota hai?',
    options: ['<audio>', '<video>', '<media>', '<source>'],
    correctAnswer: '<video>',
    hint: 'Seedha video tag.'
  },

  // Semantic
  {
    courseId: 'HTML',
    lessonId: 'html-semantic-tags',
    type: 'mcq',
    question: 'Niche diye gaye mein se kaunsa semantic tag nahi hai?',
    options: ['<article>', '<div>', '<section>', '<header>'],
    correctAnswer: '<div>',
    hint: 'Div is a generic container with no meaning.'
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Clearing existing HTML questions...');
    await Question.deleteMany({ courseId: 'HTML' });
    
    console.log(`Seeding ${htmlQuestions.length} HTML questions...`);
    await Question.insertMany(htmlQuestions);
    
    console.log('Seeding successful!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
