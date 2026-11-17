# Assets guide

The background is the Minecraft video (`garden.mp4`), so there is no soil to draw.
Everything the game draws on top is in `assets/plants/` (the flowers) and `assets/fx/` (the water drop).

## How the flowers are named

Every file is a transparent PNG, cropped tight to the plant.

Shared by all flowers:

| File | What it is |
|---|---|
| `seed.png`, `seed_dead.png` | the seed (stage 1) |
| `shoot_flower.png`, `shoot_flower_dead.png` | the thin shoot (stage 2) used by most flowers |
| `shoot_bush.png`, `shoot_bush_dead.png` | the leafy shoot (stage 2) used by lilac, peony and rosebush |

For each of the 16 flowers (`whitetulip`, `pinktulip`, `orangetulip`, `redtulip`, `lily`, `azure`,
`daisy`, `sunflower`, `dandelion`, `poppy`, `allium`, `orchid`, `cornflower`, `lilac`, `peony`, `rosebush`):

| File | What it is |
|---|---|
| `<flower>_grow.png`, `<flower>_grow_dead.png` | unbloomed (stage 3) |
| `<flower>_bloom.png`, `<flower>_bloom_dead.png` | bloomed (stage 4) |

There is no wilted picture. The game makes the wilted look itself by tinting and leaning the alive
picture, then fades in the dead picture when the plant dies.

## Changing or adding art

1. Put the raw files in the folder layout the script expects (see `tools/prepare_sprites.py`).
2. Run `python tools/prepare_sprites.py "path/to/MinecraftFlowers"`. It removes white backgrounds,
   crops every sprite tight and writes the PNGs into `assets/plants/`.
3. To replace one sprite by hand, overwrite the PNG with the same name. No code changes needed.

## Anchor and scale

The game puts the **bottom centre** of each PNG on the middle of the soil square, so keep the
stem base at the bottom edge of the picture. All sprites share one pixel size, so a tulip and a
rose bush keep their real proportions. If the plants look too big or small, change
`SPRITE_PX_PER_SQUARE` in `assets.js`.

## Effects: `fx/droplet.png` (6 x 10 px)
One water drop. The game spawns a burst of them when the plant is watered.

## Checking your art in the game
Run the game with Live Server, plant a flower, and press **B**. A magenta box shows the sprite
frame and a cyan cross shows the anchor point. If a file is missing or misnamed, a bright magenta
tile with its name appears instead, and the console lists it.
