const PubSub = require('../helpers/pub_sub.js');

const QuestionView = function (element) {
  this.element = element;
  this.answers = [];
};

QuestionView.prototype.bindEvents = function () {
    
    PubSub.subscribe("Question:question-ready", (event) => {
	const questionInfo = event.detail;
	this.render(questionInfo);
    })
    PubSub.subscribe('Question:question-result', (event) => {
	const questionInfo = event.detail;
	const questionResult = event.detail.answer;
	this.displayResult(questionResult);
	this.displayExp(questionInfo);
    })
};

QuestionView.prototype.render = function (info) {
    console.log(info);

    const question = document.createElement('p')
    this.element.innerHTML = ""
    question.innerHTML = info.question;
    this.element.appendChild(question)
    this.displayAnswers(info.answers)
};

QuestionView.prototype.displayExp = function (info) {
    console.log("DisplayExp");
    console.log(info);
    
    var explanation = document.createElement('p');
    explanation.setAttribute("class", "exp");
    //explanation.className = "exp";
    //explanation.classList.add('exp');
    
    explanation.innerHTML = info.explanation;
    //explanation.innerHTML = "Explanation should go here!!!";

    this.element.appendChild(explanation);
};

QuestionView.prototype.displayAnswers = function (answers) {
    const answerList = document.createElement('div');
    answers.forEach((answer) => {
	const option = document.createElement('button')
	option.id = answer;
	option.innerHTML = answer
	answerList.appendChild(option)
	this.answers.push(option);
    })
    this.element.appendChild(answerList)
    answerList.addEventListener('click', (event) => {
	const selectedAnswer = event.target.id;
	if (selectedAnswer){
	    this.disableAnswers();
	    event.target.classList.add('selected-answer');
	    PubSub.publish('QuestionView:question-answered', selectedAnswer)
	}
    })
};

QuestionView.prototype.disableAnswers = function () {
  this.answers.forEach((answer) => {
    answer.disabled = true;
  })
};

QuestionView.prototype.displayResult = function (answer) {
  const answerElement = document.getElementById(answer)
  answerElement.classList.remove('selected-answer')
  answerElement.classList.add("right-answer")
};

module.exports = QuestionView;
