# Final Project — Where Flowers Bloom

---

### The Project

Where Flowers Bloom is an interactive garden that runs as a fullscreen wallpaper on a laptop. A Minecraft garden video plays in the background, and a p5.js canvas on top lets you plant, water and collect flowers in the video's soil squares. Time keeps passing while the page is open, so flowers grow, get thirsty, wilt and die if you forget about them. It responds to the mouse and keyboard: you pick a tool, click or drag across squares, and the garden answers with growth, badges and sound.

**Run it:** open the folder in VS Code, right-click `index.html`, choose **Open with Live Server**, then press **F** for fullscreen and click once to start the music. Use a local server rather than double-clicking the file, because the video and sounds need to be served over `http://`.

**Controls**

| Key / mouse     | What it does                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| **P**           | Plant tool. Click an empty square to open the flower bundle, pick a flower, then click or drag to plant it |
| **W**           | Water tool                                                                                                 |
| **C**           | Clear / Collect tool. Clears dead plants and collects fully grown, well-watered flowers                    |
| Click and drag  | Select a rectangle of squares                                                                              |
| Click the chest | Open the collection window                                                                                 |
| **T**           | Change the speed of garden time                                                                            |
| **Space**       | Pause (planting, watering and clearing are blocked while paused)                                           |
| **G**           | Show or hide the soil grid                                                                                 |
| **F**           | Fullscreen                                                                                                 |
| **H**           | Hide or show the interface                                                                                 |
| **B**           | Show sprite bounds                                                                                         |
| **Esc**         | Close an open window                                                                                       |

---

### Output

![screenshot](readme-assets/image-08-minecraft-font-ui)

<!-- [Watch Online](https://your-link-here) -->

<!-- Replace the link above with a URL to a screen recording or video of your final project.
     ⚠️ Make sure the file or page is set to public before submitting. -->

---

### ✍️ Reflection

We set out to make a calm, cosy garden that you can leave running on your laptop, where flowers need a little care to survive. The final version is close to that idea: the Minecraft video gives the mood, and the interface stays small and quiet on top of it.

The code is split into small classes, each with one job: a soil grid in perspective, a clock for garden time, a `Plant` that tracks growth, moisture and health, a `Garden` that holds the plants, and separate classes for the inventory, the chest, the HUD and the sounds. The three tools (plant, water, collect) all work on a dragged rectangle of squares, so one action can affect many plants.

For the look and sound we used Minecraft's own style everywhere: the Minecraft font, pixel icons, and short game-like sound effects. Small details carry the feeling, such as a droplet when a plant is thirsty, a star and a chime when it is ready, and a pop for each flower collected. Sounds play once per drag, not once per square, so a big action does not turn into noise.

The hardest part was getting the plant rules to feel fair. A plant needed to wilt before it dies, recover if you water it in time, and only be collectable when it is fully grown and not dry. Testing this meant speeding up time and forcing plants into each state. With more time we would add day and night changes, weather, and more reasons to come back to the garden, such as using the collected flowers.

---

### ✨ Features

- 16 flowers, each growing through seed, shoot, growing and bloom
- Moisture, health and wilting, with recovery if you water in time, and permanent death if you do not
- Badges above plants: skull (dead), droplet (thirsty), star (ready to collect)
- Plant, water and clear / collect tools that work on a dragged rectangle of squares
- A bundle window to choose a flower, and a chest that counts what you have collected (kept in `localStorage`)
- Garden time with a clock, adjustable speed and pause
- Sound effects: plant (random of three), water, shovel, pop (up to 10), a ready chime and an error sound
- Interface and text that scale with the window, in the Minecraft font

---

### 🔍 Code Structure

```
index.html          loads p5.js and every script below, in order
sketch.js           setup(), draw(), keyboard and mouse handling
js/
  soil.js           the perspective grid of soil squares
  clock.js          garden time, speed and pause
  video.js          the background video, kept in step with garden time
  assets.js         loads and trims every image
  plant.js          the Plant class: growth, moisture, health, wilting, death
  garden.js         the squares that hold plants, and the growth update
  inventory.js      the flower the player is holding
  collection.js     the chest and the collection window
  picker.js         the bundle window and the shared window layout
  effects.js        badges, wilting tint and other drawing effects
  tools.js          the Plant / Water / Clear tools
  hud.js            clock, tool buttons, status panel, messages
  sounds.js         sound effects
assets/
  garden.mp4        the background video
  minecraft.ttf     the Minecraft font
  plants/           the flower pictures (see assets/README.md)
  tools/, ui/       tool icons, chest and window pictures
  sounds/           plant1-3, water, shovel, pop, ready, error (.mp3)
```
