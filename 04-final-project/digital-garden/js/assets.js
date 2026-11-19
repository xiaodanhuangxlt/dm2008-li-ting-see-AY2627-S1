// id = the filename part
// name = what the user sees
// bush grow from the bushy shoot
// the rest grow from the thin shoot.
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

const SPRITE_PX_PER_SQUARE = 200;

// cut away the empty transparent border around a picture.
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

  // keys to map directly with files: "plants/lily_bloom" = assets/plants/lily_bloom.png
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
    // tool icons
    ["watercan", "shovel", "bundle"].forEach((n) => this.load(`tools/${n}`));

    // bundle window (choosing flower)
    this.load("ui/BundleInventory");
    // the three status pictures (trim cuts away any empty border)
    ["skull", "star", "waterdroplet"].forEach((n) =>
      this.load(`ui/${n}`, { trim: true }),
    );
    // chest icon
    this.load("ui/chest", { trim: true });
    // chest window (flower collection)
    this.load("ui/ChestInventory");
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

  // true only if real files are loaded
  ok(key) {
    return !!this.images[key] && !this.missing.includes(key);
  }

  // returns the image, or null while it is still loading.
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
