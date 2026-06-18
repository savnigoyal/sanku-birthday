## TODO - Spin Wheel UI Fix

### Step 1
- Update `style.css` wheel CSS:
  - Make wheel 400px on desktop.
  - Remove slice skew/distortion.
  - Ensure readable upright centered bold white labels.
  - Add alternating pink/purple slice backgrounds with strong borders.

### Step 2
- Update `script.js` girlfriend wheel implementation:
  - Use short mode names only for wheel labels.
  - Render only emoji+short label inside slices.
  - Keep descriptions only in the result card below the wheel.
  - Fix slice rotation math for correct stopping under the pointer.
  - Ensure animation duration is 4–5s with ease-out.

### Step 3
- Manual verification in browser:
  - Wheel looks like classic prize wheel (perfect circle).
  - All 8 labels readable and not cut.
  - Result card shows selected mode + description.

