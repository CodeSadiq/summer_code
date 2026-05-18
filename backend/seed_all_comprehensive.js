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

const questions = [
  // --- HTML --- (Already seeded some, but let's re-verify/add more)
  { courseId: 'HTML', lessonId: 'html-introduction', type: 'mcq', question: 'HTML ka upyog kya hai?', options: ['Web structure', 'Styles', 'Logic', 'Database'], correctAnswer: 'Web structure', hint: 'HTML structure ke liye hota hai.' },
  { courseId: 'HTML', lessonId: 'html-basic-structure', type: 'code', question: 'HTML page ki title kis tag mein hoti hai?', codeTemplate: '<head>\n  <___>My Page</___>\n</head>', correctAnswer: 'title', language: 'html', hint: 'Tab bar mein dikhne wala naam.' },
  { courseId: 'HTML', lessonId: 'html-elements-tags', type: 'mcq', question: 'Self-closing tag kaunsa hai?', options: ['<p>', '<div>', '<img>', '<span>'], correctAnswer: '<img>', hint: 'Iska closing tag nahi hota.' },
  { courseId: 'HTML', lessonId: 'html-links-hyperlinks', type: 'code', question: 'Anchor tag ka link attribute likhiye.', codeTemplate: '<a ___="index.html">Home</a>', correctAnswer: 'href', language: 'html', hint: 'Hyperlink reference.' },

  // --- CSS ---
  { courseId: 'CSS', lessonId: 'css-introduction', type: 'mcq', question: 'CSS stands for?', options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], correctAnswer: 'Cascading Style Sheets', hint: 'Styles cascade down from parent to child.' },
  { courseId: 'CSS', lessonId: 'css-selectors', type: 'mcq', question: 'ID selector ke liye kya use hota hai?', options: ['.', '#', '*', '&'], correctAnswer: '#', hint: '#my-id selector.' },
  { courseId: 'CSS', lessonId: 'css-colors-backgrounds', type: 'code', question: 'Text ka color red karne ke liye property likhiye.', codeTemplate: 'p {\n  ___: red;\n}', correctAnswer: 'color', language: 'css', hint: 'Seedha color property.' },
  { courseId: 'CSS', lessonId: 'css-box-model', type: 'mcq', question: 'Box Model mein content aur border ke beech ki space kya hai?', options: ['Margin', 'Padding', 'Outline', 'Gutter'], correctAnswer: 'Padding', hint: 'Internal space inside the border.' },
  { courseId: 'CSS', lessonId: 'css-flexbox', type: 'code', question: 'Flexbox activate karne ke liye display value?', codeTemplate: '.container {\n  display: ___;\n}', correctAnswer: 'flex', language: 'css', hint: 'display: flex;' },

  // --- JS ---
  { courseId: 'JS', lessonId: 'js-introduction', type: 'mcq', question: 'JavaScript script tag kahan lagate hain?', options: ['<head>', '<body>', 'Dono jagah', 'Kahbi nahi'], correctAnswer: 'Dono jagah', hint: 'Wait, usually bottom of body is preferred, but allowed in head too.' },
  { courseId: 'JS', lessonId: 'js-variables', type: 'code', question: 'Ek variable "x" declare kijiye value 10 ke saath (using let).', codeTemplate: 'let ___ = 10;', correctAnswer: 'x', language: 'javascript', hint: 'Variable ka naam.' },
  { courseId: 'JS', lessonId: 'js-data-types', type: 'mcq', question: 'Niche mein se kaunsa primitive data type nahi hai?', options: ['String', 'Number', 'Boolean', 'Object'], correctAnswer: 'Object', hint: 'Object ek reference type hai.' },
  { courseId: 'JS', lessonId: 'js-functions', type: 'code', question: 'Function keyword likhiye.', codeTemplate: '___ greet() { console.log("Hi"); }', correctAnswer: 'function', language: 'javascript', hint: 'JS mein function banane ke liye wahi word use hota hai.' },
  { courseId: 'JS', lessonId: 'js-arrays', type: 'mcq', question: 'Array mein naya element end mein add karne ke liye?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 'push', hint: 'Push adds at the end.' },

  // --- C ---
  { courseId: 'C', lessonId: 'c-intro', type: 'mcq', question: 'C program ka entry point?', options: ['start()', 'begin()', 'main()', 'execute()'], correctAnswer: 'main()', hint: 'Main function.' },
  { courseId: 'C', lessonId: 'c-variables-datatypes', type: 'code', question: 'Integer variable declare kijiye.', codeTemplate: '___ age = 20;', correctAnswer: 'int', language: 'c', hint: 'Integer data type.' },
  { courseId: 'C', lessonId: 'c-input-output', type: 'mcq', question: 'Output print karne ke liye function?', options: ['scanf', 'printf', 'print', 'write'], correctAnswer: 'printf', hint: 'Print formatted.' },
  { courseId: 'C', lessonId: 'c-loops', type: 'code', question: 'Infinite loop using while.', codeTemplate: 'while (___) { ... }', correctAnswer: '1', language: 'c', hint: '1 is true in C.' },

  // --- DOM ---
  { courseId: 'DOM', lessonId: 'dom-introduction', type: 'mcq', question: 'DOM stands for?', options: ['Document Object Model', 'Data Object Model', 'Direct Object Model', 'Digital Object Model'], correctAnswer: 'Document Object Model', hint: 'It represents the HTML as a tree of objects.' },
  { courseId: 'DOM', lessonId: 'dom-selectors', type: 'code', question: 'ID se element select karne ka method?', codeTemplate: 'document.___("my-id")', correctAnswer: 'getElementById', language: 'javascript', hint: 'Get Element By ID.' },
  { courseId: 'DOM', lessonId: 'dom-events', type: 'mcq', question: 'Button click event listen karne ke liye?', options: ['onclick', 'onpress', 'onhover', 'onchange'], correctAnswer: 'onclick', hint: 'Common mouse event.' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Clearing all existing questions...');
    await Question.deleteMany({}); // Delete all to re-seed fresh
    console.log(`Seeding ${questions.length} questions for all chapters...`);
    await Question.insertMany(questions);
    console.log('Massive seeding successful!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
