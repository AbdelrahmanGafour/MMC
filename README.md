# MMC Group landing page

Vite + vanilla HTML/CSS/JS, GSAP ScrollTrigger and Lenis for motion.

```
index.html            semantic markup, meta, JSON-LD (Organization, WebSite, FAQPage)
src/css/base.css      tokens, typography, header, buttons, footer
src/css/sections.css  per-section styles
src/js/main.js        preloader, smooth scroll, reveals, parallax, horizontal scroll, cursor, form
public/               robots.txt, sitemap.xml, llms.txt (GEO), manifest, images (WebP)
assets-src/           source JPGs; `npm run images` regenerates public/images/*.webp
```

Commands: `npm run dev`, `npm run build`, `npm run preview`.

Notes: gallery/event photos are Unsplash placeholders, replace with MMC's own event photography. The enquiry form opens a mailto (no backend).
