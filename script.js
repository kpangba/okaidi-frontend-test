    let questions = [];
      let nowquestion;
      let timerintervalref = null;
      let score;
      const timeperquestion = 30; // 30 seconds
      const question_part = document.querySelector(".question-part");
      const result_part = document.querySelector(".result-part");
      const question_content = document.querySelector(".question .content");
      const question_answers = document.querySelector(".question .answers");
      const nextbutton = document.querySelector(".btns .nextbtn");
      const restartbutton = document.querySelector(".restartbtn");
      const timedisplay = document.querySelector(".question .elapsedtime span");

      window.addEventListener("load", () => {
        // getting questions
        startGame();

        // adding handler on next button
        nextbutton.addEventListener("click", () => {
          displayNextQuestion();
        });

        // adding handler on restart button
        restartbutton.addEventListener("click", () => {
          startGame();
        });
      });

      function startGame() {
        fetch(
          "https://opentdb.com/api.php?amount=5&category=18&difficulty=hard&type=multiple"
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.response_code == 0) {
              questions = res.results;

              // afficher la premiere question
              nowquestion = 0;
              score = 0;
              displayNextQuestion();
            }
          })
          .catch((err) => {});
      }

      function displayQuestion(position, time) {
        const question = questions[position - 1];
        const answers = [
          ...question.incorrect_answers,
          question.correct_answer
        ];

        // display question part
        displayPart("question");

        // displaying question
        question_content.innerHTML = question.question;

        // displaying possible answers
        const list = answers.map((item, idx) => {
          return `
            <input
              type="radio"
              name="rad_answer"
              value="${item}"
            /> ${item}
          `;
        });

        question_answers.innerHTML = list.join(`<br/>`);

        // passing new position quesrion
        nowquestion = position;

        // display timer
        initQuestionTimer(time, displayNextQuestion);
      }

      function displayNextQuestion() {
        nowquestion && computedScore();

        if (nowquestion + 1 > questions.length) {
          displayPart("result");
        } else {
          displayQuestion(nowquestion + 1, timeperquestion);
        }
      }

      function initQuestionTimer(time, onTimeElapsed) {
        // if already setted, destroy before starting
        timerintervalref && clearInterval(timerintervalref);

        let remainingtime = time;
        timedisplay.innerHTML = remainingtime;

        timerintervalref = setInterval(() => {
          remainingtime--;
          timedisplay.innerHTML = remainingtime;

          // stop counter if time passed
          if (remainingtime === 0) {
            clearInterval(timerintervalref);
            onTimeElapsed && onTimeElapsed();

            timerintervalref = null;
          }
        }, 1000);
      }

      function computedScore() {
        const question = questions[nowquestion - 1];
        const answered = document.querySelector(
          'input[name="rad_answer"]:checked'
        );

        if (answered) {
          score += answered.value === question.correct_answer ? 1 : 0;
        }
      }

      function displayPart(part) {
        question_part.style.display = part === "question" ? "block" : "none";
        result_part.style.display = part === "result" ? "block" : "none";

        if (part === "result") {
          result_part.querySelector(".gain").innerHTML = score;
          result_part.querySelector(".over").innerHTML = questions.length;
          clearInterval(timerintervalref);
        }
    }