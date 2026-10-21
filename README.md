# DANIELS® — Portfolio

Cinematic portfolio for **DANIELS®**, a Brazilian audiovisual creative on the way to film directing.
Live: **https://danielspng.github.io/DANIELS/**

## Structure (the site as a film)

| # | Section | id |
|---|---|---|
| 01 | Opening title — letterbox, "A film by DANIELS", reel | `#top` |
| 02 | Films — siena.film-style WebGL roll | `#films` |
| 03 | In development — upcoming projects (logline + status) | `#development` |
| 04 | Work — films, posters, design (filterable) | `#work` |
| 05 | Director's statement + influences + Arturus (production house) | `#statement` |
| 06 | Contact | `#contact` |
| 07 | End credits (footer) | — |

`project.html?p=<slug>` is the page for each project.

## Editing content

Everything lives in **`js/data.js`**:

- Bilingual text: `{ pt: "...", en: "..." }`. Interface strings are in `ui.pt` / `ui.en`.
- `sample: true` marks example items (shown with a "Sample / Exemplo" tag).
- Empty fields show as "Coming soon / Em breve".
- A project with a `featured` block also appears in the Films roll. Its `featured.backdrop`
  should be a **horizontal still (1920×1080)**.
- `profile.email`, `profile.cv`, `statement.portrait`, `hero.video` are ready to fill.

Language: PT/EN switch in the header. First visit follows the browser language; the choice is
remembered, and `?lang=pt` / `?lang=en` links open a specific language.

## Files

```text
index.html      home
project.html    project page
css/style.css   design system + all sections
css/featured.css  films roll
js/data.js      content (PT/EN)
js/common.js    i18n, header ticket, end credits, helpers
js/featured.js  films roll (WebGL)
js/main.js      home sections
js/project.js   project page
serve.ps1       local preview server
```

## Run locally

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Open http://localhost:8080 (WebGL needs the server; opened from disk the films roll uses a CSS fallback).
