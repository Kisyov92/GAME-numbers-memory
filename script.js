"use strict";

let level, timeToLook, livesLeft, quantityPlayNums, playNumsArr, clickCounter;
const timers = {
  countdownTime: false,
  hideTime: false,
};
const numContainerHTML =
  '<div class="number-container"><span class="num"></span></div>';

const startWindowEl = document.querySelector(".starting-window");
const gameWindow = document.querySelector(".game-window");
const endWindowEl = document.querySelector(".ending-window");

const endMsgEl = document.querySelector(".ending-msg");

const difficultyOptionsEl = document.querySelector(".difficulty-options");

const levelEl = document.querySelector(".level");
const timeEl = document.querySelector(".time-container");
const livesEl = document.querySelector(".lives-container");
const numsContainerEl = document.querySelector(".numbers-container");

const btnRestartGame = document.querySelectorAll(".btn-restart-game");
const btnRestartLevel = document.querySelector(".btn-restart-level");

difficultyOptionsEl.addEventListener("click", function (e) {
  if (!e.target.classList.contains("difficulty-option")) return;
  gameWindow.classList.remove("hide-el");
  startWindowEl.classList.add("hide-el");

  const difficulty = e.target.dataset.diff;
  if (difficulty === "easy") {
    gameInit(1);
  }
  if (difficulty === "medium") {
    gameInit(10);
  }
  if (difficulty === "hard") {
    gameInit(20);
  }
});

// 1
function gameInit(lvl) {
  level = lvl;
  timeToLook = 20;
  livesLeft = 3;

  startLevel();
}

// 2
function startLevel() {
  quantityPlayNums = decideNumsQuantity(level);
  playNumsArr = createPlayingNumbers(quantityPlayNums);
  clickCounter = 0;

  populateNumCells();
  setStats();
  startCountdownTimer();
}

// 3
function decideNumsQuantity(lvl) {
  let quantity;
  if (lvl < 10) quantity = 4;
  if (lvl >= 10 && lvl < 20) quantity = 6;
  if (lvl >= 20 && lvl < 30) quantity = 8;
  if (lvl >= 30) quantity = 10;
  return quantity;
}
// 3

// 4
function createPlayingNumbers(quantity) {
  let gameNumsArr = [];
  while (gameNumsArr.length < quantity) {
    let num = createRandomNum(quantity);
    if (!gameNumsArr.includes(num)) {
      gameNumsArr.push(num);
    }
  }
  return gameNumsArr;
}

function createRandomNum(max) {
  return Math.floor(Math.random() * max);
}
// 4

// 5
function populateNumCells() {
  numsContainerEl.innerHTML = numContainerHTML.repeat(quantityPlayNums);
  numsContainerEl.classList.add(`grid-col-${quantityPlayNums / 2}`);

  const numEl = document.querySelectorAll(".num");
  numEl.forEach((el, i) => {
    el.textContent = playNumsArr[i];
    el.dataset.num = playNumsArr[i];
  });

  const firstEl = numsContainerEl.querySelector('[data-num="0"]');

  function skipTimer() {
    clearTimers();
    timeEl.textContent = "";
    numEl.forEach((el) => {
      el.classList.add("hide-el");
    });
    firstEl.classList.add("no-before");
    firstEl.removeEventListener("click", skipTimer);
  }

  firstEl.addEventListener("click", skipTimer);
}
//5

// 6
function setStats() {
  levelEl.textContent = level;
  livesEl.textContent = showLives(livesLeft);
}

function showLives(num) {
  let heartLives = "💗 ".repeat(num);
  if (num > 3) heartLives = `${"💗 ".repeat(3)}+${num - 3}`;
  return heartLives;
}
// 6

// 7
function startCountdownTimer() {
  let roundTime = timeToLook;
  timeEl.textContent = makeMinSec(roundTime);
  timers.countdownTime = setInterval(() => {
    roundTime--;
    timeEl.textContent = makeMinSec(roundTime);
  }, 1000);

  stopCountdownTimer();
}

function stopCountdownTimer() {
  timers.hideTime = setTimeout(() => {
    clearInterval(timers.countdownTime);
    const numEl = document.querySelectorAll(".num");
    numEl.forEach((el) => {
      el.classList.add("hide-el");
      clearTimers();
      timeEl.textContent = "";
    });
  }, 1000 * timeToLook);
}

function makeMinSec(num) {
  return `${Math.floor(num / 60)}:${(num % 60).toString().padStart(2, "0")}`;
}

//7

// 2

// 1

// 1
btnRestartGame.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    gameWindow.classList.add("hide-el");
    startWindowEl.classList.remove("hide-el");
    clearTimers();
    numsContainerEl.classList = "numbers-container";
    endWindowEl.classList.add("hide-el");
  });
});

function clearTimers() {
  clearInterval(timers.countdownTime);
  clearInterval(timers.hideTime);
  timers.countdownTime = false;
  timers.hideTime = false;
}
// 1

// -
btnRestartLevel.addEventListener("click", function (e) {
  clearTimers();
  startLevel();
});
// -

numsContainerEl.addEventListener("click", function (e) {
  const numElContainer = e.target.closest(".number-container");
  const numEl = numElContainer?.querySelector(".num");
  if (!numEl?.classList.contains("hide-el") || e.target === this) return;

  if (clickCounter === +numEl.dataset.num) {
    clickCounter++;
    numEl.classList.remove("hide-el");
  } else {
    gaveWrongAns(numElContainer, numEl);
  }

  if (clickCounter === quantityPlayNums) {
    levelUp();
  }
});

function gaveWrongAns(numElContainer, numEl) {
  numElContainer.classList.add("wrong-ans");
  numEl.classList.remove("hide-el");
  setTimeout(() => {
    numElContainer.classList.remove("wrong-ans");
    numEl.classList.add("hide-el");
  }, 500);
  livesLeft--;
  livesEl.textContent = showLives(livesLeft);
  if (livesLeft < 1) {
    endWindowEl.classList.remove("hide-el");
    gameWindow.classList.add("hide-el");
    createEndMsg();
  }
}

function createEndMsg() {
  endMsgEl.textContent = `Congratulations, this time you made it to level ${level}!`;
}

function levelUp() {
  level++;
  if (level === 10 || level === 20 || level === 30) timeToLook = 20;
  else timeToLook--;
  livesLeft++;

  startLevel();
}
