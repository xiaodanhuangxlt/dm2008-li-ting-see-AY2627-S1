const BADGE_IMAGES = {
  dead: "ui/skull", // plant died
  ready: "ui/star", // when plants are fully grown, ready to collect
  thirsty: "ui/waterdroplet", // when the soil is dry
};
const BADGE = { size: 18 };

// floating status badge
function drawBadge(img, x, y, s, t) {
  const bob = Math.sin(t * 3) * 3 * s; // bob up-and-down
  const k = (BADGE.size * s) / Math.max(img.width, img.height);
  const w = img.width * k,
    h = img.height * k;
  image(img, x - w / 2, y - h - 6 * s + bob, w, h);
}
