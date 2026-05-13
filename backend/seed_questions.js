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
  options: [String],
  correctAnswer: String,
  explanation: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  starterCode: String,
  testCases: [{ input: String, expectedOutput: String }],
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

const questions = [
  // HTML
  {
    topicId: 'HTML',
    type: 'mcq',
    question: 'Which HTML element is used for the largest heading?',
    options: ['<h6>', '<head>', '<h1>', '<header>'],
    correctAnswer: '<h1>',
    explanation: '<h1> is the standard tag for the most important heading on a page.',
    difficulty: 'easy'
  },
  {
    topicId: 'HTML',
    type: 'output',
    question: 'What is the correct HTML for creating a hyperlink?',
    options: ['<a>http://google.com</a>', '<a name="http://google.com">Google</a>', '<a href="http://google.com">Google</a>', 'url("http://google.com")'],
    correctAnswer: '<a href="http://google.com">Google</a>',
    explanation: 'The href attribute specifies the destination address of the link.',
    difficulty: 'easy'
  },
  // CSS
  {
    topicId: 'CSS',
    type: 'mcq',
    question: 'What does CSS stand for?',
    options: ['Colorful Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets'],
    correctAnswer: 'Cascading Style Sheets',
    explanation: 'CSS stands for Cascading Style Sheets, used for styling HTML elements.',
    difficulty: 'easy'
  },
  {
    topicId: 'CSS',
    type: 'mcq',
    question: 'Which property is used to change the font of an element?',
    options: ['font-style', 'font-weight', 'font-family', 'font-size'],
    correctAnswer: 'font-family',
    explanation: 'The font-family property specifies the font for an element.',
    difficulty: 'easy'
  },
  // JavaScript
  {
    topicId: 'JavaScript',
    type: 'mcq',
    question: 'How do you create a function in JavaScript?',
    options: ['function:myFunction()', 'function = myFunction()', 'function myFunction()', 'new function()'],
    correctAnswer: 'function myFunction()',
    explanation: 'The standard way to declare a function is using the "function" keyword followed by the name.',
    difficulty: 'easy'
  },
  {
    topicId: 'JavaScript',
    type: 'output',
    question: 'What will "console.log(typeof [])" output?',
    correctAnswer: 'object',
    explanation: 'In JavaScript, arrays are technically special types of objects.',
    difficulty: 'medium'
  },
  {
    topicId: 'JavaScript',
    type: 'debug',
    question: 'This function should add two numbers, but it has a bug. Fix it!',
    starterCode: 'function add(a, b) {\n  return a - b;\n}',
    correctAnswer: 'function add(a, b) {\n  return a + b;\n}',
    explanation: 'The original code was using the subtraction operator (-) instead of addition (+).',
    difficulty: 'easy',
    testCases: [{ input: '2, 3', expectedOutput: '5' }]
  },
  {
    topicId: 'JavaScript',
    type: 'coding',
    question: 'Write a function named "isEven" that returns true if a number is even, and false otherwise.',
    starterCode: 'function isEven(num) {\n  // Your code here\n}',
    correctAnswer: 'function isEven(num) {\n  return num % 2 === 0;\n}',
    explanation: 'Using the modulo operator (%) to check the remainder when divided by 2.',
    difficulty: 'easy',
    testCases: [
      { input: '4', expectedOutput: 'true' },
      { input: '7', expectedOutput: 'false' }
    ]
  },
  // C Programming
  {
    topicId: 'C Programming',
    type: 'mcq',
    question: 'Which format specifier is used to print an integer in C?',
    options: ['%f', '%c', '%d', '%s'],
    correctAnswer: '%d',
    explanation: '%d is the standard format specifier for signed integers in C.',
    difficulty: 'easy'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Optional: Clear existing questions to avoid duplicates during testing
    // await Question.deleteMany({});
    
    await Question.insertMany(questions);
    console.log('Successfully seeded questions!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
