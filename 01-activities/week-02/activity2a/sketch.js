// DM2008 — Activity 2a [Guided]
// Mode Switch (20 min)
//
// Keys 1, 2, 3 switch between modes — each one changes the background color.
// Try extending each mode to also change the fill, size, or speed of the ellipse.
// Keep it simple: one clear change per mode that's easy to see on screen.
//
// Stretch: add a 4th mode, or make the ellipse change shape between modes.

let x = 0,
  y = 0; //shape x and y position starting from top left corner
let r, b, bgColor;
let size = 50,
  speed = 2,
  dirX = 1,
  dirY = 1,
  mode = 1;
// 1 = ellipse, 2 = square, 3 = triangle

function setup() {
  createCanvas(400, 400);
  bgColor = color(220);
  rectMode(CENTER);
}

function draw() {
  background(bgColor);
  r = map(mouseX, 0, width, 0, 255); //right is more red
  b = map(mouseX, 0, width, 255, 0); //left is more blue
  // --- Your if/else goes here ---
  if (mouseIsPressed) {
    fill(r, 0, b); //gradient depending on mouseX
  } else {
    fill("#ff8330"); //default colour
  }

  // Draw the ellipse at its current position
  if (mode == 1) {
    ellipse(x, y, size);
  } else if (mode == 2) {
    rect(x, y, size, size);
  } else if (mode == 3) {
    triangle(
      x,
      y - size / 2,
      x - size / 2,
      y + size / 2,
      x + size / 2,
      y + size / 2,
    );
  }

  // Bounce back from the right and left edge
  if (x > width - size / 2) {
    dirX = -1; //reverse to go left
  } else if (x < size / 2) {
    dirX = 1;
  }
  if (y > height - size / 2) {
    dirY = -1; //reverse to go up
  } else if (y < size / 2) {
    dirY = 1;
  }
  x += speed * random(1, 2) * dirX;
  y += speed * dirY;
}

function keyPressed() {
  switch (key) {
    case "1":
      bgColor = color(145, 0, 141); // purple
      size = 50;
      speed = 8; //speed up
      mode = 1;
      break;
    case "2":
      bgColor = color(255, 52, 131); //pink
      size = 90; //size up
      speed = 3;
      mode = 2;
      break;
    case "3":
      bgColor = color(0, 224, 180, 40); //cyan
      size = 50; //ghosting trail
      speed = 3;
      mode = 3;
      break;
    default:
      bgColor = color(220); // grey
      size = 50;
      speed = 3;
      mode = 1;
  }
  if (keyCode === 13) {
    saveCanvas("activity2a-image", "jpg");
  }
}
