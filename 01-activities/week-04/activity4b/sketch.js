// DM2008 — Activity 4b [Guided]
// Objects in Motion (50 min)
//
// You have a working Agent class to start with — your job is to bring it to life.
// Each agent moves, changes over time, and is drawn to the screen.
// Mouse click adds a new agent. C clears them all.
//
// Things to try:
// - Change the starting values (size, speed, color) to see what happens
// - Make agents bounce instead of wrap — what needs to change?
// - Add a second method to your class beyond update() and show()
//
// Stretch: give each agent a lifespan — shrink or fade it over time, then remove it.
// Hint: a backward loop lets you safely splice items while iterating.

let agents = [];
const NUM_START = 12;

function setup() {
  createCanvas(600, 400);
  noStroke();

  for (let i = 0; i < NUM_START; i++) {
    let x = random(width);
    let y = random(height);
    let sz = random(12, 36);
    let speedX = random(-2, 2);
    let speedY = random(-2, 2);
    agents.push(new Agent(x, y, sz, speedX, speedY));
  }
}

function draw() {
  background(255, 189, 232);
  // Loop backwards so splice() doesn’t skip items
  for (let i = agents.length - 1; i >= 0; i--) {
    agents[i].update();
    agents[i].shrink();
    agents[i].wobble();
    agents[i].show();

    if (agents[i].sz <=0) {
      agents.splice(i, 1);
    }
  }
}

function mousePressed() {
  let sz = random(16, 80);
  let speedX = random(-2, 3);
  let speedY = random(-2, 3);
  agents.push(new Agent(mouseX, mouseY, sz, speedX, speedY));
}

function keyPressed() {
  // Replacing the array with an empty one effectively clears all agents
  if (key == "C" || key == "c") {
    agents = [];
  }
}

class Agent {
  constructor(x, y, sz, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.sz = sz;
    this.dx = speedX;
    this.dy = speedY;
    this.col = random(255); // a color value that will change over time
    // What else might your agent need to know about itself?
    this.wobbleOffset = random(1000);
  }

  update() {
    // Position changes by speed each frame — can you see why?
    this.x += this.dx;
    this.y += this.dy;

    // This is a property changing over time — try changing size or speed instead
    this.col = (this.col + 1) % 255;

    // This bounces agents at the edges 
    if (this.x > width - this.sz / 2) {
      this.dx *= -1;
    }
    if (this.x < 0 + this.sz / 2) {
      this.dx *= -1;
    }
    if (this.y > height - this.sz / 2) {
      this.dy *= -1;
    }
    if (this.y < 0 + this.sz /2 ) {
      this.dy *= -1;
    }
  }

  show() {
    // this.col drives the color shift — how could you use your other properties here?
    fill(this.col, 222, 200);
    ellipse(this.x, this.y, this.sz);
  }

  shrink(){
    this.sz -= 0.05; // shrink each frame
  }

  wobble() {
    this.x += sin((frameCount + this.wobbleOffset) * 0.1) * 0.5;
    this.y += cos((frameCount + this.wobbleOffset) * 0.1) * 0.5;
  }
}
