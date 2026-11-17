// Droplet: a single falling water drop shown when the plant is watered.
class Droplet {
  // s = overall screen scale (for speed), unit = screen pixels per sprite pixel (for size)
  constructor(x, y, groundY, s, unit) {
    this.x = x;
    this.y = y;
    this.groundY = groundY;
    this.s = s;
    this.unit = unit;
    this.vy = random(120, 220) * s;
  }

  update(dt) {
    this.vy += 700 * this.s * dt;
    this.y += this.vy * dt;
  }

  get done() {
    return this.y >= this.groundY;
  }

  draw(assets) {
    const img = assets.get("assets/fx/droplet");
    if (!img) return;
    const w = Math.round(img.width * this.unit);
    const h = Math.round(img.height * this.unit);
    noTint();
    image(img, Math.round(this.x - w / 2), Math.round(this.y - h / 2), w, h);
  }
}
