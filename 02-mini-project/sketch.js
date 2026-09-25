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
let spawnCounter = 0;
let minecraftFont;

let bgImg;
let bgX = 0;
const BG_SPEED = 1;

const SPAWN_RATE = 90;
const PIPE_SPEED = 2.5;
const PIPE_GAP = 120;
const PIPE_W = 60;

// Game states: "playing" or "gameover" — add more if you need them
let gameState = "playing";

/* ----------------- Setup & Draw ----------------- */
async function setup() {
  createCanvas(480, 480);
  noStroke();
  pipeImg = await loadImage("assets/cactusBlock.png");
  beeImg = await loadImage("assets/bee.png");
  bgImg = await loadImage("assets/desert.png");
  minecraftFont = await loadFont("assets/minecraft.ttf");
  textFont(minecraftFont);
  bird = new Bird(120, height / 2);
  pipes.push(new Pipe(width + 40));
}

function draw() {
  // background(18, 22, 28);
  drawBackground();

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
    textSize(32);
    stroke(0);
    strokeWeight(4);
    fill("tomato");
    text("GAME OVER", width / 2, height / 2 - 30);

    noStroke();
    fill(250);
    textSize(20);
    text("Score: " + score, width / 2, height / 2 + 10);
    text("Press ENTER to restart", width / 2, height / 2 + 50);
  }
}

function drawBackground() {
  imageMode(CORNER);
  image(bgImg, bgX, 0, width, height);
  image(bgImg, bgX + width, 0, width, height);
  bgX -= BG_SPEED;
  if (bgX <= -width) bgX = 0;
}
/* ----------------- Input ----------------- */
function keyPressed() {
  // Make the bird flap on space or UP_ARROW — call bird.flap()
  if (gameState === "playing" && key == " ") {
    bird.flap();
  } else if (gameState === "gameover" && key === "Enter") {
    resetGame();
  }
}

function resetGame() {
  bird = new Bird(120, height / 2);
  pipes = [];
  pipes.push(new Pipe(width + 40));
  score = 0;
  spawnCounter = 0;
  gameState = "playing";
}

/* ----------------- Classes ----------------- */
