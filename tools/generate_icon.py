"""Regenerate static/assets/icon.png — a form card with a Lightning bolt."""

from PIL import Image, ImageDraw

SIZE = 256
SCALE = 4  # supersample for smooth edges
S = SIZE * SCALE

BG = "#1f2937"
CARD = "#f6f7f9"
LINE = "#9ca3af"
BOLT = "#f7931a"

img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# Rounded-square background.
d.rounded_rectangle([8 * SCALE, 8 * SCALE, (SIZE - 8) * SCALE, (SIZE - 8) * SCALE], radius=56 * SCALE, fill=BG)

# Form card.
d.rounded_rectangle([60 * SCALE, 44 * SCALE, 196 * SCALE, 212 * SCALE], radius=18 * SCALE, fill=CARD)

# Form field lines.
for i, y in enumerate((78, 112, 146)):
    width = 96 if i < 2 else 64
    d.rounded_rectangle([80 * SCALE, y * SCALE, (80 + width) * SCALE, (y + 14) * SCALE], radius=7 * SCALE, fill=LINE)

# Submit bar.
d.rounded_rectangle([80 * SCALE, 176 * SCALE, 176 * SCALE, 196 * SCALE], radius=10 * SCALE, fill=BOLT)

# Lightning bolt over the card corner.
bolt = [(150, 30), (112, 118), (142, 118), (126, 176), (196, 84), (160, 84), (178, 30)]
d.polygon([(x * SCALE, y * SCALE) for x, y in bolt], fill=BOLT)

img = img.resize((SIZE, SIZE), Image.LANCZOS)
out = __file__.rsplit("/", 2)[0] + "/static/assets/icon.png"
img.save(out, "PNG")
print(out)
