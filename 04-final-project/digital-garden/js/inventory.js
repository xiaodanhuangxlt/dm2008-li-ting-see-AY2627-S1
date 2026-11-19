// counts how many flowers of each species you have collected.
// saved in browser so they are still there the next time you open.
const SAVE_KEY = "digitalGarden.collection";

class Inventory {
  constructor() {
    this.counts = {}; // e.g. { daisy: 3, poppy: 1 }
    this.load();
  }

  // total flower num
  get total() {
    return Object.values(this.counts).reduce((sum, n) => sum + n, 0);
  }

  // how many of each
  count(speciesId) {
    return this.counts[speciesId] || 0;
  }

  add(speciesId) {
    this.counts[speciesId] = this.count(speciesId) + 1;
    this.save();
  }

  // some browsers will block storage
  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.counts));
    } catch (e) {}
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved && typeof saved === "object") this.counts = saved;
    } catch (e) {}
  }
}
