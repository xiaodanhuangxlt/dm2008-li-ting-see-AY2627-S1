// converts between video coordinates and screen coordinates so the mouse, grid and plants all line up.
const VIDEO_W = 1920;
const VIDEO_H = 1080;
const BED_COLS = 8;
const BED_ROWS = 4;

// corner coordinates of each bed's soil surface, in video pixels, in order TL TR BR BL
const BEDS = {
  TL: [
    [534, 290], // TL
    [934, 290], // TR
    [932, 452], // BR
    [459, 452], // BL
  ],
  TR: [
    [983, 292],
    [1384, 292],
    [1458, 453],
    [984, 453],
  ],
  BL: [
    [434, 502],
    [930, 502],
    [922, 758],
    [319, 758],
  ],
  BR: [
    [987, 502],
    [1480, 502],
    [1598, 759],
    [991, 759],
  ],
};

// used AI to generate the perspective math so the squares line up with the ones in the video
// and which square is the mouse on.

// The perspective-correct version: give it a position u, v from 0 to 1 across a bed
// and it returns the matching point in the video.
// input q[], the four corners of a bed
function makeProjector(q) {
  const [x0, y0] = q[0],
    [x1, y1] = q[1],
    [x2, y2] = q[2],
    [x3, y3] = q[3];
  const dx1 = x1 - x2,
    dx2 = x3 - x2,
    dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2,
    dy2 = y3 - y2,
    dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1,
    b = x3 - x0 + h * x3,
    c = x0;
  const d = y1 - y0 + g * y1,
    e = y3 - y0 + h * y3,
    f = y0;

  // output function (u, v) => [x, y]
  // u and v each run from 0 to 1 across the bed. (0, 0) is the TL corner,
  // (1, 1) is the bottom-right,
  // and (0.5, 0.5) is the middle.
  return (u, v) => {
    const w = g * u + h * v + 1;
    return [(a * u + b * v + c) / w, (d * u + e * v + f) / w];
  };
}

// is the mouse inside this square?
function pointInQuad(px, py, q) {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const [ax, ay] = q[i];
    const [bx, by] = q[(i + 1) % 4];
    const cross = (bx - ax) * (py - ay) - (by - ay) * (px - ax);
    if (cross !== 0) {
      const s = cross > 0 ? 1 : -1;
      if (sign === 0) sign = s;
      else if (s !== sign) return false;
    }
  }
  return true;
}

class SoilGrid {
  constructor() {
    // Building all 128 squares
    // One object per soil square, with its four corners and its centre (in video pixels).
    // Flower will stand in the centre.
    this.squares = [];
    Object.keys(BEDS).forEach((bed) => {
      const project = makeProjector(BEDS[bed]);
      for (let row = 0; row < BED_ROWS; row++) {
        for (let col = 0; col < BED_COLS; col++) {
          const u0 = col / BED_COLS,
            u1 = (col + 1) / BED_COLS;
          const v0 = row / BED_ROWS,
            v1 = (row + 1) / BED_ROWS;
          this.squares.push({
            id: `${bed}-${col}-${row}`,
            bed,
            col,
            row,
            corners: [
              project(u0, v0), // TL
              project(u1, v0), // TR
              project(u1, v1), // BR
              project(u0, v1), // BL
            ],
            center: project((u0 + u1) / 2, (v0 + v1) / 2),
          });
        }
      }
    });
  }

  // The bg <video> uses object-fit: cover, so it is scaled up until it fills the window and the
  // overflow is cropped equally on both sides. This repeats that maths, so anything we draw on
  // the canvas lands on the right pixel of the video at any window size.
  fit() {
    const scale = Math.max(width / VIDEO_W, height / VIDEO_H);
    return {
      scale,
      ox: (width - VIDEO_W * scale) / 2,
      oy: (height - VIDEO_H * scale) / 2,
    };
  }

  // Video pixel [x, y] -> screen pixel [x, y].
  toScreen(p) {
    const f = this.fit();
    return [p[0] * f.scale + f.ox, p[1] * f.scale + f.oy];
  }

  // The four corners of a square, in screen pixels.
  corners(sq) {
    return sq.corners.map((p) => this.toScreen(p));
  }

  // Where a plant's base stands on a square, in screen pixels.
  foot(sq) {
    return this.toScreen(sq.center);
  }

  // How wide a square looks on screen, in pixels
  // near squares are wider than far ones
  // used to size the plant sprite
  width(sq) {
    const c = this.corners(sq);
    return (
      (dist(c[0][0], c[0][1], c[1][0], c[1][1]) +
        dist(c[3][0], c[3][1], c[2][0], c[2][1])) /
      2
    );
  }

  // Look up a square by its id
  // E.g. grid.find("BL-3-2")
  find(id) {
    return this.squares.find((s) => s.id === id) || null;
  }

  // Which square is the mouse on?
  // Loops through the squares and returns the first one
  // whose screen corners contain the mouse
  // Return null if none
  squareAt(mx, my) {
    for (const sq of this.squares) {
      if (pointInQuad(mx, my, this.corners(sq))) return sq;
    }
    return null;
  }

  // All the squares in the rectangle between square a and square b (a drag-selection).
  // A selection stays inside one bed: if b is in a different bed, only a is returned.
  rect(a, b) {
    if (!a) return [];
    if (!b || b.bed !== a.bed) return [a];
    const c0 = Math.min(a.col, b.col),
      c1 = Math.max(a.col, b.col);
    const r0 = Math.min(a.row, b.row),
      r1 = Math.max(a.row, b.row);
    return this.squares.filter(
      (s) =>
        s.bed === a.bed &&
        s.col >= c0 &&
        s.col <= c1 &&
        s.row >= r0 &&
        s.row <= r1,
    );
  }

  // Draw one square as a shape,
  // using whatever fill and stroke are currently set.
  shape(sq) {
    const c = this.corners(sq);
    quad(
      c[0][0],
      c[0][1],
      c[1][0],
      c[1][1],
      c[2][0],
      c[2][1],
      c[3][0],
      c[3][1],
    );
  }

  // Draws all 128 outlines
  drawGrid() {
    stroke(255, 255, 255, 110);
    strokeWeight(1);
    noFill();
    this.squares.forEach((sq) => this.shape(sq));
    // and a dot at each centre: this is where a flower will stand
    noStroke();
    fill(255, 255, 255, 170);
    this.squares.forEach((sq) => {
      const [x, y] = this.foot(sq);
      ellipse(x, y, 5, 5);
    });
  }

  // Draws one square with a white outline and a light fill.
  highlight(sq) {
    stroke(255);
    strokeWeight(2);
    fill(255, 255, 255, 80);
    this.shape(sq);
  }
}
