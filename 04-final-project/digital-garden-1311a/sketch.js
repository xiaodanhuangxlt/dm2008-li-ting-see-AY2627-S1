// Digital Garden: Step 5 - spites instead of shape.
// P / W / C select Plant / Water / Clear, then click a soil square.
// G grid · Space pause · T speed (1x / 4x / 12x)

let grid, clock, video, tools, assets;
let plant = null; // no plant until the player plants one
let plantSquare = null; // the soil square it stands on
let toast = { text: "", until: 0 };
let showGrid = false;
const SPEEDS = [1, 4, 12, 16];
let speedIdx = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = new SoilGrid();
  clock = new GameClock(7.5); // 07:30
  video = new GardenVideo(document.getElementById("bg"));
  tools = new ToolManager();
  assets = new Assets();
  assets.loadAll();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  const simDt = video.ready ? clock.tick(deltaTime / 1000) : 0;
  video.follow(clock);

  // Update the plant in slices of at most 0.25s so fast-forward stays accurate.
  if (plant && simDt > 0) {
    const steps = Math.max(1, Math.ceil(simDt / 0.25));
    for (let i = 0; i < steps; i++) plant.update(simDt / steps);
  }

  clear();
  const hovered = grid.squareAt(mouseX, mouseY);
  if (showGrid) {
    grid.drawGrid();
  }

  if (hovered) {
    grid.highlight(hovered);
  }
  if (plant) {
    const [x, y] = grid.foot(plantSquare);
    plant.draw(x, y, spriteUnit(), millis() / 1000, assets);
  }
  drawDebugText();
  drawToast();
  video.drawWarning();
  cursor(hovered ? "pointer" : "default");
}

// Screen pixels per sprite pixel, so the plant is sized to the square it stands on.
function spriteUnit() {
  return grid.width(plantSquare) / SPRITE_PX_PER_SQUARE;
}

// lines array now shows time, then stage and state, moisture, health and growth.
function drawDebugText() {
  let time = clock.label;
  if (!video.ready) time = "Loading video…";
  else if (clock.paused) time += " · paused";
  else if (clock.timeScale !== 1) time += ` · x${clock.timeScale}`;

  const lines = [time, `tool: ${tools.current}`];
  if (plant) {
    lines.push(
      `stage: ${plant.stage}   state: ${plant.state}`,
      `moisture: ${plant.moisture.toFixed(0)}`,
      `health: ${plant.health.toFixed(0)}`,
      `growth: ${plant.growth.toFixed(0)}`,
    );
  }
  textSize(16);
  textAlign(LEFT, TOP);
  const w = Math.max(...lines.map((l) => textWidth(l))) + 32;
  const h = lines.length * 24 + 16;
  noStroke();
  fill(0, 0, 0, 130);
  rect(24, 24, w, h, 12);
  fill(255);
  lines.forEach((l, i) => text(l, 40, 32 + i * 24));
}

// A short message near the bottom that fades out.
function say(msg) {
  toast = { text: msg, until: millis() + 2400 };
}

function drawToast() {
  const left = toast.until - millis();
  if (left <= 0) return;
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(255, 255 * constrain(left / 600, 0, 1));
  text(toast.text, width / 2, height - 60);
}

function mousePressed() {
  const sq = grid.squareAt(mouseX, mouseY);
  if (!sq) return;

  if (tools.current === "plant") {
    if (plant) say("There is already a plant. Clear it first");
    else {
      plant = new Plant();
      plantSquare = sq;
      say("Seed planted");
    }
  } else if (tools.current === "water") {
    if (!plant) say("Nothing planted yet");
    else if (sq !== plantSquare) say("There is no plant on this square");
    else if (plant.isDead) say("It's too late to water this one");
    else {
      plant.water();
      if (plant.moisture > Plant.CFG.soggyAbove)
        say("Careful, the soil is getting soggy");
    }
  } else if (tools.current === "clear") {
    if (!plant) say("Nothing to clear");
    else if (sq !== plantSquare) say("There is no plant on this square");
    else if (!plant.isDead) say("Only withered plants can be cleared");
    else {
      plant = null;
      plantSquare = null;
      say("Square cleared, ready to replant");
    }
  }
  return false;
}

function keyPressed() {
  if (tools.select(key)) return false;
  const k = key.toLowerCase();
  if (k === "g") showGrid = !showGrid;
  else if (k === "t") {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    clock.timeScale = SPEEDS[speedIdx];
  } else if (key === " ") {
    clock.paused = !clock.paused;
    return false;
  }
}
