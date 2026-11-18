// Interface colours (the cream is the text colour, the others tint the bars).
const PALETTE = {
  cream: "#F7E9CD",
  sage: "#A9C69A",
  sun: "#F4CE76",
  water: "#9BC8DE",
};

// Hud: the on-screen interface (clock, tool buttons, plant status and messages).
class Hud {
  constructor() {
    this.visible = true;
    this.toast = { text: "", until: 0 };
  }

  // Show a short message near the bottom that fades out.
  say(msg) {
    this.toast = { text: msg, until: millis() + 2400 };
  }

  // Everything is multiplied by s, so the interface scales with the window.
  get s() {
    return Math.min(width / 960, height / 600);
  }

  draw(clock, tools, plant, video) {
    const s = this.s;
    const pad = 24 * s;

    if (this.visible) {
      this.drawTools(tools, s, pad);

      let label = clock.label;
      if (!video.ready) label = "Loading video...";
      else if (clock.paused) label += " - paused";
      else if (clock.timeScale !== 1) label += ` - x${clock.timeScale}`;
      this.pill(pad, pad, label, s, false, true); // true = steady digits, so the clock does not jiggle

      if (plant) {
        this.drawStatus(plant, width - pad - 210 * s, pad, 210 * s, s);
        // the flower's name at the bottom, just above where the messages pop up
        textSize(18 * s);
        textAlign(CENTER, CENTER);
        this.shadowText(
          plant.species.name,
          width / 2,
          height - pad - 92 * s,
          s,
          255,
        );
      }

      textSize(13 * s);
      textAlign(LEFT, BOTTOM);
      this.shadowText(
        "H hide UI - F fullscreen - Space pause - T speed - G grid - B sprite bounds",
        pad,
        height - pad * 0.6,
        s,
        255,
      );
    }

    // messages still show when the interface is hidden
    const left = this.toast.until - millis();
    if (left > 0) {
      textSize(18 * s);
      textAlign(CENTER, CENTER);
      this.shadowText(
        this.toast.text,
        width / 2,
        height - pad - 60 * s,
        s,
        255 * constrain(left / 600, 0, 1),
      );
    }
  }

  // Text with a dark shadow behind it (like Minecraft), so it stays readable on any background.
  // alpha = 0-255, how visible the text is (the toast fades out with it).
  shadowText(str, x, y, s, alpha) {
    noStroke();
    fill(20, 14, 10, alpha * 0.85);
    text(str, x + 2 * s, y + 2 * s); // the shadow, a little down and to the right
    fill(247, 233, 205, alpha);
    text(str, x, y);
  }

  // steady = true gives every digit the same width (the widest one). The Minecraft font is
  // proportional ("1" is narrower than "0"), so without this the clock chip would grow and
  // shrink as the time changes.
  pill(x, y, label, s, active, steady = false) {
    textSize(14 * s);
    const padX = 12 * s;
    let cell = 0;
    if (steady)
      for (let d = 0; d <= 9; d++) cell = Math.max(cell, textWidth(String(d)));
    const isDigit = (ch) => steady && ch >= "0" && ch <= "9";
    let textW = 0;
    for (const ch of label) textW += isDigit(ch) ? cell : textWidth(ch);
    const w = textW + padX * 2;
    const h = 30 * s;
    noStroke();
    fill(active ? color(PALETTE.cream) : color(0, 0, 0, 120));
    rect(x, y, w, h, h / 2);
    fill(active ? color("#3b2f2a") : color(PALETTE.cream));
    textAlign(LEFT, CENTER);
    if (!steady) {
      text(label, x + padX, y + h / 2 + 1);
    } else {
      let px = x + padX;
      for (const ch of label) {
        if (isDigit(ch)) {
          text(ch, px + (cell - textWidth(ch)) / 2, y + h / 2 + 1); // centred in its own cell
          px += cell;
        } else {
          text(ch, px, y + h / 2 + 1);
          px += textWidth(ch);
        }
      }
    }
    return w;
  }

  bar(x, y, w, h, value, col) {
    noStroke();
    fill(0, 0, 0, 90);
    rect(x, y, w, h, h / 2);
    fill(col);
    rect(x, y, Math.max(h, (w * constrain(value, 0, 100)) / 100), h, h / 2);
  }

  // The three tool buttons, centred along the bottom.
  drawTools(tools, s, pad) {
    const labels = tools.tools.map((t) => `${t.key.toUpperCase()}  ${t.label}`);
    textSize(14 * s);
    const widths = labels.map((l) => textWidth(l) + 24 * s);
    const total =
      widths.reduce((a, b) => a + b, 0) + 10 * s * (labels.length - 1);
    let x = width / 2 - total / 2;
    const y = height - pad - 30 * s;
    tools.tools.forEach((t, i) => {
      this.pill(x, y, labels[i], s, tools.current === t.id);
      x += widths[i] + 10 * s;
    });
  }

  drawStatus(plant, x, y, w, s) {
    const stageName =
      plant.stage.charAt(0).toUpperCase() + plant.stage.slice(1);
    const stateName =
      plant.state.charAt(0).toUpperCase() + plant.state.slice(1);
    const rowH = 22 * s;
    const hint = plant.isDead
      ? "Withered. Press C to clear it"
      : plant.isThirsty
        ? plant.growth >= Plant.CFG.readyAt
          ? "Fully grown but dry. Water it to collect"
          : "Thirsty. Press W to water"
        : plant.isReady
          ? "Fully grown! Press C to collect"
          : "";
    const h = 38 * s + rowH * 3 + (hint ? 20 * s : 0);
    noStroke();
    fill(0, 0, 0, 120);
    rect(x, y, w, h, 14 * s);
    fill(PALETTE.cream);
    textAlign(LEFT, TOP);
    textSize(14 * s);
    text(`${stageName} - ${stateName}`, x + 14 * s, y + 10 * s);
    const rows = [
      ["Moisture", plant.moisture, PALETTE.water],
      [
        "Health",
        plant.health,
        plant.state === "healthy" ? PALETTE.sage : "#D98E73",
      ],
      ["Growth", plant.growth, PALETTE.sun],
    ];
    textSize(11 * s);
    rows.forEach((r, i) => {
      const ry = y + 38 * s + i * rowH;
      fill(247, 233, 205, 200);
      textAlign(LEFT, TOP);
      text(r[0], x + 14 * s, ry);
      this.bar(x + 84 * s, ry + 3 * s, w - 84 * s - 14 * s, 8 * s, r[1], r[2]);
    });
    if (hint) {
      fill(PALETTE.sun);
      textSize(12 * s);
      textAlign(LEFT, TOP);
      text(hint, x + 14 * s, y + 38 * s + rowH * 3 + 2 * s);
    }
  }
}
