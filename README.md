# AI Kavithaigal — Template Studio Pro

Enterprise-level Tamil Kavithai image generator for Instagram, Facebook, YouTube, WhatsApp, LinkedIn, Pinterest, and X/Twitter.

Built with **React 18 + Vite + Tailwind CSS + shadcn/ui + Canvas API**.

---

## Features

- **10 Premium Color Themes** — Midnight, Rose, Ocean, Gold, Emerald, Neon, Amber, Frost, Crimson, Violet
- **11 Social Media Sizes** — Instagram (Post, Reel, Story, Landscape, Portrait), Facebook, X/Twitter, YouTube Thumbnail, WhatsApp Status, LinkedIn, Pinterest
- **5 Font Families** — Tamil Classic, Elegant Serif, Display, Modern Sans, Monospace
- **5 Frame Styles** — Corner Accents, Full Border, Double Line, Minimal, None
- **Full Customization** — Font size, heading size, line spacing, text alignment, glow intensity, particles toggle, brand toggle
- **Smart Download** — `navigator.share()` on mobile (native share sheet) with blob URL fallback on desktop
- **Pixel-Perfect Canvas Rendering** — High-resolution PNG output at exact social media dimensions
- **Live Preview** — Real-time preview updates as you edit

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
ai-kavithaigal-pro/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── lib/
│   │   └── utils.js              # shadcn cn() utility
│   └── components/
│       ├── AIKavithaigalStudio.jsx  # Main studio component
│       └── ui/
│           ├── tabs.jsx           # shadcn Tabs
│           └── slider.jsx         # shadcn Slider
```

---

## Social Media Size Reference

| Platform     | Type       | Dimensions  |
|-------------|-----------|-------------|
| Instagram   | Post       | 1080 × 1080 |
| Instagram   | Reel       | 1080 × 1920 |
| Instagram   | Story      | 1080 × 1920 |
| Instagram   | Landscape  | 1080 × 566  |
| Instagram   | Portrait   | 1080 × 1350 |
| Facebook    | Post       | 1200 × 630  |
| X / Twitter | Post       | 1600 × 900  |
| YouTube     | Thumbnail  | 1280 × 720  |
| WhatsApp    | Status     | 1080 × 1920 |
| LinkedIn    | Post       | 1200 × 627  |
| Pinterest   | Pin        | 1000 × 1500 |

---

## How Download Works

1. **Mobile (iOS/Android):** Uses `navigator.share()` API — opens native share sheet where you can Save to Photos, share to Instagram, WhatsApp, etc.
2. **Desktop:** Creates a Blob URL and triggers `<a download>` click — file saves directly to Downloads folder.

Both methods produce full-resolution PNG at the exact pixel dimensions.

---

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- shadcn/ui (Radix Primitives)
- Lucide React Icons
- Canvas API (native browser)
- Google Fonts (Noto Sans Tamil, Cormorant Garamond, Playfair Display, DM Sans)

---

## Author

**@shoukathsandy**

---

## License

MIT
