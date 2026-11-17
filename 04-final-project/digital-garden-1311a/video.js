// GardenVideo: remote control for the bg video according to what the clock says.
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

  // True when there is enough picture to run the garden against.
  // Tells the game when it is safe to start the clock
  get ready() {
    // >= 3 means enough data to play
    if (this.el.readyState >= 3) this.loaded = true; // once loaded, a brief buffering after a seek will not stall the clock
    // If the video failed we carry on without it
    return this.failed || this.el.error !== null || this.loaded;
  }

  // Calls every frame, after the clock has ticked.
  follow(clock) {
    if (this.el.error) this.failed = true;
    if (this.failed) return;
    const el = this.el;

    // One garden day = one pass of the video.
    if (el.duration) clock.dayLengthSeconds = el.duration;

    // The video plays and pauses with the clock.
    if (clock.paused && !el.paused) el.pause();
    else if (!clock.paused && el.paused) el.play().catch(() => {});

    // Play the video as fast as the clock runs (the debug speeds 4x and 12x included).
    if (el.playbackRate !== clock.timeScale) el.playbackRate = clock.timeScale;

    // Keep the picture close to where the clock says it should be. The faster the video runs,
    // the more it can wobble, so the allowed gap grows a little with the speed.
    if (!clock.paused && !el.seeking && el.duration) {
      const day = clock.dayLengthSeconds;
      let drift = el.currentTime - clock.videoTime;
      if (drift > day / 2) drift -= day;
      if (drift < -day / 2) drift += day;
      if (Math.abs(drift) > 0.75 + 0.25 * clock.timeScale)
        el.currentTime = clock.videoTime;
    }
  }

  // Show red message if the file is missing, since that is the most likely mistake.
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
