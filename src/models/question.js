var question_ex = {"0": [{"Response_Code": 0, "Results": {"category": "Health", "type": "boolean", "difficulty": "easy", "question": "Moderate to vigorous physical activity was measured in 12-17 year olds to be 49.7 minutes per day. Is it true that the self reported amount of time per day was greater than the measured amount?", "correct_answer": "FALSE", "incorrect_answers": ["TRUE"]}}, {"Response_Code": 0, "Results": {"category": "Health", "type": "multiple", "difficulty": "easy", "question": "What age group spend the most time sedentary in 2017?", "correct_answer": "Ages 60-79", "incorrect_answers": ["Ages 18-39", "Ages 6-11", "Ages 40-59"]}}, {"Response_Code": 0, "Results": {"category": "Health", "type": "boolean", "difficulty": "easy", "question": "Please enter your height and weight. Do you think you are above or below the national average for BMI?", "correct_answer": "POST-DEFINED", "incorrect_answers": ["TRUE", "FALSE"]}}], "1": [{"Response_Code": 0, "Results": {"category": "Tourism", "type": "multiple", "difficulty": "easy", "question": "What was the most visited country by Canadians in 2018, excluding the United States?", "correct_answer": "Mexico", "incorrect_answers": ["United Kingdom", "Kazakhstan", "Thailand"]}}], "2": [{"Response_Code": 0, "Results": {"category": "Geography", "type": "boolean", "difficulty": "easy", "question": "ON Region: What is the most populous CMA?", "correct_answer": "Toronto", "incorrect_answers": ["Ottawa-Gatineau", "Windsor", "Sudbury"]}}, {"Response_Code": 0, "Results": {"category": "Geography", "type": "boolean", "difficulty": "easy", "question": "BC Region: What is the most populous CMA?", "correct_answer": "Vancouver", "incorrect_answers": ["Victoria", "Kelowna", "Abbotsford-Mission"]}}, {"Response_Code": 0, "Results": {"category": "Geography", "type": "boolean", "difficulty": "easy", "question": "QC Region: What is the most populous CMA?", "correct_answer": "Montreal", "incorrect_answers": ["Ottawa-Gatineau", "Quebec", "Sherbrooke"]}}], "3": [{"Response_Code": 0, "Results": {"category": "Cannabis", "type": "boolean", "difficulty": "easy", "question": "Which province had the highest percentage of cannabis users in the first quarter of 2019?", "correct_answer": "Alberta", "incorrect_answers": ["Ontario", "Quebec", "British-Columbia"]}}], "4": [{"Response_Code": 0, "Results": {"category": "Agriculture", "type": "multiple", "difficulty": "easy", "question": "True or false: More than 60% of food bought by Canadians is produced domestically.", "correct_answer": "TRUE (70%)", "incorrect_answers": ["FALSE"]}}], "5": [{"Response_Code": 0, "Results": {"category": "Nature", "type": "boolean", "difficulty": "easy", "question": "How much of Canada's Forest Lands are protected?", "correct_answer": "7%", "incorrect_answers": ["0%", "50%", "99%"]}}]};

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
    PubSub.subscribe('Player:question-category', (event) => {
	const categoryObject = event.detail;
	const apiCode = categoryObject.apiCode;
	this.playerID = categoryObject.playerID;
	this.category = categoryObject.category;
	
	var rand_index = Math.floor(Math.random()*question_ex[apiCode].length);
	
	this.addQuestionInfo(question_ex[apiCode][rand_index].Results);

	result = this.setUpQuestion();
	PubSub.publish("Question:question-ready", result);
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

//Question.prototype.getTokenFromAPI = function () {
//    const url = "https://opentdb.com/api_token.php?command=request";
//    const request = new RequestHelper(url);
//    request.get()
//	.then((result) => {this.token = result.token;})
//};

Question.prototype.checkAnswer = function (chosenAnswer) {
    return chosenAnswer === this.correctAnswer;
};

Question.prototype.addQuestionInfo = function (apiInfo_arg) {
    var apiInfo = JSON.parse(JSON.stringify(apiInfo_arg));
    
    this.question = apiInfo.question;
    this.correctAnswer = apiInfo['correct_answer'];
    this.answersArray = apiInfo['incorrect_answers'];
    this.answersArray.push(this.correctAnswer);
    
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
