// Assets: loads every sprite the game uses from the assets/ folder.
//
// The sprites are your partner's pixel art, already cleaned and cropped by tools/prepare_sprites.py.
// If a file is missing or fails to load, a loud magenta tile with its name is shown instead
// (and the console lists it), so a bad filename is obvious right away.
//
// NOTE: sprites load over HTTP, so run the sketch from a local server
// (VS Code Live Server), not by double-clicking index.html.

// The 16 flowers. "bush" ones (tall, leafy) grow from the bushy shoot; the rest from the thin one.
const SPECIES = [
  { id: "whitetulip", bush: false },
  { id: "pinktulip", bush: false },
  { id: "orangetulip", bush: false },
  { id: "redtulip", bush: false },
  { id: "lily", bush: false },
  { id: "azure", bush: false },
  { id: "daisy", bush: false },
  { id: "sunflower", bush: false },
  { id: "dandelion", bush: false },
  { id: "poppy", bush: false },
  { id: "allium", bush: false },
  { id: "orchid", bush: false },
  { id: "cornflower", bush: false },
  { id: "lilac", bush: true },
  { id: "peony", bush: true },
  { id: "rosebush", bush: true },
];

// How many sprite pixels fit across one soil square. Smaller number = bigger plants.
// Try 140 for bigger flowers or 280 for smaller ones.
const SPRITE_PX_PER_SQUARE = 200;

// The water drop is drawn at its own scale (it is a tiny 6 x 10 sprite).
const DROP_PX_PER_SQUARE = 32;

class Assets {
  constructor() {
    this.images = {};
    this.missing = [];
  }

  // Keys map straight to files: "plants/lily_bloom" -> assets/plants/lily_bloom.png
  loadAll() {
    [
      "seed",
      "seed_dead",
      "shoot_flower",
      "shoot_flower_dead",
      "shoot_bush",
      "shoot_bush_dead",
    ].forEach((n) => this.load(`plants/${n}`));
    SPECIES.forEach((s) => {
      ["grow", "grow_dead", "bloom", "bloom_dead"].forEach((n) =>
        this.load(`plants/${s.id}_${n}`),
      );
    });
    this.load("fx/droplet");
  }

  load(key) {
    loadImage(
      `assets/${key}.png`,
      (img) => {
        this.images[key] = img;
      },
      () => {
        this.missing.push(key);
        this.images[key] = this.makeMissing(key);
        console.warn(`Missing sprite: assets/${key}.png`);
      },
    );
  }

  // Returns the image, or null while it is still loading.
  get(key) {
    return this.images[key] || null;
  }

  makeMissing(key) {
    const g = createGraphics(64, 96);
    g.pixelDensity(1);
    g.noSmooth();
    g.noStroke();
    const cell = 8;
    for (let y = 0; y < 96; y += cell) {
      for (let x = 0; x < 64; x += cell) {
        g.fill(((x + y) / cell) % 2 === 0 ? "#ff00ff" : "#220022");
        g.rect(x, y, cell, cell);
      }
    }
    g.fill(255);
    g.textAlign(CENTER, CENTER);
    g.textSize(8);
    g.text(key.split("/").pop(), 32, 48);
    return g;
  }
}
