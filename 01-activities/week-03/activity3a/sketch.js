// DM2008 — Activity 3a [Guided]
// Array Sampler (25 min)
//
// An array stores a list of values — here it's colors, but it could be
// sizes, positions, or anything else.
// Press any key to cycle through the array one item at a time.
//
// Try these:
// - Replace the colors with your own values (sizes, positions, text).
// - Use mousePressed() instead of keyPressed().
// - Use push() to add new items or splice() to remove them.
// - Loop through the whole array to draw all items at once.
//
// Stretch: visualize all items in the array simultaneously instead of one at a time.

let palette = [
  "#f6ffea",
  "#ffde96",
  "#fa855a",
  "#c93638",
  "#62c4da",
  "#9381ff",
];
let pinks = ["#ecc4c3", "#b97d7b", "#dc97a5", "#e9cfe8"];
let greens = ["#f3eeb6", "#d4db74", "#9abf17", "#84bf93", "#ddecf1", "#aed9c5"];
let blues = ["#eaf6ff", "#a8dadc", "#62c4da", "#4a90d9", "#2a5db0", "#1a3a6b"];
let yellows = [
  "#fffbea",
  "#ffe895",
  "#ffd93d",
  "#ffc107",
  "#e6a817",
  "#b8860b",
];
let currentIndex = 0;
let lastSwitch = 0;
let switchInterval = 500; //switch every 500ms
let currentX = 0;

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(220);

  // Even spacing based on how many items are in the array
  const spacing = width / (palette.length + 1);
  // Advance to the next color every 500ms
  if (millis() - lastSwitch > switchInterval) {
    currentIndex++;
    if (currentIndex > palette.length - 1) {
      currentIndex = 0;
    }

    lastSwitch = millis();
    console.log("Current index:", currentIndex, "→", palette[currentIndex]);
  }

  for (let i = 0; i < palette.length; i++) {
    const pos = (i + 1) * spacing;
    fill(palette[i]); // use the i-th color

    if (i == currentIndex) {
      fill(palette[i]); //currentIndex circle highlighted
    } else {
      fill(color(palette[i] + "55")); //rest of the circles faded
    }

    // position based on currentIndex
    ellipse(pos, height / 2, 60);
  }

  //ring
  const nextX = (currentIndex + 1) * spacing;
  currentX = lerp(currentX, nextX, 0.08);

  noFill();
  stroke(palette[currentIndex]);
  strokeWeight(3);
  ellipse(currentX, height / 2, 80);
  noStroke();
}

function keyPressed() {
  if (key == "p" || key == "P") {
    palette.push(random(pinks));
    currentIndex++;
  } else if (key == "g" || key == "G") {
    palette.push(random(greens));
    currentIndex++;
  } else if (key == "b" || key == "B") {
    palette.push(random(blues));
    currentIndex++;
  } else if (key == "y" || key == "Y") {
    palette.push(random(yellows));
    currentIndex++;
  } else if (key == "r" || key == "R") {
    // Remove the last color (if any)
    if (palette.length > 0) {
      palette.splice(palette.length - 1, 1);
    }
  }
  console.log("Current index:", currentIndex, "→", palette[currentIndex]);
}
