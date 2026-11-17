// Digital Garden: one plant growing in a Minecraft garden.
// P / W / R pick Plant / Water / Clear, then click a soil square.
// H hide UI · F fullscreen · Space pause · T speed · G grid · B sprite bounds

let grid, clock, video, tools, assets, hud;
let plant = null; // no plant until the player plants one
let plantSquare = null; // the soil square it stands on
let drops = [];
let showGrid = false;
let showBounds = false;
const SPEEDS = [1, 4, 12, 16];
let speedIdx = 0;
let bgm;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("system-ui, -apple-system, Segoe UI, sans-serif");
  grid = new SoilGrid();
  clock = new GameClock(7.5); // 07:30
  video = new GardenVideo(document.getElementById("bg"));
  tools = new ToolManager();
  assets = new Assets();
  assets.loadAll();
  hud = new Hud();

  bgm = new Audio("assets/c416bgm.mp3");
  bgm.loop = true;
  bgm.volume = 1;
  bgm.play();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  const rawDt = deltaTime / 1000;

  const simDt = video.ready ? clock.tick(rawDt) : 0;
  video.follow(clock);

  // Update the plant in slices of at most 0.25s so fast-forward stays accurate.
  if (plant && simDt > 0) {
    const steps = Math.max(1, Math.ceil(simDt / 0.25));
    for (let i = 0; i < steps; i++) plant.update(simDt / steps);
  }

  const dropDt = Math.min(rawDt, 0.1);
  drops.forEach((d) => d.update(dropDt));
  drops = drops.filter((d) => !d.done);

  clear();
  const hovered = grid.squareAt(mouseX, mouseY);
  if (hud.visible) {
    if (showGrid) {
      grid.drawGrid();
    }

    if (hovered) {
      grid.highlight(hovered);
    }
  }

  if (plant) {
    drawSoilTint();
    const [x, y] = grid.foot(plantSquare);
    plant.draw(x, y, spriteUnit(), millis() / 1000, assets);
  }

  drops.forEach((d) => d.draw(assets));
  if (showBounds && plant) drawBounds();

  hud.draw(clock, tools, plant, video);
  video.drawWarning();
  cursor(hovered ? "pointer" : "default");
}

// Screen pixels per sprite pixel, so the plant is sized to the square it stands on.
function spriteUnit() {
  return grid.width(plantSquare) / SPRITE_PX_PER_SQUARE;
}

// Same idea for the water drops, which have their own scale.
function dropUnit() {
  return grid.width(plantSquare) / DROP_PX_PER_SQUARE;
}

// The soil gets darker as the plant's moisture rises.
function drawSoilTint() {
  noStroke();
  fill(40, 22, 8, 110 * constrain(plant.moisture / 100, 0, 1));
  grid.shape(plantSquare);
}

// Debug overlay (B): the sprite frame and the anchor point, for lining up artwork.
function drawBounds() {
  const [x, y] = grid.foot(plantSquare);
  const u = spriteUnit();
  const img = assets.get(plant.spriteKeys(plant.shownStage)[0]);
  const w = img ? img.width * u : 0;
  const h = img ? img.height * u : 0;
  noFill();
  strokeWeight(1);
  stroke(255, 0, 255, 200);
  rect(x - w / 2, y - h, w, h);
  stroke(0, 255, 255);
  line(x - 8, y, x + 8, y);
  line(x, y - 8, x, y + 8);
  noStroke();
}

// A burst of drops falling onto the plant's square.
function splash() {
  const [x, y] = grid.foot(plantSquare);
  const sw = grid.width(plantSquare);
  for (let i = 0; i < 16; i++) {
    drops.push(
      new Droplet(
        x + random(-0.4, 0.4) * sw,
        y - sw * random(1.8, 3.2),
        y,
        hud.s,
        dropUnit(),
      ),
    );
  }
}

function mousePressed() {
  const sq = grid.squareAt(mouseX, mouseY);
  if (!sq) return;

  if (tools.current === "plant") {
    if (plant) hud.say("There is already a plant. Clear it first");
    else {
      plant = new Plant();
      plantSquare = sq;
      hud.say("Seed planted");
    }
  } else if (tools.current === "water") {
    if (!plant) hud.say("Nothing planted yet");
    else if (sq !== plantSquare) hud.say("There is no plant on this square");
    else if (plant.isDead) hud.say("It's too late to water this one");
    else {
      plant.water();
      splash();
      if (plant.moisture > Plant.CFG.soggyAbove)
        hud.say("Careful, the soil is getting soggy");
    }
  } else if (tools.current === "clear") {
    if (!plant) hud.say("Nothing to clear");
    else if (sq !== plantSquare) hud.say("There is no plant on this square");
    else if (!plant.isDead) hud.say("Only withered plants can be cleared");
    else {
      plant = null;
      plantSquare = null;
      hud.say("Square cleared, ready to replant");
    }
  }
  return false;
}

function keyPressed() {
  if (tools.select(key)) return false;
  const k = key.toLowerCase();
  if (k === "h") hud.visible = !hud.visible;
  else if (k === "g") showGrid = !showGrid;
  else if (k === "b") showBounds = !showBounds;
  else if (k === "f") fullscreen(!fullscreen());
  else if (k === "t") {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    clock.timeScale = SPEEDS[speedIdx];
  } else if (key === " ") {
    clock.paused = !clock.paused;
    return false;
  }
}
