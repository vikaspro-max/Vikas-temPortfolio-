# Vikas Kumar: Portfolio Website

Plain HTML + CSS + JavaScript. No build step, no installs, works offline.
Icons are inlined (Lucide-style outline SVGs), so there is no icon dependency. The only
external request is the optional Google Fonts stylesheet; without it the site falls back to system fonts.

## Folder structure

```
vikas-portfolio/
├── index.html            ← page structure and text
├── css/styles.css        ← all styling (colours are variables at the top)
├── js/
│   ├── config.js         ← ✏️ YOUR email, social links, resume, projects
│   └── main.js           ← menu, scroll highlight, animations (no need to edit)
├── assets/
│   ├── vikas-profile.jpg      ← main photo (960px wide)
│   ├── vikas-profile-520.jpg  ← smaller copy for phones
│   ├── og-image.jpg           ← preview image for WhatsApp/social sharing
│   ├── favicon.svg
│   ├── projects/              ← put project thumbnails here
│   └── resume/                ← put your resume PDF here
└── README.md
```

## Replace the profile photo

1. Crop your new photo to a portrait shape (about 4:5), face in the upper half.
2. Save one copy as `assets/vikas-profile.jpg` (about 960 px wide) and a smaller one as
   `assets/vikas-profile-520.jpg` (about 520 px wide). Keep the same file names.
3. Refresh the page. If your face is cut off, change `object-position` in `css/styles.css`
   (search `.portrait-frame img`; the second number is the vertical position, e.g. `50% 10%`).

## Run on Android with Acode

1. Copy the whole `vikas-portfolio` folder to your phone (unzip it).
2. In Acode: menu → **Open Folder** → **Add a folder** → pick `vikas-portfolio`.
3. Open `index.html`, then tap the **▶ Run / Preview** button (top right). It opens in a mini browser.
4. After editing, save (💾) and refresh the preview.
   Tip: if the preview looks stale, close it and run again.

## Publish free with GitHub Pages

1. Create a free account at github.com and tap **New repository**. Name it `vikas-portfolio`
   (or `YOURUSERNAME.github.io` for a root address). Keep it **Public**.
2. Upload everything **inside** the folder (`index.html`, `css`, `js`, `assets`, …) via
   **Add file → Upload files**, then **Commit changes**. `index.html` must be at the top level.
3. Go to **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**,
   **Branch: main**, folder **/ (root)**, then **Save**.
4. After 1 to 2 minutes your site is live at `https://YOURUSERNAME.github.io/vikas-portfolio/`.
5. Paste that link into your Instagram/LinkedIn bio, and also into `config.js` as the link for
   the Portfolio project card if you like.

## Placeholder checklist

Edit these in `js/config.js` unless noted. Empty values show "Not added yet" instead of a dead link.

- [ ] `email`: your real email address
- [ ] `instagram`: full URL, e.g. `https://www.instagram.com/yourhandle`
- [ ] `linkedin`: full profile URL
- [ ] `github`: full profile URL
- [ ] `resume`: e.g. `assets/resume/Vikas-Kumar-Resume.pdf` (button appears only when set)
- [ ] Project thumbnails: add images to `assets/projects/` and set `image: "assets/projects/name.jpg"`
- [ ] Project links: set `link` (optional) and change `placeholder: true` → `false` once the work is real
- [ ] Replace placeholder project titles/descriptions with what you actually made
- [ ] `og-image.jpg`: already made from your photo; replace if you want a different share image
- [ ] Optional: add institution names or dates to the Education cards in `index.html` (none were invented)
- [ ] Optional: after publishing, add your live URL to the `<head>` as an `og:url` tag

## Notes

- There is no contact form on purpose; a form needs a backend or service (e.g. Formspree). Buttons link straight to your email and profiles.
- The theme is dark only. Colours live in `:root` at the top of `css/styles.css`.
- Animations switch off automatically for people who use "reduce motion".
