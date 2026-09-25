class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.speed = PIPE_SPEED;
    this.tileHeight = 60;

    const margin = 40;
    const gapY = random(margin, height - margin - PIPE_GAP);
    this.top = gapY;
    this.bottom = gapY + PIPE_GAP;

    this.passed = false;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    // fill(120, 200, 160);
    let tileHeight = this.tileHeight;
    for (let i = this.top - tileHeight; i >= -tileHeight; i -= tileHeight) {
      image(pipeImg, this.x, i);
    }

    for (let i = this.bottom; i < height; i += tileHeight) {
      image(pipeImg, this.x, i);
    }
    // image(pipeImg, this.x, 0, this.w, this.top);
    // image(pipeImg, this.x, this.bottom, this.w, height - this.bottom);
    noFill();
    // stroke("red");
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
    // noStroke();
  }

  offscreen() {
    // 'return' sends a value back to wherever this method was called
    // We'll cover this properly next week, for now just know it gives back true or false
    return this.x + this.w < 0;
  }

  // Checks if the bird overlaps with either pipe rectangle
  // 1) Is the bird within the pipe's x range?
  // 2) If yes, is it outside the gap — above the top or below the bottom?
  hits(bird) {
    const withinX =
      bird.pos.x + bird.r > this.x && bird.pos.x - bird.r < this.x + this.w;
    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;
    return withinX && (aboveGap || belowGap);
  }
}
