// turns real seconds into garden time.
// one garden day lasts exactly as long as the background video (120 s),
// video starts at 07:30.
class GameClock {
  constructor(startHour = 7.5, dayLengthSeconds = 120) {
    this.startMinutes = startHour * 60;
    this.minutes = this.startMinutes;
    this.dayLengthSeconds = dayLengthSeconds;
    this.timeScale = 1; // debug speed-up (1, 4, 12)
    this.paused = false; // space bar
    this.maxDt = 6 * 3600; // clock will continue running in a hidden tab or a sleeping laptop for up to 6h
  }

  get minutesPerSecond() {
    return 1440 / this.dayLengthSeconds; // 1140/120 = 12 garden min pass per real minute
  }

  // rawDt = real time since the last frame, in seconds
  tick(rawDt) {
    if (this.paused) return 0; // if paused, stop immediately and return 0
    const dt = Math.min(rawDt, this.maxDt) * this.timeScale; // dt amount of time passed
    this.minutes += dt * this.minutesPerSecond;
    return dt;
  }

  // the part of the day the video should be showing
  get videoTime() {
    return (
      (((this.minutes - this.startMinutes) / 1440) * this.dayLengthSeconds) %
      this.dayLengthSeconds
    );
  }

  // reading time
  get day() {
    return Math.floor(this.minutes / 1440) + 1;
  }
  get hourFloat() {
    return (this.minutes % 1440) / 60;
  }
  get hour() {
    return Math.floor(this.hourFloat);
  }
  get minute() {
    return Math.floor(this.minutes % 60);
  }

  get label() {
    const hh = String(this.hour).padStart(2, "0");
    const mm = String(this.minute).padStart(2, "0");
    return `Day ${this.day} - ${hh}:${mm}`;
  }
}
