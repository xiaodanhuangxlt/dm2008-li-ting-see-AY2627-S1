// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)
//
// Complete this scaffold into a playable game.
// Your game should have player control, collision detection,
// score tracking, and at least two game states.
//
// Not sure where to start? Try this order:
// 1. Get the bird flapping — add control in keyPressed()
// 2. Get pipes spawning — uncomment the spawn logic in draw()
// 3. Add collision detection between the bird and pipes
// 4. Add scoring when the bird passes a pipe
// 5. Add game states — at minimum a playing state and a game over state
//
// Stretch: add a start screen, a high score, or a difficulty curve.

/* ----------------- Globals ----------------- */
let bird;
let pipes = [];
let score = 0;
let highScore = 0;
let spawnCounter = 0;
let minecraftFont;

let bgm, hitSound;

let bgImg;
let bgX = 0;
const BG_SPEED = 1;

const SPAWN_RATE = 90;
const PIPE_SPEED = 2.5;
const PIPE_GAP = 120;
const PIPE_W = 60;

// Game states: "playing" or "gameover" — add more if you need them
// "playing" | "gameover" | "start"
let gameState = "start";

/* ----------------- Setup & Draw ----------------- */
async function setup() {
  createCanvas(480, 480);
  noStroke();
  pipeImg = await loadImage("assets/cactusBlock.png");
  beeImg = await loadImage("assets/bee.png");
  bgImg = await loadImage("assets/desert.png");
  minecraftFont = await loadFont("assets/minecraft.ttf");
  textFont(minecraftFont);

  bgm = new Audio("assets/c416bgm.mp3");
  bgm.loop = true;
  bgm.volume = 1;
  hitSound = new Audio("assets/hit.mp3");
  hitSound.volume = 0.5;
  bird = new Bird(width / 2, height / 2);
  pipes.push(new Pipe(width + 40));

  let savedHighScore = localStorage.getItem("highScore");
  if (savedHighScore !== null) {
    highScore = parseInt(savedHighScore);
  }
}

function draw() {
  // background(18, 22, 28);
  drawBackground();
  if (gameState === "start") {
    drawStartScreen();
  }

  if (gameState === "playing") {
    bird.update();

    // Spawn a new pipe every SPAWN_RATE frames, then reset the counter
    spawnCounter++;
    if (spawnCounter >= SPAWN_RATE) {
      pipes.push(new Pipe(width + 40));
      spawnCounter = 0;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      // When the bird hits a pipe, trigger game over
      if (pipes[i].hits(bird)) {
        gameState = "gameover";
        hitSound.currentTime = 0;
        hitSound.play();
        bgm.pause(); // stops "playing" state bgm
      }

      // When the bird passes a pipe, increment the score
      // Hint: use pipes[i].passed to make sure you only score once per pipe
      if (!pipes[i].passed && pipes[i].x + pipes[i].w < bird.pos.x) {
        score++;
        pipes[i].passed = true;
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }

      if (score > highScore) {
        highScore = score;
        // Using localStorage.setItem() to save the new high score to localStorage
        localStorage.setItem("highScore", highScore);
      }
    }

    bird.show();
    // Display the score — look up textAlign() and textSize() in the p5.js reference
    fill(255);
    stroke(0);
    strokeWeight(4);
    textAlign(CENTER, TOP);
    textSize(32);
    text(score, width / 2, 20);
    noStroke();
  }

  if (gameState === "gameover") {
    fill(250);
    textAlign(CENTER, CENTER);
    textSize(40);
    stroke(0);
    strokeWeight(4);
    fill("tomato");
    text("GAME OVER", width / 2, height / 2 - 50);

    stroke(0);
    fill(255);
    textSize(25);
    text("Score: " + score, width / 2, height / 2 - 10);
    text("High Score: " + highScore, width / 2, height / 2 + 20);
    text("Press ENTER to restart", width / 2, height / 2 + 60);
  }
}

function drawBackground() {
  imageMode(CORNER);
  image(bgImg, bgX, 0, width, height);
  image(bgImg, bgX + width, 0, width, height);
  bgX -= BG_SPEED;
  if (bgX <= -width) bgX = 0;
}

function drawStartScreen() {
  const letters = "FlappyBee".split("");
  const colors = [
    "#f7c948",
    "#4aa3ff",
    "#ff5fa2",
    "#a259ff",
    "#ff8c42",
    "#3ddc97",
    "#4aa3ff",
    "#f7c948",
    "#ff5fa2",
  ];

  let hover = sin(frameCount * 0.1) * 10;

  textAlign(LEFT, CENTER);
  textSize(48);
  stroke(0);
  strokeWeight(6);
  let gap = 4;
  let headingW = 0;
  for (let i = 0; i < letters.length; i++) {
    headingW += textWidth(letters[i]) + gap;
  }
  headingW -= gap; // remove last gap

  let x = width / 2 - headingW / 2;
  // draw each letter
  for (let i = 0; i < letters.length; i++) {
    fill(colors[i]);
    text(letters[i], x, height * 0.25 + hover);
    x += textWidth(letters[i]) + gap;
  }

  let beeY = height * 0.48 + hover;
  imageMode(CENTER);
  image(beeImg, width / 2, beeY, 34, 33);

  textAlign(CENTER, CENTER);
  textSize(22);
  strokeWeight(4);
  fill(255);
  text("PRESS SPACE", width / 2, height * 0.72);

  textAlign(RIGHT, TOP);
  textSize(28);
  text(highScore, width - 20, 20);
  textSize(12);
  text("HIGH SCORE", width - 20, 55);

  noStroke();
}

/* ----------------- Input ----------------- */
function keyPressed() {
  // Make the bird flap on space or UP_ARROW — call bird.flap()
  if (gameState === "start" && key == " ") {
    bgm.play();
    gameState = "playing";
  } else if (gameState === "playing" && key == " ") {
    bird.flap();
  } else if (gameState === "gameover" && key === "Enter") {
    resetGame();
  }
}

function resetGame() {
  bird = new Bird(width / 2, height / 2);
  pipes = [];
  pipes.push(new Pipe(width + 40));
  score = 0;
  spawnCounter = 0;
  gameState = "playing";
  // bgm.currentTime = 0; // start from beginning
  bgm.play();
}

/* ----------------- Classes ----------------- */
