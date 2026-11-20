// DM2008 — Activity 5a [Guided]
// Colliding Circles (30 min)
//
// A vector stores position and movement together — cleaner than separate x and y variables.
// Your job is to get two balls moving, then detect and respond to their collision.
//
// Suggested order:
// 1. Create two Ball objects in setup()
// 2. Check the distance between them in draw()
// 3. Trigger a visual response when they collide
// 4. Implement edge behaviour in move() — wrap or bounce, your choice
//
// Stretch: add a third ball, or make the collision response affect both balls.

let balls = [];

function setup() {
  createCanvas(400, 400);
  // Create two balls at different starting positions
  balls.push(new Ball(100, 200));
  balls.push(new Ball(300, 200));
}

function draw() {
  background(230);
  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].show();
    balls[i].checkCollision(balls, i);
  }
}

function mousePressed() {
  balls.push(new Ball(mouseX, mouseY));
}

class Ball {
  constructor(x, y) {
    // pos and vel are vectors — they store x and y together as one object
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.r = 30;
  }

  move() {
    // Adding the velocity vector to position moves the ball each frame
    this.pos.add(this.vel);

    // Handle edges — wrapping
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }

  show() {
    fill(100, 180, 220);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  checkCollision(others, myIndex) {
    for (let i = myIndex + 1; i < others.length; i++) {
      let other = others[i];
      let d = dist(
        this.pos.x + this.r,
        this.pos.y + this.r,
        other.pos.x + other.r,
        other.pos.y + other.r
      );
      if (d < this.r + other.r) {
        this.vel.x *= -1;
        this.vel.y *= -1;
        other.vel.x *= -1;
        other.vel.y *= -1;

        // push the two balls apart so they don't stay overlapping
        let dir = p5.Vector.sub(this.pos, other.pos);
        if (dir.mag() === 0) dir = p5.Vector.random2D();
        // avoid dividing by 0
        dir.normalize();
        let overlap = this.r + other.r - d;
        this.pos.add(p5.Vector.mult(dir, overlap / 2));
        other.pos.sub(p5.Vector.mult(dir, overlap / 2));
      }
    }
  }
}
