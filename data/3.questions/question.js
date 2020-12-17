const faker = require('faker')

const questions = [
  {
    keywords: ["generic"],
    question: "What is the capital of India",
    questionType:"FIB",
    optionType:"string",
    options:["Delhi", "Chennai", "Mumbai", "Kolkatta"],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    keywords: ["generic"],
    question: "What is the capital of India",
    questionType:"FIB",
    optionType:"URL",
    options:["https://homepages.cae.wisc.edu/~ece533/images/airplane.png", "https://homepages.cae.wisc.edu/~ece533/images/baboon.png", "https://homepages.cae.wisc.edu/~ece533/images/watch.png", "https://homepages.cae.wisc.edu/~ece533/images/zelda.png"],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  
]

module.exports = questions
