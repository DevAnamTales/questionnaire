const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });

// Load the questions from the JSON file
const questions = require('./question1.json').questions;

// Initialize animal scores with zeros
let animalScores = [0, 0, 0, 0]
//console.log(animalScores)

// Ask for user name
const userName = prompt(`Enter your name: `);

for (let i = 0; i < questions.length; i++) {
  const question = questions[i];
  const answer = prompt(`${question.question} ? (yes/no)`).toLowerCase();

  if (answer === 'yes') {
    for (let j = 0; j < question.alternatives.length; j++) {
      animalScores[j] += question.yes[j];
      //console.log(animalScores[j])
    }
  } else if (answer === 'no') {
    for (let j = 0; j < question.alternatives.length; j++) {
      animalScores[j] += question.no[j];
      //console.log(animalScores[j])

    }
  } else {
    console.log("Enter the correct answer (yes/no)");
    i--; // Ask the same question again
  }
}

let totalScore = 0;

for (let i = 0; i < animalScores.length; i++) {
  totalScore += animalScores[i];
}

const resultData = {};

for (let i = 0; i < questions[0].alternatives.length; i++) {
  const animal = questions[0].alternatives[i]
  const percentage = ((animalScores[i] / totalScore) * 100).toFixed(2);
  resultData[animal] = `${percentage}%`;
}

const sortedResultData = Object.fromEntries(
  Object.entries(resultData)
    .sort(([, a], [, b]) => parseFloat(b) - parseFloat(a))
);

console.log("These pets suits you best (sorted by percentage):")

for (const [animal, percentage] of Object.entries(sortedResultData)) {
  console.log(`${animal}:${percentage}`)
}

const userData = {
  userName: userName,
  date: new Date().toLocaleString(),
  results: sortedResultData,
};

let allUsersData = [];

const existingData = fs.readFileSync('results.json', 'utf-8');
allUsersData = JSON.parse(existingData)
allUsersData.push(userData)

// Write the updated data (including all users) back to the file
fs.writeFileSync('results.json', JSON.stringify(allUsersData, null, 2));

console.log("User data has been saved.");
