# ibtVerse

An English-language academic portfolio for Khobizi Ibtessam, built with semantic HTML, CSS and vanilla JavaScript. It runs without a build step or server. The contact form uses the visitor's email application as a fallback; no message is stored on a server.

## Run locally

Open `index.html` in a browser, or serve the folder with `python3 -m http.server 8000` and visit `http://localhost:8000`.

## Update your content

- Replace `assets/photo.jpg` with your portrait, keeping the same filename. The original `photo.jpg` is also kept at the project root.
- Add document scans to `assets/docs/` using the filenames already referenced in the gallery: `technoformat-cybersecurity.jpg`, `language-attestation.jpg`, `baccalaureate-2024.jpg`, `internship-attestation.jpg`, `veterinary-diploma.jpg`, and `master-attestation.jpg`.
- In `index.html`, replace the `#` placeholders for GitHub and TryHackMe (LinkedIn is already set), and replace the `#` links in the CyberShield AI project with its live demo and repository URLs.
- The contact address is `khobiziibtessam@gmail.com`; change it in `index.html` and `js/script.js` if needed.

Document scans are presented only as thumbnails and lightbox previews. Keep personal identifiers and dates of birth out of the page text and redact them from scans before publishing. The site notes that original documents are available on request.

## Deploy

- **GitHub Pages:** push this folder to a repository and enable Pages for the publishing branch.
- **Netlify:** deploy the folder directly or connect its repository. No build command is required.

## React liquid-glass navbar (optional)

The portfolio itself is still plain HTML/CSS/JavaScript, so it does not execute `.tsx` files. The component source is at `src/components/ui/liquid-glass-navbar.tsx`; it has no icon or animation package dependency (the icons and styles are included). Use it from a React app as `@/components/ui/liquid-glass-navbar`.

### Set up a separate Vite + React + TypeScript app

Keep the static portfolio intact and create the React app in its own folder:

```sh
npm create vite@latest react-app -- --template react-ts
mkdir -p react-app/src/components/ui
cp src/components/ui/liquid-glass-navbar.tsx src/components/ui/doodle-crew-footer.tsx react-app/src/components/ui/
cd react-app
npm install
npm install tailwindcss @tailwindcss/vite
npm install -D @types/node
npx shadcn@latest init
```

In `react-app/src/index.css`, use Tailwind v4's import:

```css
@import "tailwindcss";
```

Add `baseUrl` and the `@/*` path to both `react-app/tsconfig.json` and `react-app/tsconfig.app.json` (the Vite template splits TypeScript settings):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Update `react-app/vite.config.ts` to include Tailwind and the same alias:

```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
```

Use it from a React component with your portfolio's section anchors:

```tsx
import { LiquidNavbar, NimbusIcons } from "@/components/ui/liquid-glass-navbar"

<LiquidNavbar items={[
  { label: "Home", href: "#top", icon: NimbusIcons.home, fx: "glow" },
  { label: "About", href: "#about", icon: NimbusIcons.user, fx: "wave" },
  { label: "Experience", href: "#experience", icon: NimbusIcons.globe, fx: "spin" },
  { label: "Projects", href: "#projects", icon: NimbusIcons.plane, fx: "plane" },
  { label: "Contact", href: "#contact", icon: NimbusIcons.drop, fx: "drop" },
]} />
```

The Vite + shadcn convention resolves `@/components/ui/...` to `src/components/ui/...`; the stylesheet entry point is `src/index.css`. Keeping reusable UI components in that folder makes the alias predictable for imports, the shadcn CLI, and future UI additions. `lucide-react` is not needed because this component exports its own small inline SVG icons. Then run `npm run dev` from `react-app`.

References: [shadcn Vite installation](https://ui.shadcn.com/docs/installation/vite), [shadcn components.json aliases](https://ui.shadcn.com/docs/components-json), [Vite guide](https://vite.dev/guide/).


The sketchbook-style footer is also available at `src/components/ui/doodle-crew-footer.tsx`, with an Ibtessam-specific example in `src/components/ui/demo.tsx`. To use it in the optional React app, copy those files into `react-app/src/components/ui/`, then render `<Demo />` from the app page or place `<DoodleCrewFooter />` at the bottom of your layout. It has no icon library, image, font download, or other runtime dependency. `preset="auto"` follows `--color-background` and `--color-foreground`; the static portfolio defines these tokens for both light and dark themes.

The current HTML site keeps its own footer and dark-mode toggle; TSX components require the optional React app to run. The theme button saves the selected light/dark setting in local storage.
# my-first-project
