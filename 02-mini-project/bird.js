class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.w = 34; //bee's w & h
    this.h = 33;
    this.r = 16; //for collision match
    this.gravity = 0.45;
    this.flapStrength = -6.0;
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  flap() {
    // A negative y velocity moves the bird upward
    this.vel.y = this.flapStrength;
  }

  update() {
    this.applyForce(this.gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Keep the bird within the canvas vertically
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }

    // Touching the ground is game over — same as hitting a pipe
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
    }
  }

  show() {
    push();
    imageMode(CENTER);
    image(beeImg, this.pos.x, this.pos.y, this.w, this.h);
    pop();
    // fill(255, 205, 80);
    // circle(this.pos.x, this.pos.y, this.r * 2);
    // fill(40);
    // circle(this.pos.x + 6, this.pos.y - 4, 4);
  }
}
