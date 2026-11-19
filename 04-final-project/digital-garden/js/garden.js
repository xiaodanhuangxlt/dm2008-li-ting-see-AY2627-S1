class Garden {
  constructor() {
    // id ("BL-3-2") = { sq: the square, plant: the Plant }
    this.cells = new Map();
  }

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

  // every { sq, plant } pair is ordered back to front.
  // Squares higher up the screen are further away, so they are drawn first
  // and the closer plants overlap them like in cinema seating
  get sorted() {
    return [...this.cells.values()].sort(
      (a, b) => a.sq.center[1] - b.sq.center[1],
    );
  }

  // let every plant grow by simDt seconds.
  // time passed when tab is hidden (running in the bg) are cut into slices
  // so a plant still updates and goes through each stage
  // max 240 slices, so screen wont freeze
  update(simDt) {
    if (simDt <= 0) return 0;
    const steps = Math.min(240, Math.max(1, Math.ceil(simDt / 0.25)));
    let newlyReady = 0; // plants that became ready to collect during this update
    this.cells.forEach((cell) => {
      const wasReady = cell.plant.isReady;
      for (let i = 0; i < steps; i++) cell.plant.update(simDt / steps);
      if (!wasReady && cell.plant.isReady) newlyReady++;
    });
    return newlyReady;
  }
}
