// Assets: loads every sprite the game uses from the assets/ folder.
//
// The sprites are your partner's pixel art, already cleaned and cropped by tools/prepare_sprites.py.
// If a file is missing or fails to load, a loud magenta tile with its name is shown instead
// (and the console lists it), so a bad filename is obvious right away.
//
// NOTE: sprites load over HTTP, so run the sketch from a local server
// (VS Code Live Server), not by double-clicking index.html.

// The 16 flowers: id = the filename part, name = what the player sees. "bush" ones (tall, leafy) grow from the bushy shoot; the rest from the thin one.
const SPECIES = [
  { id: "whitetulip", name: "White Tulip", bush: false },
  { id: "pinktulip", name: "Pink Tulip", bush: false },
  { id: "orangetulip", name: "Orange Tulip", bush: false },
  { id: "redtulip", name: "Red Tulip", bush: false },
  { id: "lily", name: "Lily of the Valley", bush: false },
  { id: "azure", name: "Azure Bluet", bush: false },
  { id: "daisy", name: "Oxeye Daisy", bush: false },
  { id: "sunflower", name: "Sunflower", bush: false },
  { id: "dandelion", name: "Dandelion", bush: false },
  { id: "poppy", name: "Poppy", bush: false },
  { id: "allium", name: "Allium", bush: false },
  { id: "orchid", name: "Blue Orchid", bush: false },
  { id: "cornflower", name: "Cornflower", bush: false },
  { id: "lilac", name: "Lilac", bush: true },
  { id: "peony", name: "Peony", bush: true },
  { id: "rosebush", name: "Rose Bush", bush: true },
];

// How many sprite pixels fit across one soil square. Smaller number = bigger plants.
// Try 140 for bigger flowers or 280 for smaller ones.
const SPRITE_PX_PER_SQUARE = 200;

// Cut away the empty (transparent) border around a picture.
function trimTransparent(img) {
  img.loadPixels();
  let x0 = img.width,
    y0 = img.height,
    x1 = -1,
    y1 = -1;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (img.pixels[(y * img.width + x) * 4 + 3] > 10) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
    }
  }
  if (x1 < 0) return img;
  return img.get(x0, y0, x1 - x0 + 1, y1 - y0 + 1);
}

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
    // the three tool icons (your Minecraft images)
    ["watercan", "shovel", "bundle"].forEach((n) => this.load(`tools/${n}`));

    // the bundle window for choosing a flower (optional: if it is missing, a plain window is drawn with code)
    this.load("ui/BundleInventory");
    // the three status pictures (trim cuts away any empty border)
    ["skull", "star", "waterdroplet"].forEach((n) =>
      this.load(`ui/${n}`, { trim: true }),
    );
  }

  load(key, opts = {}) {
    loadImage(
      `assets/${key}.png`,
      (img) => {
        this.images[key] = opts.trim ? trimTransparent(img) : img;
      },
      () => {
        this.missing.push(key);
        this.images[key] = this.makeMissing(key);
        console.warn(`Missing sprite: assets/${key}.png`);
      },
    );
  }

  // true only if the real file loaded (not the magenta stand-in)
  ok(key) {
    return !!this.images[key] && !this.missing.includes(key);
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
