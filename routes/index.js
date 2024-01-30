var express = require('express');
var router = express.Router();

let timer = 900
let interval;

const questionList = [
  "1+7=?",
  "9+0=?",
  "Whats the colour of an Apple?",
  "Country with the largest production of auto-vehicles?",
  "True or False, Africa is a continent",
  "23+1=?",
  "99+1=?",
  "Red + Blue = ?",
  "92+8=?",
  "29+7=?",
]

const userAnswers = [
  "NA",
  "NA",
  "NA",
  "NA",
  "NA",
  "NA",
  "NA",
  "NA",
  "NA",
  "NA",
]

const correctAnswers = [
  "8",
  "9",
  "Red",
  "Japan",
  "True",
  "24",
  "100",
  "Purple",
  "100",
  "36",
]

//route for results page
router.get('/results', function(req, res, next) {
  //timer is stopped and cleared
  clearInterval(interval);
  resultsList = []
  score = 0;
  //for each userAnswer, if correctAnswer is the same add 1 to the score and list as correct
  for(var x = 0; x < 10; x++){
    if (correctAnswers[x] === userAnswers[x]){
      resultsList[x] = "Correct"
      score += 1;
    }
    else{
      resultsList[x] = "Incorrect"
    }
  }
  //render web page with data
  res.render('Results',{
    questionList:questionList,
    userAnswers:userAnswers,
    correctAnswers:correctAnswers,
    resultsList:resultsList,
    score:score
  })
});

//route for quiz page (each question has its individual page)
router.get('/:quizID', function(req, res, next) {
  //if the there is no next question or the timer has gone below zero redirect
  //user to the results page
  if(parseInt(req.params.quizID) > questionList.length || timer < 0)
  {
    res.redirect('/results')
  }
else{

  //if timer hasn't been set already, set an interval timer which executes every 1000ms 
  //taking away from the counter variable timer
  if(interval === undefined)
  {
  interval = setInterval(() => {
    // runs every 1 seconds
    timer -=1
    console.log(timer)
  }, 1000);
  }

  //for each user answer, if the user answer is not NA then add to progress
  var progress = 0;
   userAnswers.forEach(element => {
     if(element !== "NA"){
       progress = 1 + progress;
     }
   });
  console.log(progress);

  //if given quizID number is out of range or is not an integer then redirect to error page
  if(req.params.quizID > 10 || req.params.quizID < 0 || !Number.isInteger(parseInt(req.params.quizID))){
    res.render('error',{})
  }
  else
  {
    //render quiz page with data
  res.render('Quiz1', { 
    timer: timer,
    questionProgress: progress,
    questionNumber: req.params.quizID, 
    questionText: questionList[parseInt(req.params.quizID)-1],
    nextPage: parseInt(req.params.quizID)+1, 
    backPage: parseInt(req.params.quizID)-1
  });
  }}
});


//POST route for quiz
router.post('/:quizID', (req, res) => {
  //save answer from recieved request and store in userAnswers array at the corresponding
  //question number
  userAnswers[parseInt(req.params.quizID)-1] = req.body.userAnswer
  res.redirect('/' + req.params.quizID);
})

module.exports = router;
