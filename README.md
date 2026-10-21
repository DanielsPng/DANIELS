# DANIELS® — Personal Creative Portfolio

A cinematic, editorial web portfolio designed for **DANIELS®** — Brazilian creative working across audiovisual, film editing, design, and art direction.

---

## Architecture & Visual System

- **Concept**: *Cinema meets editorial design* — quiet, atmospheric pacing, large typographic scale, restrained hover interactions, and no decorative AI gimmicks.
- **Color Palette**:
  - Primary Background: `#111111` (near-black)
  - Secondary Surfaces: `#202020` (dark charcoal)
  - Typography: `#F0EEE8` (warm off-white)
  - Accent: `#A98B68` (muted bronze, used sparingly)
  - Counterpoint (Design section): `#F0EEE8` paper canvas with `#161616` ink
- **Typography**: `Geist` (contemporary geometric sans) & `Instrument Serif` (refined editorial italic).
- **Brand Hierarchy**:
  - Primary Brand: **DANIELS®**
  - Production House: **ARTURUS** (distinct subsidiary entity)

---

## Directory Structure

```text
PORT/
├── index.html                 # Complete 8-section homepage
├── project.html               # Reusable editorial project case-study template
├── serve.ps1                  # Zero-dependency local web server (PowerShell HTTP listener)
├── css/
│   └── style.css              # Complete responsive stylesheet (desktop & mobile)
├── js/
│   ├── data.js                # Central configuration & content file (projects, links, video)
│   ├── common.js              # Shared header, navigation, footer & link helpers
│   ├── main.js                # Homepage controllers & hero video handler
│   └── project.js             # Project case study view renderer
├── assets/
│   ├── favicon.svg            # Custom SVG favicon
│   ├── img/
│   │   ├── hero-still.jpg     # 16:9 cinematic opening frame still
│   │   ├── arturus-still.jpg  # 3:4 portrait beam still for Arturus
│   │   └── og-image.jpg       # OpenGraph share card (1200x630)
│   ├── video/                 # Directory for your showreel video (H.264 MP4)
│   └── docs/                  # Directory for CV (PDF)
└── tools/
    └── optimize-images.ps1    # Image optimization script (System.Drawing)
```

---

## How to Run Locally

Because the project is completely self-contained and dependency-free, you do not need Node.js or Python installed.

1. Open PowerShell in this folder:
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
   ```
2. Open your browser at:
   ```text
   http://localhost:8080
   ```

---

## How to Customize Content

All editable data lives in [`js/data.js`](file:///c:/Users/danielsouza_trajetor/Pictures/Lightroom%20fotos%20salvas/PORT/js/data.js):

1. **Contact & Social Profiles**:
   - Update `profile.email`, `profile.linkedin`, `profile.instagram`, and `profile.cv`.
   - Links left as `""` will automatically show as graceful `"To be added"` labels rather than broken or dead links.

2. **Hero Video**:
   - Place your showreel in `assets/video/hero.mp4`.
   - Set `hero.video.desktop = "assets/video/hero.mp4"`.
   - If left empty, the site seamlessly displays the high-resolution cinematic poster still without any broken media indicators.

3. **Projects (Selected Work)**:
   - Add your projects to the `projects` array in `js/data.js`.
   - Provide a 2:3 portrait poster in `assets/img/`, title, category, year, role, video embed (YouTube, Vimeo, or MP4), and gallery stills.
   - Any card marked `sample: true` displays a subtle "Sample" badge until you replace it with real work.

4. **Design & Art Direction**:
   - Add identity and campaign assets in the `design` array with customizable aspect ratios (`16/10`, `4/5`, `1/1`, etc.).

5. **About Text & Arturus Links**:
   - Text can be edited in [`index.html`](file:///c:/Users/danielsouza_trajetor/Pictures/Lightroom%20fotos%20salvas/PORT/index.html) or `js/data.js` to tailor English or Portuguese phrasing.
