# GLX — Edit Instructions

This is a static HTML site for **GLX** (Bright Engine client).
Built and maintained by Jared at Bright Engine.

## Site shape

- **Framework:** None. Plain static HTML + CSS + JS served by Vercel.
- **Build step:** None. Push to `main` → Vercel serves files directly.
- **Pages:** All `.html` files at the repo root:
  - `about.html` — about page
  - `contact.html` — contact form
  - `index.html` — homepage
  - `services.html` — services
- **Styles:** `/css/site.css` — one stylesheet for the entire site.
- **Images:** `/images/` (logo, favicons, hero) and `/images/album/` (portfolio photos, if present).

### Contact form backend

- No `/api/contact.js` in this client's repo. The contact form (if present) may post to a third-party endpoint (Formspree, Netlify, etc.) — check `contact.html` to confirm.
- Do not introduce a backend without confirming with Jared first.

## Client details

- **Client name:** GLX
- **Location / niche:** Pennsylvania area
- **Phone (appears across every page):** (484) 784-7239
- **Tel link format:** `tel:+14847847239`
- **Brand color:** `(unknown — inspect css/site.css)`. (Check `/css/site.css` for the exact palette in use.)
- **GitHub repo:** `bright-clients/glx`

## When making an edit

1. Identify which page(s) the change touches. Homepage = `index.html`.
2. **If the change is global** (phone number, hours, company name, address, brand color), it almost certainly appears in EVERY `.html` file — search and replace across all of them. These values typically appear in: header bar, mobile nav, hero, footer, mobile sticky CTA, structured data JSON-LD, and meta tags.
3. Make the change directly in the HTML — there is no templating engine.
4. Verify HTML is well-formed (every tag you open, close).
5. Commit with a clear message: e.g. `"Update business hours per client request"`.
6. Push to `main`. Vercel auto-deploys in ~10 seconds.

## Image edits

When the prompt includes Cloudinary URLs as reference photos:

1. Download the image from the Cloudinary URL (it's a public URL, no auth needed).
2. Save into `/images/album/` (or `/images/` if there's no album folder) with a descriptive filename (e.g. `photo-new-hero.jpg`).
3. Update the `<img src="...">` reference in the relevant HTML file(s).
4. Commit both the new image file AND the HTML change in the same commit.

## What NOT to do

- **Don't add a build system, bundler, `package.json` scripts, or framework.** This site is intentionally static. Adding Webpack/Vite/Next/etc. would break the current Vercel deployment.
- **Don't introduce React, Vue, templating engines, or any JS frameworks.**
- **Don't refactor unrelated code** while making a requested edit. Stay scoped.
- **Don't change CSS** unless the request explicitly asks for a styling change.
- **Don't create branches.** Commit directly to `main`.
- **Don't touch `/api/contact.js`** (if present) unless the edit specifically asks about the contact form.
- **Don't run `npm install` or modify `package.json`.**

## After pushing

Vercel auto-deploys within ~10-15 seconds of the push to `main`. The live site will reflect the change immediately after deploy finishes. No manual deploy step needed.

Jared will reply to the client once the edit is verified live.

## Important notes

Contact form posts to Formspree (`https://formspree.io/f/mgopeyrg`) — leave the form action alone unless the edit explicitly says to change it.
