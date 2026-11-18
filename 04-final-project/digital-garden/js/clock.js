// GameClock: turns real seconds into garden time.
// One garden day lasts exactly as long as the background video (120 s),
// so the clock and the video's day and night stay in sync. The video starts at 07:30.
class GameClock {
  constructor(startHour = 7.5, dayLengthSeconds = 120) {
    this.startMinutes = startHour * 60;
    this.minutes = this.startMinutes; // total garden minutes since day 1, 00:00
    this.dayLengthSeconds = dayLengthSeconds;
    this.timeScale = 1; // debug speed-up (1, 4, 12)
    this.paused = false; // space bar to control
    this.maxDt = 6 * 3600; // longest gap to catch up on is 6h: clock will continue running in a hidden tab or a sleeping laptop
  }

  get minutesPerSecond() {
    return 1440 / this.dayLengthSeconds; // 1140/120 = 12 garden min pass per real minute
  }

  // Moving the clock.
  // rawDt is the real time since the last frame, in seconds
  tick(rawDt) {
    if (this.paused) return 0; // if paused, stop immediately and return 0
    const dt = Math.min(rawDt, this.maxDt) * this.timeScale; // dt is the amount of time passed
    this.minutes += dt * this.minutesPerSecond;
    return dt;
  }

  // Which part of the day the video should be showing
  get videoTime() {
    return (
      (((this.minutes - this.startMinutes) / 1440) * this.dayLengthSeconds) %
      this.dayLengthSeconds
    );
  }

  // Reading the time
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
