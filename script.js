const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.createElement('div');  // Create a div for Game Over text

let gravity = 1 ;
let velocity = 1;
let jump = -9;
let isGameOver = false;
let score = 0;

// Set up the Game Over display
gameOverDisplay.style.position = 'absolute';
gameOverDisplay.style.top = '50%';
gameOverDisplay.style.left = '50%';
gameOverDisplay.style.transform = 'translate(-50%, -50%)';
gameOverDisplay.style.fontSize = '40px';
gameOverDisplay.style.color = 'red';
gameOverDisplay.style.fontWeight = 'bold';
gameOverDisplay.style.display = 'none';  // Initially hidden
gameOverDisplay.textContent = "GAME OVER!";
game.appendChild(gameOverDisplay);

document.addEventListener('keydown', function(e) {
  if (['Space', 'Enter', 'ControlLeft'].includes(e.code)) {
    velocity = jump;
  }
});

function createPipe() {
  const pipeTop = document.createElement('div');
  const pipeBottom = document.createElement('div');

  const gap = 150;
  const pipeHeight = Math.floor(Math.random() * (window.innerHeight - gap - 100)) + 50;

  pipeTop.classList.add('pipe');
  pipeBottom.classList.add('pipe');

  pipeTop.style.height = pipeHeight + 'px';
  pipeTop.style.top = '0px';
  pipeBottom.style.height = (window.innerHeight - pipeHeight - gap) + 'px';
  pipeBottom.style.top = (pipeHeight + gap) + 'px';

  const pipeLeft = window.innerWidth;
  pipeTop.style.left = pipeLeft + 'px';
  pipeBottom.style.left = pipeLeft + 'px';

  game.appendChild(pipeTop);
  game.appendChild(pipeBottom);

  let hasScored = false;

  function movePipe() {
    if (isGameOver) return;

    const currentLeft = parseInt(pipeTop.style.left);
    pipeTop.style.left = (currentLeft - 3) + 'px';
    pipeBottom.style.left = (currentLeft - 3) + 'px';

    if (!hasScored && currentLeft + 50 < player.offsetLeft) {
      score++;
      hasScored = true;
      scoreDisplay.textContent = "Skor: " + score;
    }

    if (currentLeft < -60) {
      pipeTop.remove();
      pipeBottom.remove();
      clearInterval(pipeInterval);
    }

    const playerTop = player.offsetTop;
    const playerBottom = playerTop + player.offsetHeight;

    if (
      currentLeft < player.offsetLeft + player.offsetWidth &&
      currentLeft + 50 > player.offsetLeft &&
      (playerTop < pipeTop.offsetHeight || playerBottom > pipeBottom.offsetTop)
    ) {
      endGame();
    }
  }

  const pipeInterval = setInterval(movePipe, 20);
}

function endGame() {
  isGameOver = true;
  gameOverDisplay.style.display = 'block';  // Show the "Game Over" message
  setTimeout(() => {
    location.reload();
  }, 300); // Jeda agar tombol OK bisa diklik
}

function gameLoop() {
  if (isGameOver) return;

  velocity += gravity;
  player.style.top = (player.offsetTop + velocity) + 'px';

  if (player.offsetTop + player.offsetHeight > window.innerHeight) {
    endGame();
  }

  if (player.offsetTop < 0) {
    player.style.top = "0px";
    velocity = 0;
  }

  requestAnimationFrame(gameLoop);
}

setInterval(createPipe, 2000);
gameLoop();
