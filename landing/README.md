# Landing page

`index.html` is a standalone marketing page for Pyramid. It has no build step and no
dependencies — open the file in a browser, or serve the folder with any static server:

```bash
npx http-server landing
```

It is deliberately separate from the Next.js app: the page is a single file so it can be
published or hosted on its own. Its design is derived from the app's own system rather
than a new one — the palette is the token set from `src/app/globals.css` (light and dark),
the cards, pill buttons and status dots mirror `src/components/task/TaskCard.tsx` and
`TaskBoard.tsx`, and the board preview reproduces the `.dragging-card` / `.drop-target-column`
treatment. If those tokens change, update the `:root` block at the top of `index.html` to match.

Motion is plain CSS and a small inline script: an SVG line-flow diagram (dash-offset pulses),
a nav that condenses on scroll, a scroll-driven tilt on the board preview, and reveal-on-scroll
sections. All of it is disabled under `prefers-reduced-motion`, and sections stay visible if
JavaScript never runs.

The testimonial quotes are fictional and labelled as such on the page.
