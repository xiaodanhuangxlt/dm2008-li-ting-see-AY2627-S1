// Digital Garden: plants growing in a Minecraft garden.
// P / W / C pick Plant / Water / Clear, then click or drag over soil squares.
// H hide UI · F fullscreen · Space pause · T speed · G grid · B sprite bounds

let grid, clock, video, tools, assets, hud, garden, picker;
let dragStart = null; // the square where the mouse went down (for drag-selecting)
let chosen = null; // the flower species in your hand (null = none chosen yet)
let showGrid = false;
let showBounds = false;
const SPEEDS = [1, 4, 12, 16];
let speedIdx = 0;
let bgm;

// How big the tool icon is (in pixels at normal size) and where it floats next to the mouse.
const TOOL_ICON = { size: 30, offsetX: 0.45, offsetY: 0.45 };
const HELD_FLOWER = "bloom"; // picture of the flower held

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("system-ui, -apple-system, Segoe UI, sans-serif");
  drawingContext.imageSmoothingQuality = "high"; // smoother when big pictures are shrunk
  grid = new SoilGrid();
  clock = new GameClock(7.5); // 07:30
  video = new GardenVideo(document.getElementById("bg"));
  tools = new ToolManager();
  assets = new Assets();
  assets.loadAll();
  hud = new Hud();
  garden = new Garden();
  picker = new Picker();

  bgm = new Audio("assets/c416bgm.mp3");
  bgm.loop = true;
  bgm.volume = 1;
  bgm.play().catch(() => {}); // browsers block autoplay until the first click
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  const rawDt = deltaTime / 1000;

  const simDt = video.ready ? clock.tick(rawDt) : 0;
  video.follow(clock);
  garden.update(simDt);

  clear();
  const hovered = grid.squareAt(mouseX, mouseY);
  // (no square is highlighted while a window is open)
  const picked = picker.isOpen
    ? []
    : dragStart
      ? grid.rect(dragStart, hovered)
      : hovered
        ? [hovered]
        : [];
  if (hud.visible) {
    if (showGrid) {
      grid.drawGrid();
    }
    picked.forEach((sq) => grid.highlight(sq));
  }

  garden.sorted.forEach(({ sq, plant }) => {
    drawSoilTint(plant, sq);
    const [x, y] = grid.foot(sq);
    plant.draw(x, y, spriteUnit(sq), millis() / 1000, assets);
  });
  if (hud.visible) drawBadges();
  if (showBounds)
    garden.sorted.forEach(({ sq, plant }) => drawBounds(sq, plant));

  // the status panel shows the plant under the mouse
  hud.draw(
    clock,
    tools,
    dragStart || picker.isOpen ? null : garden.plantAt(hovered),
    video,
  );
  picker.draw(assets);
  const holding = drawHeldTool();
  video.drawWarning();
  const overSlot = picker.isOpen && picker.slotAt(mouseX, mouseY) >= 0;
  cursor(holding ? "none" : hovered || overSlot ? "pointer" : "default");
}

// Screen pixels per sprite pixel, so the plant is sized to the square it stands on.
function spriteUnit(sq) {
  return grid.width(sq) / SPRITE_PX_PER_SQUARE;
}

// The soil gets darker as the plant's moisture rises.
function drawSoilTint(plant, sq) {
  noStroke();
  fill(40, 22, 8, 110 * constrain(plant.moisture / 100, 0, 1));
  grid.shape(sq);
}

// A status picture above every plant that needs attention (dead / ready / thirsty).
function drawBadges() {
  garden.sorted.forEach(({ sq, plant }) => {
    const kind = plant.badge;
    if (!kind || !assets.ok(BADGE_IMAGES[kind])) return;
    const [x, y] = grid.foot(sq);
    const img = assets.get(plant.spriteKeys(plant.shownStage)[0]);
    const top = img ? img.height * spriteUnit(sq) : 0;
    drawBadge(
      assets.get(BADGE_IMAGES[kind]),
      x,
      y - top,
      hud.s,
      millis() / 1000,
    );
  });
}

// Debug overlay (B): the sprite frame and the anchor point, for lining up artwork.
function drawBounds(sq, plant) {
  const [x, y] = grid.foot(sq);
  const u = spriteUnit(sq);
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

// The icon of the selected tool follows the mouse, so you can see which tool is active.
// Returns true if an icon was drawn (the normal arrow cursor is hidden then).
function drawHeldTool() {
  const tool = tools.active;
  if (picker.isOpen) return false; // the picker has its own look
  // with the Plant tool and a flower chosen, the flower itself is in your hand
  const inHand =
    tool && tool.id === "plant" && chosen
      ? `plants/${chosen.id}_${HELD_FLOWER}`
      : null;
  const img = inHand
    ? assets.get(inHand)
    : tool && assets.ok(tool.icon)
      ? assets.get(tool.icon)
      : null;
  if (!img || mouseX <= 0 || mouseY <= 0 || mouseX >= width || mouseY >= height)
    return false;

  const size = TOOL_ICON.size * hud.s;
  push();
  // move to the middle of the icon: up and to the right of the mouse tip
  translate(
    mouseX + size * TOOL_ICON.offsetX,
    mouseY - size * TOOL_ICON.offsetY,
  );
  // the watering can tips forward while the mouse button is held down
  if (tool.id === "water" && mouseIsPressed) rotate(-0.5);
  drawingContext.imageSmoothingEnabled = false; // keep the pixels crisp
  const k = size / Math.max(img.width, img.height); // fit the picture inside the icon size
  const w = img.width * k,
    h = img.height * k;
  image(img, -w / 2, -h / 2, w, h);
  drawingContext.imageSmoothingEnabled = true;
  pop();

  // a small ring marks the exact spot the tool will act on
  noFill();
  stroke(255, 255, 255, 220);
  strokeWeight(2);
  ellipse(mouseX, mouseY, 10 * hud.s, 10 * hud.s);
  noStroke();
  return true;
}

// Each one takes a list of squares and does its job on every square that allows it.

// The Plant tool has two jobs. With no flower in your hand, a click opens the bundle so you can
// choose one. With a flower in your hand, a click (or a drag) plants it in the empty squares.
function plantSeeds(squares) {
  if (!chosen) {
    picker.open();
    return;
  }

  let planted = 0;
  squares.forEach((sq) => {
    if (garden.plantAt(sq)) return; // already taken
    garden.add(sq, new Plant(chosen)); // every plant is its own Plant object
    planted++;
  });
  if (planted === 0)
    hud.say("Those squares already have plants. Clear them first");
  else if (planted < squares.length)
    hud.say(
      `Planted ${planted} ${chosen.name} seeds (${squares.length - planted} squares were taken)`,
    );
  else
    hud.say(
      planted === 1
        ? `${chosen.name} seed planted`
        : `Planted ${planted} ${chosen.name} seeds`,
    );
}

function waterSquares(squares) {
  let watered = 0,
    soggy = false;
  squares.forEach((sq) => {
    const plant = garden.plantAt(sq);
    if (!plant || plant.isDead) return;
    plant.water();
    watered++;
    if (plant.moisture > Plant.CFG.soggyAbove) soggy = true;
  });
  if (watered === 0) hud.say("Nothing to water here");
  else if (soggy) hud.say("Careful, the soil is getting soggy");
  else hud.say(watered === 1 ? "Watered" : `Watered ${watered} squares`);
}

function clearSquares(squares) {
  let cleared = 0,
    alive = 0;
  squares.forEach((sq) => {
    const plant = garden.plantAt(sq);
    if (!plant) return;
    if (plant.isDead) {
      garden.remove(sq);
      cleared++;
    } else alive++;
  });
  if (cleared > 0)
    hud.say(
      cleared === 1
        ? "Square cleared, ready to replant"
        : `Cleared ${cleared} squares`,
    );
  else if (alive > 0) hud.say("Only withered plants can be cleared");
  else hud.say("Nothing to clear");
}

// Pressing remembers where the drag started. Releasing does the work on the whole rectangle.
function mousePressed() {
  if (picker.isOpen) return false; // the picker handles its own clicks (see mouseReleased)
  dragStart = grid.squareAt(mouseX, mouseY);
  return false;
}

function mouseReleased() {
  // 1. The picker is open: a click on a slot picks that flower, a click outside closes it.
  if (picker.isOpen) {
    const i = picker.slotAt(mouseX, mouseY);
    if (i >= 0) {
      chosen = SPECIES[i]; // the flower is now in your hand
      picker.close();
      hud.say(
        `${chosen.name} selected. Click squares to plant it. Press P to choose another`,
      );
    } else if (!picker.overPanel(mouseX, mouseY)) picker.close();
    return false;
  }
  // 2. Otherwise do the selected tool on the squares that were dragged over.
  if (!dragStart) return false;
  const squares = grid.rect(dragStart, grid.squareAt(mouseX, mouseY));
  dragStart = null;
  if (tools.current === "plant") plantSeeds(squares);
  else if (tools.current === "water") waterSquares(squares);
  else if (tools.current === "clear") clearSquares(squares);
  return false;
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    dragStart = null; // cancel a drag
    picker.close();
  }
  if (picker.isOpen) return false; // no tool keys while choosing a flower
  if (key.toLowerCase() === "p") chosen = null; // P puts the flower back: the bundle shows again
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
