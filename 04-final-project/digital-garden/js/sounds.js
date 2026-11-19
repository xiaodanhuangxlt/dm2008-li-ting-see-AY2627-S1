const SOUND_FILES = {
  plant: ["sounds/plant1.mp3", "sounds/plant2.mp3", "sounds/plant3.mp3"], // one is picked at random
  water: ["sounds/water.mp3"],
  shovel: ["sounds/shovel.mp3"],
  pop: ["sounds/pop.mp3"], // a flower was collected
  ready: ["sounds/ready.wav"], // a plant just became ready to collect (the star badge appears)
  error: ["sounds/error.wav"], // you tried to plant on a square that already has a plant / shovel a spot with no dead plant etc.
};
const SOUND_VOLUME = {
  plant: 0.6,
  water: 0.6,
  shovel: 0.6,
  pop: 0.6,
  ready: 0.6,
  error: 0.6,
}; // 0 -1, 0 is silent

const POP_MAX = 10; // at most this many pops for one collect, however many flowers you pick
const POP_GAP = 70; // ms between pops so the sound effect ripple instead of piling up

class Sounds {
  constructor() {
    this.clips = {};
    Object.keys(SOUND_FILES).forEach((name) => {
      this.clips[name] = SOUND_FILES[name].map((file) => {
        const audio = new Audio(`assets/${file}`);
        audio.preload = "auto";
        audio.volume = SOUND_VOLUME[name];
        audio.addEventListener("error", () =>
          console.warn(`Missing sound: assets/${file}`),
        );
        return audio;
      });
    });
  }

  // play one sound. delay = ms to wait first.
  play(name, delay = 0) {
    const options = this.clips[name];
    if (!options || options.length === 0) return;
    const clip = options[Math.floor(Math.random() * options.length)]; // pick one at random
    const go = () => {
      // a copy, so the same sound can overlap itself (a plain clip would restart instead)
      const copy = clip.cloneNode();
      copy.volume = clip.volume;
      copy.play().catch(() => {}); // browsers block sound until the first click, need to ignore that
    };
    if (delay > 0) setTimeout(go, delay);
    else go();
  }

  // collecting flower pop sound: one per flower collected, but never more than POP_MAX (10).
  pops(count) {
    for (let i = 0; i < Math.min(count, POP_MAX); i++)
      this.play("pop", i * POP_GAP);
  }
}
