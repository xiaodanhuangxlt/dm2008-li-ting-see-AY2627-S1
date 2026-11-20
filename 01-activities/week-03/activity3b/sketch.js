// DM2008 — Activity 3b
// One Function Wonder (30 min)
//
// Write a function that draws a shape or group of shapes.
// It should take at least one parameter — try x, y, size, or color.
// Call it several times with different values to create variation.
//
// Ideas: a simple face, a flower, a house, an icon.
// Example: myShape(100, 200, 50); myShape(300, 200, 80);
//
// Stretch: call your function inside a for loop to create a repeating pattern.
let petal_no;
let petal_width = 50;
let petal_height = 100;
let angle = 0;
function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
}

function draw() {
  background("#cded76");

  // Call your function here with different values each time
  let osciFlowerNum = 3;
  translate(width / 2, height / 2);
  myFlower(0, 0, 5,"#FFC107");
  for (
    let angle = 0;
    angle < radians(360);
    angle += radians(360 / osciFlowerNum)
  ) {
    push();
    rotate(angle);
    translate(0, 150);
    myFlower(0, 0, 8, "#fad6d3");
    pop();
  }
  
}

function myFlower(x, y, p, petalColor) {
  push();
  //petals
  translate(x, y); //center pos
  rotate(angle);
  petal_no = p;
  for (
    let pAngle = 0;
    pAngle < radians(360);
    pAngle += radians(360 / petal_no)
  ) {
    push();
    // noStroke();
    rotate(pAngle);
    translate(0, petal_height / 2);
    fill(color(petalColor));
    ellipse(0, 0, petal_width, petal_height);
    pop();
  }

  //center
  push();
  fill("#ffeb57");
  ellipse(0, 0, 50);
  pop();

  angle += radians(0.5);
  pop();
}
