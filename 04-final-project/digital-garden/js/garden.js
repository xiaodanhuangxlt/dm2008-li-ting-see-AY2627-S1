// Garden: remembers which soil square has which plant, and keeps all the plants growing.
class Garden {
  constructor() {
    // A Map is a list of pairs: square id ("BL-3-2") -> { sq: the square, plant: the Plant }
    this.cells = new Map();
  }

  // The plant on this square, or null if the square is empty.
  plantAt(sq) {
    const cell = sq ? this.cells.get(sq.id) : null;
    return cell ? cell.plant : null;
  }

  add(sq, plant) {
    this.cells.set(sq.id, { sq, plant });
  }

  remove(sq) {
    this.cells.delete(sq.id);
  }

  // Every { sq, plant } pair, ordered back to front. Squares higher up the screen are further
  // away, so they are drawn first and the closer plants overlap them (like real depth).
  get sorted() {
    return [...this.cells.values()].sort((a, b) => a.sq.center[1] - b.sq.center[1]);
  }

  // Let every plant grow by simDt seconds. Long gaps (a hidden tab) are cut into slices so a
  // plant still goes through each stage, but never into more than 240 slices, to stay fast.
  update(simDt) {
    if (simDt <= 0) return;
    const steps = Math.min(240, Math.max(1, Math.ceil(simDt / 0.25)));
    this.cells.forEach((cell) => {
      for (let i = 0; i < steps; i++) cell.plant.update(simDt / steps);
    });
  }
}
