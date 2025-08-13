// Simple test to verify our data structure and scoring logic
const { questions } = require('./src/data/questions.ts');
const { calculateScores } = require('./src/utils/scoring.ts');

console.log('Testing data structure...');
console.log(`Total questions: ${questions.length}`);
console.log('First question:', questions[0]);
console.log('Color distribution:');

const colorCounts = questions.reduce((acc, q) => {
  acc[q.color] = (acc[q.color] || 0) + 1;
  return acc;
}, {});

console.log(colorCounts);

// Test scoring
const sampleResponses = [
  { questionId: 1, score: 8 },  // red
  { questionId: 2, score: 9 },  // green  
  { questionId: 3, score: 7 },  // green
  { questionId: 4, score: 6 },  // red
];

console.log('\nSample scoring test:');
console.log('Responses:', sampleResponses);
// console.log('Calculated scores:', calculateScores(sampleResponses));