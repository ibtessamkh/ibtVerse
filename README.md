# ibtVerse

An English academic portfolio for Khobizi Ibtessam, built with React, TypeScript, Vite, Tailwind CSS, GSAP ScrollTrigger, and Lenis smooth scrolling. Its default look is a restrained cinematic charcoal and maple-red palette, with an optional warm light theme.

## File structure

```text
src/
  App.tsx
  content.ts              # Site copy and replaceable profile links
  heroFrames.ts           # Editable animation state ranges
  components/              # Navbar, hero, portfolio sections, footer
  styles.css
public/
  frames/                  # Numbered WebP frames for the hero
  cv/                      # Add the reviewed CV PDF here when available
```

The original HTML pages and reusable TSX experiments are retained in the repository; Vite serves the React portfolio from the root `index.html`.

## Install and run

```sh
cd ~/Desktop/ibtVerse
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser. Do not double-click `index.html`; Vite must serve the React modules. The HTML includes a short launch note if it is opened directly.

## Build and preview

```sh
npm run build
npm run preview
```

Vite writes the static production site to `dist/`.

## Hero animation assets

The current numbered files in `public/frames/` are clearly marked photo placeholders made from the existing portrait. They let the canvas renderer, loading indicator, state timing, desktop interaction zones, mobile greeting, and reduced-motion path run while the character animation is being prepared. They do not contain the headset, laptop, look, wave, or pointing poses.

Replace `frame_0001.webp` through `frame_0056.webp` with optimized frames exported from the final animation. Edit the `idle`, `lookLeft`, `lookRight`, and `greeting` ranges and frame rates in `src/heroFrames.ts` to match. Keep dimensions and aspect ratio consistent. The idle range loops; left/right reactions hold briefly then return to idle; the greeting stays on its final frame until the visitor leaves and returns or taps again on mobile.

## Replace placeholders

- Update profile copy and project information in `src/content.ts`.
- Replace empty GitHub and CyberShield AI URLs in that file when the links are ready. The existing LinkedIn link is already configured.
- Add a privacy-reviewed CV PDF under `public/cv/` before exposing a download link. The site currently says “CV available on request”.
- Replace the WebP frame placeholders described above when the animated character frames are ready.

The contact form opens the visitor’s email application using `khobiziibtessam@gmail.com`; it does not send or store messages on a server.

## Deploy

- **Vercel:** the included `vercel.json` configures the Vite framework, `npm run build`, and the `dist` output directory. Import the repository in Vercel and deploy the project.
- **Netlify:** set the build command to `npm run build` and the publish directory to `dist`.
- **GitHub Pages:** run the build and publish `dist/` with Pages or a deployment workflow. If the site is hosted under a repository subpath, configure Vite’s `base` option in `vite.config.ts` for that path before building.
