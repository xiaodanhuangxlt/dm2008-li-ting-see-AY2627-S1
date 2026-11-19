// DM2008 — Activity 2b [Guided]
// Pattern Making (40 min)
//
// Use a for loop to draw a repeating row of shapes.
// Add a condition to introduce variation — alternating color, size, or spacing.
// Then add one interaction (mouse or key) that changes the rule.
//
// Stretch: try a second row, or turn your row into a 2D grid.
let total_columns;
let altColor;
let colorChange = true;

function setup() {
  createCanvas(400, 400);
  altColor = color(random(255), 0, 0);
}

function draw() {
  background(240, 10);
  let sinWave = sin(frameCount * 0.02);
  let d = map(sinWave, -1, 1, 30, 80);
  let r = d / 2;
  total_columns = floor(width / d);
  let offset = (width - total_columns * d) / 2;

  for (let x = 0; x < total_columns; x++) {
    //row no.
    for (let y = 0; y < total_columns; y++) {
      //col no.
      if (keyIsPressed) {
        if (colorChange) {
          altColor = color(random(255), 0, 0);
          colorChange = false;
        }
        fill(altColor);
      } else if ((x % 2 == 0 && y % 2 == 1) || (x % 2 == 1 && y % 2 == 0)) {
        //even row and odd col OR odd row and even col
        //first row is 0, second row is 1
        fill(50);
      } else {
        fill(190);
      }

      circle(x * d + r + offset, y * d + r + offset, d);
    }
  }
}

function keyReleased() {
  colorChange = true;
}
