var question_ex = require('../../questions.json');

const RequestHelper = require('../helpers/request.js');
const PubSub = require('../helpers/pub_sub.js');

const Question = function () {
    this.question;
    this.category;
    this.correctAnswer;
    this.answersArray;
    this.explanation;
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
	    answerCorrect: result,
	    explanation: this.explanation
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

    this.explanation = apiInfo['explanation'];
    
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
