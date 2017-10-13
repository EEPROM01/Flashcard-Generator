var inquirer = require('inquirer');
var fs = require('fs');
var Basic = require("./basicCard");
var Cloze = require('./clozecard')

// define Variables
var arg = process.argv[2];
var questions = [];
var clozeQuestions = [];



// Main Code
if (arg=== undefined) {

    console.log('Please input command either "Basic" or "Cloze" to select the type of flash card you would like to save.');

} else if (arg.toLowerCase() === "basic") {
  
    console.log('Basic Flashcard');

    // Creating user prompts to creat flash cards
    var questionPrompts = [{
        type: "input",
        name: "question",
        message: "What text would you like on the front of the card?"
    }, {
        type: "input",
        name: "answer",
        message: "Reverse on card??"
    }];

    var handleResponse = function(answers) {
        var newQuestion = new Basic(answers.question, answers.answer);
        newQuestion.printInfo();
        var newQuestionJSON = JSON.stringify(newQuestion);
        questions.push(newQuestionJSON);
        //write results to llog
        fs.appendFile('basicCard.txt', newQuestionJSON + "\n");
        //prompt to aadd anothr
        return inquirer.prompt([{
            name: "another",
            message: "add another?",
            type: "confirm",
            default: true
        }]);
    };

    //get responses
    var handleResponse = function(cont) {
        if (cont.another) {
            promptForQuestion();
        } else {
            console.log("Flashcards added to database: " + questions.length + ".");
        }
    };

    var handleError = function(err) {
        console.log("err");
    };

    var promptQuestion = function() {
        inquirer.prompt(questionPrompts)
            .then(handleQuestionResponse, handleError)
            .then(handleAnotherResponse, handleError);
    };

    promptQuestion();

} else if (arg.toLowerCase() === "cloze") {

    console.log('Cloze _______ flashcard!');

    var clozeQuestionPrompts = [{
        type: "input",
        name: "cloze",
        message: "What portion would you like emitted?"
    }, {
        type: "input",
        name: "phrase",
        message: "What is the text of the card to finish the question?"
    }];

    // handle the first repsonse input from the user
    var handleClozeResponse = function(clozeAnswers) {
        var newClozeQuestion = new Cloze(clozeAnswers.cloze, clozeAnswers.phrase);
        newClozeQuestion.printClozeInfo();
        var newClozeQuestionJSON = JSON.stringify(newClozeQuestion);
        clozeQuestions.push(newClozeQuestionJSON);
        //write to log
        fs.appendFile('clozeCard.txt', newClozeQuestionJSON + "\n");

        return inquirer.prompt([{
            name: "anotherCloze",
            message: "Add another Cloze Card?",
            type: "confirm",
            default: true
        }]);
    };

   
    var handleAnotherClozeResponse = function(cont2) {
        if (cont2.anotherCloze) {
            promptClozeQuestion();
        } else {
            console.log("Flashcards added to database: " + questions.length + ".");
        }
    };

    // error checker and response given
    var handleClozeError = function() {
        console.log("Err");
    };

    // compiles all user input
    var clozeQuestion = function() {
        inquirer.prompt(clozeQuestionPrompts)
            .then(handleClozeResponse, handleClozeError)
            .then(handleAnotherClozeResponse, handleClozeError);
    };

    clozeQuestion();

} else {
    console.log('What flashcard would you like to create: Cloze or Basic?');
}