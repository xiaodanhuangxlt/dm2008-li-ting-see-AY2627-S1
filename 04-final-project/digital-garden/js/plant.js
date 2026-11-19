// plant's lifecycle simulation.
// stage of growth and health are tracked separately
class Plant {
  static CFG = {
    startMoisture: 60,
    startHealth: 100,
    moistureDrain: 0.035, // moisture lost per second (60 -> 30 in ~850s, about 1 garden week)
    waterAmount: 20, // added per watering, capped at 100
    healthyMin: 30, // moisture band where the plant thrives (30 - 85, full growth and health recovers)
    healthyMax: 85,
    dryBelow: 20, // below this moisture plant is dry and health starts dropping
    dryDamage: 0.3, // health lost per second at 0 moisture (scales up from 0 at moisture 20)
    soggyAbove: 90, // above this, health starts dropping (overwatering)
    soggyDamage: 0.07, // health lost/s when moisture is 100 (too moist)
    recoverRate: 0.15, // health gained/s while moisture is 30-85. Wilted (50) to healthy again (75) takes about 1.4 garden days
    wiltBelow: 50, // health below this -> wilted
    recoverAbove: 75, // wilted plant is healthy again above this (hysteresis)
    growthRate: 0.04, // growth per second in ideal conditions (~2500s, about 3 garden weeks, to full bloom)
    wiltedGrowthFactor: 0.2,
    stageSprout: 12,
    stageGrowing: 35,
    stageBloom: 75,
    readyAt: 100, // growth needed before the flower can be collected
  };

  static SWAY = 0.02; // gentle sprite sway in radians (set 0 for none)
  // species: one entry of SPECIES (in assets.js). Omit this to get a random flower.
  constructor(species) {
    const c = Plant.CFG;
    this.species =
      species || SPECIES[Math.floor(Math.random() * SPECIES.length)];
    this.moisture = c.startMoisture;
    this.health = c.startHealth;
    this.growth = 0;
    this.state = "healthy"; // healthy | wilted | dead
    this.age = 0;

    // visual values so changes look gradual
    this.droopVis = 0;
    this.wiltVis = 0;
    this.deadVis = 0;
    this.shownStage = "seed"; // sprite stage currently shown
    this.prevStage = "seed"; // previous stage, fading out
    this.stageFade = 1; // 0 -> 1 crossfade after a stage change
    this.phase = Math.random() * Math.PI * 2; // offsets the sway so plants don't move in sync
    this.leanDir = Math.random() < 0.5 ? -1 : 1; // which way it droops when wilted
  }
  get stage() {
    const c = Plant.CFG;
    if (this.growth < c.stageSprout) return "seed";
    if (this.growth < c.stageGrowing) return "sprout";
    if (this.growth < c.stageBloom) return "growing";
    return "blooming";
  }

  get isDead() {
    return this.state === "dead";
  }

  // fully grown, alive, well moistured = can collect
  get isReady() {
    return !this.isDead && this.growth >= Plant.CFG.readyAt && !this.isThirsty;
  }

  // alive but soil dry = need to water
  get isThirsty() {
    return !this.isDead && this.moisture < Plant.CFG.healthyMin;
  }

  // status picture bobbing on top of plant
  get badge() {
    if (this.isDead) return "dead";
    if (this.isThirsty) return "thirsty";
    if (this.isReady) return "ready";
    return null;
  }

  water() {
    if (this.isDead) return false;
    this.moisture = Math.min(100, this.moisture + Plant.CFG.waterAmount);
    return true;
  }

  // multiplier (0-1) on growth speed from current moisture.
  growthFactor() {
    const c = Plant.CFG;
    let f = 1;
    if (this.moisture < c.healthyMin) f = this.moisture / c.healthyMin;
    else if (this.moisture > c.healthyMax)
      f = (100 - this.moisture) / (100 - c.healthyMax);
    f = Math.max(0, Math.min(1, f));
    if (this.state === "wilted") f *= c.wiltedGrowthFactor;
    return f;
  }

  update(dt) {
    const c = Plant.CFG;
    this.age += dt;

    if (!this.isDead) {
      // 1. moisture drains over time
      this.moisture = Math.max(0, this.moisture - c.moistureDrain * dt);

      // 2. growth, only as fast as conditions allow
      this.growth = Math.min(
        100,
        this.growth + c.growthRate * this.growthFactor() * dt,
      );

      // 3. health: too dry / too wet hurts, healthy moisture heals
      let dh = 0;
      if (this.moisture < c.dryBelow) {
        dh -= c.dryDamage * (1 - this.moisture / c.dryBelow);
      } else if (this.moisture > c.soggyAbove) {
        dh -=
          c.soggyDamage *
          ((this.moisture - c.soggyAbove) / (100 - c.soggyAbove));
      } else if (
        this.moisture >= c.healthyMin &&
        this.moisture <= c.healthyMax
      ) {
        dh += c.recoverRate;
      }
      this.health = Math.max(0, Math.min(100, this.health + dh * dt));

      // 4. health state (wilting is recoverable, death is not)
      if (this.health <= 0) {
        this.state = "dead";
      } else if (this.state === "healthy" && this.health < c.wiltBelow) {
        this.state = "wilted";
      } else if (this.state === "wilted" && this.health >= c.recoverAbove) {
        this.state = "healthy";
      }
    }

    // visual targets, eased toward so droop &colour change gradually.
    let droopTarget, wiltTarget;
    if (this.isDead) {
      droopTarget = 1;
      wiltTarget = 1;
    } else {
      const healthDroop = Math.min(1, (100 - this.health) / 70) * 0.9;
      const thirstDroop =
        Math.min(
          1,
          Math.max(0, (c.healthyMin - this.moisture) / c.healthyMin),
        ) * 0.35;
      droopTarget = Math.max(healthDroop, thirstDroop);
      wiltTarget = Math.min(1, (100 - this.health) / 80);
    }
    const k = 1 - Math.exp(-1.5 * dt);
    this.droopVis += (droopTarget - this.droopVis) * k;
    this.wiltVis += (wiltTarget - this.wiltVis) * k;
    this.deadVis +=
      ((this.isDead ? 1 : 0) - this.deadVis) * (1 - Math.exp(-1.2 * dt));

    // crossfade between stage sprites when the growth stage changes
    if (this.stage !== this.shownStage) {
      this.prevStage = this.shownStage;
      this.shownStage = this.stage;
      this.stageFade = 0;
    }
    this.stageFade = Math.min(1, this.stageFade + dt / 1.2);
  }

  // drawing sprites

  // sprite for a growth stage. Returns [alive image key, dead image key].
  spriteKeys(stage) {
    const sp = this.species.id;
    if (stage === "seed") return ["plants/seed", "plants/seed_dead"];
    if (stage === "sprout") {
      const kind = this.species.bush ? "bush" : "flower";
      return [`plants/shoot_${kind}`, `plants/shoot_${kind}_dead`];
    }
    if (stage === "growing")
      return [`plants/${sp}_grow`, `plants/${sp}_grow_dead`];
    return [`plants/${sp}_bloom`, `plants/${sp}_bloom_dead`];
  }

  // x, y = the plant's foot (on the soil).
  // unit = screen pixels per sprite pixel.
  // t = seconds, for sway.
  // "wilted" is made here in code since there are no assets for that:
  // the alive sprite is tinted yellow-brown, squashed a little and leaned over.
  // when the plant dies, dead sprite fades in.
  draw(x, y, unit, t, assets) {
    const wilt = Math.min(1, this.wiltVis / 0.6); // 0 = fresh, 1 = fully wilted
    const dead = this.deadVis; // 0 = alive, 1 = dead
    const sway =
      Math.sin(t * 0.9 + this.phase) * Plant.SWAY * (1 - this.droopVis * 0.8);

    const layers = [[this.shownStage, this.stageFade]];
    if (this.stageFade < 1)
      layers.unshift([this.prevStage, 1 - this.stageFade]);

    push();
    translate(Math.round(x), Math.round(y));
    layers.forEach(([stage, stageAlpha]) => {
      const [aliveKey, deadKey] = this.spriteKeys(stage);

      // alive sprite (fades out when the plant dies)
      const alive = assets.get(aliveKey);
      const aliveAlpha = (1 - dead) * stageAlpha;
      if (alive && aliveAlpha > 0.01) {
        push();
        rotate(sway + this.leanDir * this.droopVis * 0.3); // lean over
        scale(1, 1 - this.droopVis * 0.15); // squash a little
        tint(
          255 - 80 * wilt,
          255 - 105 * wilt,
          255 - 170 * wilt,
          255 * aliveAlpha,
        );
        const w = alive.width * unit;
        const h = alive.height * unit;
        image(alive, -w / 2, -h, w, h); // anchor at bottom centre of square
        pop();
      }

      // dead sprite (fades in when plant dies)
      const gone = assets.get(deadKey);
      const deadAlpha = dead * stageAlpha;
      if (gone && deadAlpha > 0.01) {
        push();
        rotate(this.leanDir * 0.1);
        tint(255, 255 * deadAlpha);
        const w = gone.width * unit;
        const h = gone.height * unit;
        image(gone, -w / 2, -h, w, h);
        pop();
      }
    });
    noTint();
    pop();
  }
}
