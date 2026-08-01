# Happy Girlfriend's Day 🐉

A single-scroll, seven-chapter storybook website. Pure HTML, CSS, and vanilla JavaScript — no build tools, no dependencies. Open `index.html` and it just works.

---

## 1. Folder structure

```
project/
│
├── index.html          the whole site, chapter by chapter
├── style.css            all styling
├── script.js             all interactivity
│
├── assets/
│   ├── photos/           your real photos go here
│   ├── dragons/           Night Fury / Light Fury PNGs
│   ├── gifs/               background gif for the Future chapter
│   ├── videos/             background video for the Future chapter
│   └── music/              reserved, not wired up yet
│
├── data/
│   ├── letter.txt         the handwritten letter chapter's content
│   ├── memories.json      the 4 "Little Things" cards
│   └── quiz.json           the quiz questions
│
└── README.md
```

Every asset slot has a graceful fallback — if a file is missing, the site quietly shows a soft placeholder instead of breaking.

---

## 2. Where each photo goes

- **Chapter 2 ("Where It All Began")** → `assets/photos/photo1.jpg`
- **Chapter 3 ("Somewhere Along The Way")** → `assets/photos/photo2.jpg`

Just drop a `.jpg` with that exact filename into `assets/photos/`. If you'd rather use `.png`, open `index.html`, find the `<img src="assets/photos/photo1.jpg">` tag, and change the extension.

Until you add a photo, that spot shows a dashed placeholder box with a 📷 icon — nothing looks broken.

---

## 3. Where dragon PNGs go

Drop these into `assets/dragons/`:

- `night-fury.png` — used in Chapter 1 (flying across the top) and Chapter 4 (far left, faint)
- `light-fury.png` — used in Chapter 4 (far right, faint)

Transparent-background PNGs work best. If a file is missing, that dragon simply doesn't render — no broken image icon.

---

## 4. Where the GIF/video goes

Chapter 7 ("Future") uses a full-bleed background. It checks in this order:

1. `assets/videos/future.mp4` (preferred — smoother, loops silently)
2. `assets/gifs/future.gif` (fallback if you'd rather use a gif)

If neither exists, the chapter falls back to the site's starfield background — it never looks empty.

---

## 5. How to edit the letter

Open `data/letter.txt` in any text editor and just... write. Plain text, no formatting needed — line breaks in the file become line breaks on the page. This is the one file you'll probably rewrite completely.

---

## 6. How to edit quiz questions

Open `data/quiz.json`. Each question looks like this:

```json
{
  "question": "Your question here?",
  "options": ["Option A", "Option B", "Option C"],
  "correctIndex": 0,
  "correctResponse": "Correct! 🐉",
  "wrongResponse": "Nice try 😏"
}
```

- `correctIndex` is the position of the right answer in `options` (starting from `0`).
- Add or remove whole question blocks freely — the quiz automatically adapts to however many you include.

`data/memories.json` (the 4 "Little Things" cards) follows the same idea — just edit the `title` and `body` of each entry.

---

## 7. How to replace text

Every placeholder paragraph in `index.html` is wrapped in a clear comment, like:

```html
<!-- REPLACE: college story paragraph -->
<p class="body-copy">...</p>
<!-- END REPLACE -->
```

Search for `REPLACE:` in `index.html` to find every spot that needs your real writing. Nothing else needs to change — the styling will pick up the new text automatically.

---

## 8. How to deploy to GitHub Pages

1. Create a new repository on GitHub (public, or private if you have GitHub Pro).
2. From inside the `project/` folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. On GitHub, go to your repo → **Settings** → **Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
5. Set **Branch** to `main` and folder to `/ (root)`, then **Save**.
6. Wait a minute or two — your site will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## 9. How to deploy to Vercel

1. Install the Vercel CLI (one-time): `npm install -g vercel`
2. From inside the `project/` folder, run:
   ```bash
   vercel
   ```
3. Follow the prompts (log in / create an account if needed, accept the defaults — no build command is needed since this is a static site).
4. Vercel will give you a live URL immediately. Running `vercel --prod` promotes it to your permanent production URL.

Alternatively: go to [vercel.com/new](https://vercel.com/new), import the GitHub repo you created in step 8 above, leave all settings as default, and click **Deploy**.

---

## 10. How to test locally

You can simply double-click `index.html` — it works with zero setup. If your browser blocks `fetch()` calls to `data/*.json` and `data/letter.txt` when opened directly as a file (some browsers do this for security), run a tiny local server instead:

**Python (usually pre-installed):**
```bash
cd project
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Node (if you have it):**
```bash
cd project
npx serve
```

Either option is enough — no installs, no build step, no dependencies.

---

Made with entirely too many unnecessarily long paragraphs. 🐉
