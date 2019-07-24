var question_ex = [
  {
      "Response_Code": 0,
      "Results": {
          "category": "Health",
          "type": "boolean",
          "difficulty": "easy",
          "question": "Moderate to vigorous physical activity was measured in 12-17 year olds to be 49.7 minutes per day. Is it true that the self reported amount of time per day was greater than the measured amount?",
          "correct_answer": "FALSE",
          "incorrect_answers": [
              "TRUE"
          ]
      }
  },
  {
      "Response_Code": 0,
      "Results": {
          "category": "Tourism",
          "type": "multiple",
          "difficulty": "easy",
          "question": "What was the most visited country by Canadians in 2018, excluding the United States?",
          "correct_answer": "Mexico",
          "incorrect_answers": [
              "United Kingdom",
              "Kazakhstan",
              "Thailand"
          ]
      }
  },
  {
      "Response_Code": 0,
      "Results": {
          "category": "Health",
          "type": "multiple",
          "difficulty": "easy",
          "question": "What age group spend the most time sedentary in 2017?",
          "correct_answer": "Ages 60-79",
          "incorrect_answers": [
              "Ages 18-39",
              "Ages 6-11",
              "Ages 40-59"
          ]
      }
  },
  {
      "Response_Code": 0,
      "Results": {
          "category": "Health",
          "type": "boolean",
          "difficulty": "easy",
          "question": "Please enter your height and weight. Do you think you are above or below the national average for BMI?",
          "correct_answer": "POST-DEFINED",
          "incorrect_answers": [
              "TRUE",
              "FALSE"
          ]
      }
  },
  {
      "Response_Code": 0,
      "Results": {
          "category": "Geography",
          "type": "boolean",
          "difficulty": "easy",
          "question": "ON Region: What is the most populous CMA?",
          "correct_answer": "Toronto",
          "incorrect_answers": [
              "Ottawa-Gatineau",
              "Windsor",
              "Sudbury"
          ]
      }
  },
  {
      "Response_Code": 0,
      "Results": {
          "category": "Geography",
          "type": "boolean",
          "difficulty": "easy",
          "question": "BC Region: What is the most populous CMA?",
          "correct_answer": "Vancouver",
          "incorrect_answers": [
              "Victoria",
              "Kelowna",
              "Abbotsford-Mission"
          ]
      }
  },
  {
      "Response_Code": 0,
      "Results": {
          "category": "Geography",
          "type": "boolean",
          "difficulty": "easy",
          "question": "QC Region: What is the most populous CMA?",
          "correct_answer": "Montreal",
          "incorrect_answers": [
              "Ottawa-Gatineau",
              "Quebec",
              "Sherbrooke"
          ]
      }
  }
];

const RequestHelper = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Question = function () {
  this.question;
  this.category;
  this.correctAnswer;
  this.answersArray;
  this.playerID;
  this.questionDifficulty = "medium";
  this.token;
};

Question.prototype.bindEvents = function () {
    
  this.getTokenFromAPI();

  PubSub.subscribe('Player:question-category', (event) => {
    const categoryObject = event.detail;
    const apiCode = categoryObject.apiCode;
    this.playerID = categoryObject.playerID;
    this.category = categoryObject.category;
    const url = `https://opentdb.com/api.php?amount=1&category=${apiCode}&difficulty=medium&type=multiple&token=${this.token}`
    console.log(url);
    const request = new RequestHelper(url);
    request.get()
      .then((data) => {this.addQuestionInfo(question_ex.results[0])})
      .then(() => {return this.setUpQuestion();})
      .then((result) => {PubSub.publish("Question:question-ready", result);})
      .catch((error) => {console.error(error);})
  });

  PubSub.subscribe('QuestionView:question-answered', (event) => {
    const chosenAnswer = event.detail;
    console.log('chosen answer:', chosenAnswer);
    const result = this.checkAnswer(chosenAnswer);
    const resultObject = {
      answer: this.correctAnswer,
      answerCorrect: result
    };
    if (result) {
      PubSub.publish(`QuestionP${this.playerID}:answer-correct`, this.category);
    }
    PubSub.publish('Question:question-result', resultObject);
  })
};

Question.prototype.getTokenFromAPI = function () {
  const url = "https://opentdb.com/api_token.php?command=request";
  const request = new RequestHelper(url);
  request.get()
  .then((result) => {this.token = result.token;})
};

Question.prototype.checkAnswer = function (chosenAnswer) {
  return chosenAnswer === this.correctAnswer;
};

Question.prototype.addQuestionInfo = function (apiInfo_arg) {
    var apiInfo = JSON.parse(JSON.stringify(apiInfo_arg));

    this.question = apiInfo.question;
    this.correctAnswer = apiInfo['correct_answer'];

    //console.log("before " + apiInfo['correct_answer'])
    
    //this.answersArray = ['TEST']

    this.answersArray = apiInfo['incorrect_answers'];

    //console.log("before: " + this.answersArray);
    
    this.answersArray.push(this.correctAnswer);

    //console.log("after " + this.correctAnswer);
    //console.log("after: " + this.answersArray);
    
    this.answersArray = this.randomiseAnswers(this.answersArray);
};

Question.prototype.setUpQuestion = function () {
    console.log("setUpQuestion " + this.answersArray);

    return {
    question: this.question,
      answers: this.answersArray

      
  };
};


Question.prototype.randomiseAnswers = function (array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

module.exports = Question;
