// link elements
const startContainer = document.querySelector(".start_container"),
      quizButtons = document.querySelectorAll(".start_container .quiz_button");

const boxContainer = document.querySelector(".box_container"),
      title = document.querySelector(".box_header .title"),
      timerNumb = document.querySelector(".box_header .timer_numb"),
      timerLine = document.querySelector(".box_header .timer_line"),
      question = document.querySelector(".box_main .question"),
      answersList = document.querySelector(".box_main .answers_list"),
      next = document.querySelector(".box_footer .next"),
      questionBullets = document.querySelector(".box_footer .question_bullets");

const resultContainer = document.querySelector(".result_container"),
      result = document.querySelector(".result_container .result"),
      replay = document.querySelector(".result_container .replay"),
      quit = document.querySelector(".result_container .quit");


// counters
let currentIndex = 0;
let rightAnswersNum = 0;
let countDownInterval;
let questionTimer = 10;

// create object on answers
class AnswerObject {
  constructor(a1, a2, a3, a4) {
    this.answer1 = a1,
    this.answer2 = a2,
    this.answer3 = a3,
    this.answer4 = a4
  };
};

// fetch data depends of clicked button
quizButtons.forEach(button => {
  button.addEventListener("click", e => {
    fetchData(e.target.dataset.fetch);
  });
});

// fetching data and converting function
async function fetchData(type) {
  try {
    const promise = await fetch(`./data/${type}-data.json`);
    const data = await promise.json();
    startQuiz(data);
  } catch (error) {
    console.log(error);
  };
};

function startQuiz(data) {
  const dataLength = data.length;

  createQuizBox(data[currentIndex], dataLength);

  countDown(questionTimer, dataLength);

  // handle next button function
  next.addEventListener("click", _ => {
    checkAnswer(data[currentIndex].right_answer);
    currentIndex++;
    removeOldQuizBox();
    removeCountDown();
    removeCountDownLine();
    createQuizBox(data[currentIndex], dataLength);
    countDown(questionTimer, dataLength);
  })

  // handle replay button function
  replay.addEventListener("click", _ => {
    currentIndex = 0;
    rightAnswersNum = 0;
    removeOldQuizBox();
    removeCountDown();
    removeCountDownLine();
    createQuizBox(data[currentIndex], dataLength);
    countDown(questionTimer, dataLength);
  })
  
  // quit replay button function
  quit.addEventListener("click", _ => {
    location.reload();
  })
};


// create quiz box function depends on data fetched
function createQuizBox(data, length) {
  // if questions finished show result
  if (currentIndex === length) {
    result.innerHTML = `You got ${rightAnswersNum}/${length}`;
    
    boxContainer.classList.remove("active_box_container");
    resultContainer.classList.add("active_result_container");
  } else {
    // start box_header
    title.innerHTML = `Question ${currentIndex + 1}`;
    // end box_header

    // start box_main
    question.textContent = `${data.title}`;

    let answerObject = new AnswerObject (
      data.answer_1,
      data.answer_2,
      data.answer_3,
      data.answer_4
    )
    for (const key in answerObject) {
      const answerItem = document.createElement("li");
      answerItem.classList.add("answer_item");
      answersList.appendChild(answerItem);

      const answerRadio = document.createElement("input");
      answerRadio.setAttribute("type", "radio");
      answerRadio.setAttribute("data-answer", `${answerObject[key]}`);
      answerRadio.classList.add("answer_radio");
      answerRadio.id = `question_${currentIndex + 1}_${key}`;
      answerRadio.name = `question_${currentIndex + 1}`;
      answerItem.appendChild(answerRadio);

      const answerTxt = document.createElement("label");
      answerTxt.setAttribute("for", `question_${currentIndex + 1}_${key}`);
      answerTxt.classList.add("answer_txt");
      answerTxt.textContent = `${answerObject[key]}`;
      answerItem.appendChild(answerTxt);
    }
    // end box_main

    // start box_footer
    for (let j = 0; j < length; j++) {
      const bullet = document.createElement("span");
      bullet.classList.add("bullet");
      if (j === currentIndex) {
        bullet.classList.add("active_bullet");
      }
      bullet.innerHTML = `${j + 1}`;
      questionBullets.appendChild(bullet);
    }
    // end box_footer

    resultContainer.classList.remove("active_result_container");
    startContainer.classList.remove("active_start_container");
    boxContainer.classList.add("active_box_container");
  }
};

// check answer if right or wrong function
function checkAnswer(rightAnswer) {
  const answersRadio = document.querySelectorAll(".answer_radio");
  let theChoosenAnswer;
  for (let i = 0; i < answersRadio.length; i++) {
    if (answersRadio[i].checked) {
      theChoosenAnswer = answersRadio[i].getAttribute("data-answer");
    }
  }
  if (theChoosenAnswer === rightAnswer) {
    rightAnswersNum++;
  }
};

// remove old data function to put new one
function removeOldQuizBox() {
  // start box_header
  title.innerHTML = ``;
  // end box_header

  // start box_main
  question.textContent = ``;
  answersList.innerHTML = ``;
  // end box_main

  // start box_footer
  questionBullets.innerHTML = ``;
  // end box_footer
};

// count down timer for each question function
function countDown(duration, length) {
  if (currentIndex === length) {
    return false;
  } else {
    let minutes, seconds;
    countDownInterval = setInterval( _ => {
      minutes = parseInt(duration / 60);
      minutes = minutes < 10 ? `0${minutes}`: minutes;

      seconds = parseInt(duration % 60);
      seconds = seconds < 10 ? `0${seconds}`: seconds;

      timerNumb.innerHTML = `${minutes}:${seconds}`;
      countDownLine(duration);

      if (--duration < 0) {
        next.click();
      }
    }, 1000)
  }
};

// remove the old timer to put new one function
function removeCountDown() {
  timerNumb.innerHTML = `00:00`;
  clearInterval(countDownInterval);
};

// count down timer line for each question function
function countDownLine(duration) {
  timerLine.style.cssText = `transition: width ${duration}s linear;`;
  timerLine.classList.add("active_timer_line");
};

// remove the old count down timer line to put new one function
function removeCountDownLine() {
  timerLine.style.removeProperty("transition");
  timerLine.classList.remove("active_timer_line");
};
