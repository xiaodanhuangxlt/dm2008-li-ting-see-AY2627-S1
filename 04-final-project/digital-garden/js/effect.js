// Effects: the status pictures that float above plants.

// Which picture goes with which status. These are your pictures in assets/ui/.
const BADGE_IMAGES = {
  dead: "ui/skull", // the plant has died
  ready: "ui/star", // fully grown, ready to collect
  thirsty: "ui/waterdroplet", // the soil is dry
};
const BADGE = { size: 18 }; // badge size in pixels at normal size

// Draw one status picture floating just above a plant.
function drawBadge(img, x, y, s, t) {
  const bob = Math.sin(t * 3) * 3 * s; // gentle up-and-down
  const k = (BADGE.size * s) / Math.max(img.width, img.height);
  const w = img.width * k,
    h = img.height * k;
  image(img, x - w / 2, y - h - 6 * s + bob, w, h);
}
