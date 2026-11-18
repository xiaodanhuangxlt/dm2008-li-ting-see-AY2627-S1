// Inventory: counts how many flowers of each species you have collected.
// The counts are saved in the browser (localStorage), so they are still there next time.
const SAVE_KEY = "digitalGarden.collection";

class Inventory {
  constructor() {
    this.counts = {}; // e.g. { daisy: 3, poppy: 1 }
    this.load();
  }

  // How many flowers in total.
  get total() {
    return Object.values(this.counts).reduce((sum, n) => sum + n, 0);
  }

  // How many of one species (0 if never collected).
  count(speciesId) {
    return this.counts[speciesId] || 0;
  }

  add(speciesId) {
    this.counts[speciesId] = this.count(speciesId) + 1;
    this.save();
  }

  // try / catch: some browsers block storage (private windows). The game still works,
  // it just won't remember the collection.
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
