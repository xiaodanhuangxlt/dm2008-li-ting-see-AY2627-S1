// bundle and chest windows
const PANELS = {
  bundle: {
    key: "ui/BundleInventory",
    width: 1551,
    height: 2048,
    colX: [98, 460, 823, 1185],
    rowY: [284, 647, 1033, 1396],
    slotW: 266,
    slotH: 266,
    showHeight: 460,
  },
  chest: {
    key: "ui/ChestInventory",
    width: 1915,
    height: 2048,
    colX: [133, 545, 957, 1368],
    rowY: [337, 723, 1106, 1491],
    slotW: 411,
    slotH: 386,
    showHeight: 460,
  },
};

// "sc" is screen pixels per picture pixel
// where both windows will appear on screen
function panelLayout(P) {
  const sc = (P.showHeight * hud.s) / P.height;
  const w = P.width * sc,
    h = P.height * sc;
  // 45 * hud.s lifts the window so the name under it clears the P / W / C buttons
  return { sc, w, h, x: width / 2 - w / 2, y: height / 2 - h / 2 - 40 * hud.s };
}

// slot number of flowers 0 - 15
function slotBox(i, L, P) {
  const col = i % 4,
    row = Math.floor(i / 4);
  return {
    x: L.x + P.colX[col] * L.sc,
    y: L.y + P.rowY[row] * L.sc,
    w: P.slotW * L.sc,
    h: P.slotH * L.sc,
  };
}

// finding the slot index under mouse
function slotAt(mx, my, P) {
  const L = panelLayout(P);
  for (let i = 0; i < 16; i++) {
    const b = slotBox(i, L, P);
    if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) return i;
  }
  return -1;
}

function overPanel(mx, my, P) {
  const L = panelLayout(P);
  return mx >= L.x && mx <= L.x + L.w && my >= L.y && my <= L.y + L.h;
}

// darken the screen behind and draw window picture
function drawPanel(assets, P) {
  const L = panelLayout(P);
  noStroke();
  fill(0, 0, 0, 120);
  rect(0, 0, width, height);

  if (assets.ok(P.key)) {
    image(assets.get(P.key), L.x, L.y, L.w, L.h);
  } else {
    fill(139, 112, 76);
    stroke(40, 28, 18);
    strokeWeight(4 * L.sc);
    rect(L.x, L.y, L.w, L.h, 20 * L.sc);
    noStroke();
    for (let i = 0; i < 16; i++) {
      const b = slotBox(i, L, P);
      fill(70, 55, 40);
      rect(b.x, b.y, b.w, b.h);
    }
  }
  return L;
}

// when window picture is missing, draw the bloomed flower picture shrunk to fit inside a slot.
function drawSlotFlower(assets, i, b, dim) {
  const pic = assets.get(`plants/${SPECIES[i].id}_bloom`);
  if (!pic) return;
  const k = Math.min(b.w / pic.width, b.h / pic.height) * 0.85;
  const w = pic.width * k,
    h = pic.height * k;
  if (dim) tint(30, 30, 30, 170);
  image(pic, b.x + (b.w - w) / 2, b.y + (b.h - h) / 2, w, h);
  noTint();
}

// debug (press B): outline every slot to check the numbers in PANELS against uploaded picture
function drawSlotOutlines(L, P) {
  if (!showBounds) return;
  noFill();
  stroke(255, 0, 255);
  strokeWeight(1);
  for (let i = 0; i < 16; i++) {
    const b = slotBox(i, L, P);
    rect(b.x, b.y, b.w, b.h);
  }
  noStroke();
}

// name of flower just under the window
function drawCaption(L, str) {
  textAlign(CENTER, TOP);
  textSize(16 * hud.s);
  stroke(30, 20, 10);
  strokeWeight(4 * hud.s);
  fill(247, 233, 205);
  text(str, L.x + L.w / 2, L.y + L.h + 10 * hud.s);
  noStroke();
}

// picker is the bundle window
class Picker {
  constructor() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }
  slotAt(mx, my) {
    return slotAt(mx, my, PANELS.bundle);
  }
  overPanel(mx, my) {
    return overPanel(mx, my, PANELS.bundle);
  }

  draw(assets) {
    if (!this.isOpen) return;
    const P = PANELS.bundle;
    const L = drawPanel(assets, P);
    const hover = this.slotAt(mouseX, mouseY);
    for (let i = 0; i < 16; i++) {
      const b = slotBox(i, L, P);
      if (!assets.ok(P.key)) drawSlotFlower(assets, i, b, false); // only without your picture
      if (i === hover) {
        noStroke();
        fill(255, 255, 255, 70);
        rect(b.x, b.y, b.w, b.h);
      }
    }
    drawSlotOutlines(L, P);
    if (hover >= 0) drawCaption(L, SPECIES[hover].name);
  }
}
