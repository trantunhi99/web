# Alex Tran Portfolio

A static, highly-interactive personal portfolio: custom-cursor and magnetic hover
effects, a canvas particle background, scroll-driven reveal animations, a smooth-scroll
wrapper, and a preloader. Built with no frontend framework — plain HTML, CSS, and JS —
for maximum performance and total control over rendering.

There is also a separate Next.js app, `meet-alex-ai/`, which powers the AI chat
experience linked from the site.

## Directory Structure

```
/
├── index.html            # The live site — hand-authored, edit this directly
├── ai.html               # Shell page embedding the meet-alex-ai app
├── README.md             # This documentation
├── assets/
│   └── media/            # Images, profile picture, showcase video, favicon
├── css/
│   └── portfolio.css     # All styling for the live site
├── js/
│   └── portfolio.js      # Cursor, parallax, reveals, smooth scroll, lightbox
├── Resume/               # Résumé PDF + DOCX
├── meet-alex-ai/         # Next.js AI chat app (deployed separately on Vercel)
└── cms-legacy/           # RETIRED Python CMS — see warning below
    ├── cms.py
    └── content.json
```

## How to Edit Your Website

Edit `index.html`, `css/portfolio.css`, and `js/portfolio.js` directly. There is no
build step.

To preview locally:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

### Legacy files still in the tree

`css/styles.css` and `js/script.js` belong to the pre-redesign design. Nothing
references them any more; they're kept only so the old look can be restored from git
if ever needed. Safe to delete.

## ⚠️ The retired CMS (`cms-legacy/`)

The site used to be **generated** by `cms-legacy/cms.py` from `content.json`. That
generator still contains the **old, pre-redesign** markup, so running it against the
repo root would wipe out the current design.

It has been defused: by default it now writes to `cms-legacy/index.legacy.html` — a
harmless preview — and leaves the live `index.html` alone. Publishing the old design
over the live site requires an explicit flag, and takes a timestamped backup first:

```bash
cd cms-legacy
python3 cms.py            # safe: writes index.legacy.html only
python3 cms.py --force    # DESTRUCTIVE: overwrites the live index.html
```

If you want a CMS again, `generate_index_html()` needs to be rewritten to emit the
redesign's markup, and `content.json` expanded to cover its sections.

## Deployment

The site is pure static HTML/CSS/JS with no build step, so the repo root can be
deployed as-is on:

- **GitHub Pages**
- **Vercel**
- **Netlify**

Just push and it goes live.

Note: `meet-alex-ai/` is a separate Next.js deployment and needs an `OPENAI_API_KEY`
environment variable set on its host.
