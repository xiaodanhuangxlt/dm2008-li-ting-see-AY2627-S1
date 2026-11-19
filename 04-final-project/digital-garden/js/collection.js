const CHEST = { size: 64, margin: 24 }; // icon size and distance from the corner

class Collection {
  constructor() {
    this.isOpen = false;
    this.pulse = 0; // 1 -> 0 after collecting a flower, make the chest bounce
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
  close() {
    this.isOpen = false;
  }
  bump() {
    this.pulse = 1;
  }
  slotAt(mx, my) {
    return slotAt(mx, my, PANELS.chest);
  }
  overPanel(mx, my) {
    return overPanel(mx, my, PANELS.chest);
  }

  // chest at bottom-right corner of screen
  box() {
    const size = CHEST.size * hud.s,
      m = CHEST.margin * hud.s;
    return { x: width - m - size, y: height - m - size, size };
  }

  chestHit(mx, my) {
    const b = this.box();
    return mx >= b.x && mx <= b.x + b.size && my >= b.y && my <= b.y + b.size;
  }

  // chest with number badge
  drawChest(assets, inventory) {
    this.pulse = Math.max(0, this.pulse - deltaTime / 400);
    const b = this.box();
    const grow =
      1 + this.pulse * 0.25 + (this.chestHit(mouseX, mouseY) ? 0.08 : 0);
    const cx = b.x + b.size / 2,
      cy = b.y + b.size / 2;

    push();
    translate(cx, cy);
    scale(grow);
    if (assets.ok("ui/chest")) {
      // fits  picture inside the box without squashing it
      const img = assets.get("ui/chest");
      const k = b.size / Math.max(img.width, img.height);
      image(
        img,
        (-img.width * k) / 2,
        (-img.height * k) / 2,
        img.width * k,
        img.height * k,
      );
    } else {
      // no picture yet, a simple brown box
      noStroke();
      fill(139, 94, 52);
      rect(-b.size * 0.4, -b.size * 0.25, b.size * 0.8, b.size * 0.55, 4);
      fill(240, 200, 70);
      rect(-b.size * 0.06, -b.size * 0.08, b.size * 0.12, b.size * 0.2);
    }

    // number badge on the top-right corner
    const r = 13 * hud.s;
    const bx = b.size * 0.38,
      by = -b.size * 0.38;
    stroke(255);
    strokeWeight(2 * hud.s);
    fill(PALETTE.sun);
    ellipse(bx, by, r * 2.2 + (inventory.total > 99 ? 8 * hud.s : 0), r * 2);
    noStroke();
    fill("#3b2f2a");
    textAlign(CENTER, CENTER);
    textSize(14 * hud.s);
    text(inventory.total, bx, by + 1);
    pop();
  }

  // chest window
  // add on top of picture a dark cover on flowers user havs never collected,
  // and number counts of collected flower
  drawWindow(assets, inventory) {
    if (!this.isOpen) return;
    const P = PANELS.chest;
    const L = drawPanel(assets, P);
    const hover = this.slotAt(mouseX, mouseY);
    for (let i = 0; i < 16; i++) {
      const b = slotBox(i, L, P);
      const n = inventory.count(SPECIES[i].id);
      if (!assets.ok(P.key))
        drawSlotFlower(assets, i, b, n === 0); // only without your picture
      else if (n === 0) {
        noStroke();
        fill(0, 0, 0, 150); // dim: not collected yet
        rect(b.x, b.y, b.w, b.h);
      }
      if (n > 0) {
        //item count
        textAlign(RIGHT, BOTTOM);
        textSize(b.h * 0.3);
        stroke(40, 40, 40);
        strokeWeight(b.h * 0.05);
        fill(255);
        text(n, b.x + b.w - b.w * 0.08, b.y + b.h - b.h * 0.04);
        noStroke();
      }
    }
    drawSlotOutlines(L, P);
    if (hover >= 0) {
      const sp = SPECIES[hover];
      drawCaption(L, `${sp.name} - ${inventory.count(sp.id)} collected`);
    } else
      drawCaption(
        L,
        `${inventory.total} flowers collected. Click anywhere to close`,
      );
  }
}
