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

const cQuestions = [
  // Chapter: Intro
  {
    courseId: 'C',
    lessonId: 'c-intro',
    type: 'mcq',
    question: 'Which header file is required for printf() and scanf()?',
    options: ['conio.h', 'stdlib.h', 'stdio.h', 'math.h'],
    correctAnswer: 'stdio.h',
    hint: 'Short for Standard Input Output.'
  },
  {
    courseId: 'C',
    lessonId: 'c-intro',
    type: 'code',
    question: 'Complete the main function structure.',
    codeTemplate: 'int ___() {\n  return 0;\n}',
    correctAnswer: 'main',
    language: 'c',
    hint: 'Every C program starts here.'
  },

  // Chapter: Variables & Data Types
  {
    courseId: 'C',
    lessonId: 'c-variables-datatypes',
    type: 'mcq',
    question: 'What is the format specifier for a float variable?',
    options: ['%d', '%c', '%f', '%lf'],
    correctAnswer: '%f',
    hint: 'F is for Float.'
  },
  {
    courseId: 'C',
    lessonId: 'c-variables-datatypes',
    type: 'mcq',
    question: 'What is the size of an int data type on most modern 64-bit systems?',
    options: ['1 byte', '2 bytes', '4 bytes', '8 bytes'],
    correctAnswer: '4 bytes',
    hint: 'It usually stores values up to ~2 billion.'
  },

  // Chapter: Input Output
  {
    courseId: 'C',
    lessonId: 'c-input-output',
    type: 'mcq',
    question: 'Which symbol is used as the address-of operator in scanf()?',
    options: ['*', '&', '#', '$'],
    correctAnswer: '&',
    hint: 'It tells scanf where to store the value in memory.'
  },
  {
    courseId: 'C',
    lessonId: 'c-input-output',
    type: 'code',
    question: 'Print "Hello" to the screen.',
    codeTemplate: 'printf("___");',
    correctAnswer: 'Hello',
    language: 'c',
    hint: 'Put the word inside the quotes.'
  },

  // Chapter: Conditionals
  {
    courseId: 'C',
    lessonId: 'c-conditionals',
    type: 'mcq',
    question: 'Which of the following is used to test multiple conditions in a single block?',
    options: ['for', 'switch', 'while', 'goto'],
    correctAnswer: 'switch',
    hint: 'It uses "cases" for different values.'
  },
  {
    courseId: 'C',
    lessonId: 'c-conditionals',
    type: 'code',
    question: 'Complete the if statement condition for checking if x is greater than 10.',
    codeTemplate: 'if (x ___ 10) { ... }',
    correctAnswer: '>',
    language: 'c',
    hint: 'Use the greater than symbol.'
  },

  // Chapter: Loops
  {
    courseId: 'C',
    lessonId: 'c-loops',
    type: 'mcq',
    question: 'Which loop is guaranteed to execute at least once?',
    options: ['for', 'while', 'do-while', 'none'],
    correctAnswer: 'do-while',
    hint: 'The condition is checked at the end.'
  },
  {
    courseId: 'C',
    lessonId: 'c-loops',
    type: 'code',
    question: 'Create an infinite loop using while.',
    codeTemplate: 'while (___) { ... }',
    correctAnswer: '1',
    language: 'c',
    hint: 'Any non-zero value is true in C.'
  },

  // Chapter: Arrays
  {
    courseId: 'C',
    lessonId: 'c-arrays',
    type: 'mcq',
    question: 'What is the index of the first element in a C array?',
    options: ['-1', '0', '1', 'None'],
    correctAnswer: '0',
    hint: 'C uses zero-based indexing.'
  },
  {
    courseId: 'C',
    lessonId: 'c-arrays',
    type: 'code',
    question: 'Declare an integer array named "arr" of size 5.',
    codeTemplate: 'int arr[___];',
    correctAnswer: '5',
    language: 'c',
    hint: 'The size goes inside the brackets.'
  },

  // Chapter: Pointers
  {
    courseId: 'C',
    lessonId: 'c-pointers',
    type: 'mcq',
    question: 'What does the * operator do when used with a pointer variable?',
    options: ['Gets address', 'Dereferences (gets value)', 'Multiplies', 'Declares'],
    correctAnswer: 'Dereferences (gets value)',
    hint: 'It "follows" the pointer to the value.'
  },
  {
    courseId: 'C',
    lessonId: 'c-pointers',
    type: 'code',
    question: 'Declare a pointer variable "ptr" that can point to an integer.',
    codeTemplate: 'int ___ptr;',
    correctAnswer: '*',
    language: 'c',
    hint: 'Use the asterisk symbol.'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Clearing old C Programming chapter-wise questions...');
    await Question.deleteMany({ courseId: 'C' });
    console.log(`Seeding ${cQuestions.length} C Programming questions...`);
    await Question.insertMany(cQuestions);
    console.log('C Seeding successful!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
