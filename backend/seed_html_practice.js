import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const questionSchema = new mongoose.Schema({
  courseId: String, // e.g. "HTML"
  lessonId: String, // e.g. "html-elements"
  type: { type: String, enum: ['mcq', 'code'] },
  question: String,
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  hint: String,
  codeTemplate: String,
  language: String,
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

const htmlQuestions = [
  // Chapter: Introduction
  {
    courseId: 'HTML',
    lessonId: 'html-introduction',
    type: 'mcq',
    question: 'HTML stands for?',
    options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Tool Multi Language', 'Hyper Text Modal Language'],
    correctAnswer: 'Hyper Text Markup Language',
    hint: 'It is a Markup Language used for structure.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-introduction',
    type: 'mcq',
    question: 'Who is making the Web standards?',
    options: ['Google', 'The World Wide Web Consortium (W3C)', 'Microsoft', 'Mozilla'],
    correctAnswer: 'The World Wide Web Consortium (W3C)',
    hint: 'Think about the organization founded by Tim Berners-Lee.'
  },

  // Chapter: Elements
  {
    courseId: 'HTML',
    lessonId: 'html-elements',
    type: 'mcq',
    question: 'Which tag is used for the largest heading?',
    options: ['<h6>', '<head>', '<h1>', '<heading>'],
    correctAnswer: '<h1>',
    hint: 'H1 is the biggest, H6 is the smallest.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-elements',
    type: 'code',
    question: 'Create a basic button with the text "Click Me".',
    codeTemplate: '<button>___</button>',
    correctAnswer: 'Click Me',
    language: 'html',
    hint: 'The text goes between the opening and closing tags.'
  },

  // Chapter: Attributes
  {
    courseId: 'HTML',
    lessonId: 'html-attributes',
    type: 'mcq',
    question: 'Which attribute is used to provide an alternative text for an image?',
    options: ['title', 'src', 'alt', 'longdesc'],
    correctAnswer: 'alt',
    hint: 'Short for "alternative".'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-attributes',
    type: 'code',
    question: 'Add the source "logo.png" to this image tag.',
    codeTemplate: '<img ___="logo.png">',
    correctAnswer: 'src',
    language: 'html',
    hint: 'Short for "source".'
  },

  // Chapter: Links
  {
    courseId: 'HTML',
    lessonId: 'html-links',
    type: 'mcq',
    question: 'Which attribute is used in the <a> tag to specify the URL of the page the link goes to?',
    options: ['src', 'href', 'link', 'url'],
    correctAnswer: 'href',
    hint: 'Short for "Hypertext Reference".'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-links',
    type: 'code',
    question: 'Make the link open in a new tab.',
    codeTemplate: '<a href="https://google.com" target="___">Google</a>',
    correctAnswer: '_blank',
    language: 'html',
    hint: 'Starts with an underscore.'
  },

  // Chapter: Lists
  {
    courseId: 'HTML',
    lessonId: 'html-lists',
    type: 'mcq',
    question: 'How can you make a numbered list?',
    options: ['<ul>', '<list>', '<ol>', '<dl>'],
    correctAnswer: '<ol>',
    hint: 'Short for "Ordered List".'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-lists',
    type: 'code',
    question: 'Add a list item with text "Apple" inside this Unordered List.',
    codeTemplate: '<ul>\n  <___>Apple</___>\n</ul>',
    correctAnswer: 'li',
    language: 'html',
    hint: 'Stands for "List Item".'
  },

  // Chapter: Forms
  {
    courseId: 'HTML',
    lessonId: 'html-forms',
    type: 'mcq',
    question: 'Which input type is used for a checkbox?',
    options: ['type="check"', 'type="checkbox"', 'type="box"', 'type="square"'],
    correctAnswer: 'type="checkbox"',
    hint: 'The full word "checkbox" is used.'
  },
  {
    courseId: 'HTML',
    lessonId: 'html-forms',
    type: 'code',
    question: 'Create an input field for a password.',
    codeTemplate: '<input type="___">',
    correctAnswer: 'password',
    language: 'html',
    hint: 'Use the type that hides the characters.'
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Clearing existing HTML chapter-wise questions...');
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
