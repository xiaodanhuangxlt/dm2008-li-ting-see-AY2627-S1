// GardenVideo remotely controls the bg video according to what the clock says.
class GardenVideo {
  constructor(el) {
    this.el = el;
    this.failed = false; // true if the file failed to load
    this.loaded = false; // true when the video has enough data to play the first time
    el.addEventListener("error", () => {
      this.failed = true;
    });
    // the error may already have happened before this line ran, so check el.error too
    if (el.error) this.failed = true;
  }

  // true when there is enough picture to run the garden against
  // tells the game when it is safe to start the clock
  get ready() {
    // >= 3 means enough data to play
    if (this.el.readyState >= 3) this.loaded = true; // once loaded, a brief buffering after a seek will not stall the clock
    // if the video failed we carry on without it
    return this.failed || this.el.error !== null || this.loaded;
  }

  // calls every frame, after the clock has ticked.
  follow(clock) {
    if (this.el.error) this.failed = true;
    if (this.failed) return;
    const el = this.el;

    // one garden day = one pass of the video.
    if (el.duration) clock.dayLengthSeconds = el.duration;

    // video plays and pauses with the clock.
    if (clock.paused && !el.paused) el.pause();
    else if (!clock.paused && el.paused) el.play().catch(() => {});

    // play the video as fast as the clock runs (the debug speeds 4x, 12x and 16x included).
    if (el.playbackRate !== clock.timeScale) el.playbackRate = clock.timeScale;

    // keep the picture close to where the clock says it should be.
    // the faster the video runs, the more it can wobble,
    // so the allowed gap grows a little with the speed.
    if (!clock.paused && !el.seeking && el.duration) {
      const day = clock.dayLengthSeconds;
      let drift = el.currentTime - clock.videoTime;
      if (drift > day / 2) drift -= day;
      if (drift < -day / 2) drift += day;
      if (Math.abs(drift) > 0.75 + 0.25 * clock.timeScale)
        el.currentTime = clock.videoTime;
    }
  }

  // show red message if the file is missing
  drawWarning() {
    if (this.el.error) this.failed = true;
    if (!this.failed) return;
    noStroke();
    fill(255, 140, 140);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(
      "Video not found. Put garden.mp4 inside the assets folder.",
      width / 2,
      height / 2,
    );
  }
}
