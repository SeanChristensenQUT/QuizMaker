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

//create dynamically scaling quiz size support
router.get('/results', function(req, res, next) {
  clearInterval(interval);
  resultsList = []
  score = 0;
  for(var x = 0; x < 10; x++){
    if (correctAnswers[x] === userAnswers[x]){
      resultsList[x] = "Correct"
      score += 1;
    }
    else{
      resultsList[x] = "Incorrect"
    }
  }
  res.render('Results',{
    questionList:questionList,
    userAnswers:userAnswers,
    correctAnswers:correctAnswers,
    resultsList:resultsList,
    score:score
  })
});

//fix so that layout doesnt include quiz forms
/* GET home page. */
router.get('/:quizID', function(req, res, next) {
  if(parseInt(req.params.quizID) > questionList.length || timer < 0)
  {
    res.redirect('/results')
  }
else{

  if(interval === undefined)
  {
  interval = setInterval(() => {
    // runs every 1 seconds
    timer -=1
    console.log(timer)
  }, 1000);
  }


  var progress = 0;
   userAnswers.forEach(element => {
     if(element !== "NA"){
       progress = 1 + progress;
     }
   });
  console.log(progress);

  if(req.params.quizID > 10 || req.params.quizID < 0 || !Number.isInteger(parseInt(req.params.quizID))){
    res.render('error',{})
  }
  else
  {
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


// POST method route
router.post('/:quizID', (req, res) => {
  //console.log(req.body)
  userAnswers[parseInt(req.params.quizID)-1] = req.body.userAnswer
  console.log(userAnswers)
  res.redirect('/' + req.params.quizID);
})

module.exports = router;
