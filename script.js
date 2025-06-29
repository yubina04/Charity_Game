let score = 0;
let timeLeft = 30;
let gameInterval, dropInterval;
let dropSpeed = 3000;

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const playArea = document.getElementById("play-area");
const gameOver = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const resetBtn = document.getElementById("reset-btn");
const soundClean = document.getElementById("sound-clean");
const soundDirty = document.getElementById("sound-dirty");
const milestoneMsg = document.getElementById("milestone-msg");


const difficulties = {
  easy:   { time: 45, dropSpeed: 2000, dropInterval: 1200, winScore: 70 },
  normal: { time: 30, dropSpeed: 1500, dropInterval: 800, winScore: 100 },
  hard:   { time: 20, dropSpeed: 1000, dropInterval: 500, winScore: 130 }
};

let currentDifficulty = 'normal';

const difficultySelect = document.getElementById('difficulty');
if (difficultySelect) {
  difficultySelect.addEventListener('change', (e) => {
    currentDifficulty = e.target.value;
    resetGame();
  });
}


function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}


function startGame() {
  const settings = difficulties[currentDifficulty];
  score = 0;
  timeLeft = 30;
  dropSpeed = 3000;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  milestoneMsg.textContent = "";
  gameOver.classList.add("hidden");
  resetBtn.disabled = false;

  gameInterval = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    // Increase difficulty
    if (timeLeft % 10 === 0 && dropSpeed > 1000) {
      dropSpeed -= 400;
    }

    if (timeLeft <= 0) endGame();
  }, 1000);

  dropInterval = setInterval(createDrop, 800);
}

function createDrop() {
  const drop = document.createElement("div");
  drop.classList.add("drop");

  const isClean = Math.random() > 0.3;
  drop.classList.add(isClean ? "clean" : "dirty");
  drop.style.left = `${Math.random() * 90}%`;
  drop.style.animationDuration = dropSpeed / 1000 + "s";

  drop.addEventListener("click", () => {
    if (isClean) {
      score += 10;
      soundClean.currentTime = 0;
      soundClean.play().catch(() => {});
      if (score === 50) milestoneMsg.textContent = "💧 Nice aim!";
      if (score === 100) {
        milestoneMsg.textContent = "🌟 Water Hero Unlocked!";
        launchConfetti();
      }
    } else {
      score -= 5;
      soundDirty.currentTime = 0;
      soundDirty.play().catch(() => {});
    }
    scoreEl.textContent = score;

    drop.classList.add("splash");
    setTimeout(() => drop.remove(), 300);
  });

  drop.addEventListener("animationend", () => drop.remove());
  playArea.appendChild(drop);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(dropInterval);
  document.querySelectorAll(".drop").forEach((d) => d.remove());
  finalScore.textContent = score;
  gameOver.classList.remove("hidden");
  resetBtn.disabled = false;
}

resetBtn.addEventListener("click", () => {
  clearInterval(gameInterval);
  clearInterval(dropInterval);
  document.querySelectorAll(".drop").forEach((d) => d.remove());
  startGame();
});

startGame();
