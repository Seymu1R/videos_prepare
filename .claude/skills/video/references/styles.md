# Design styles

Pick the style the user names; otherwise pick the one that fits the topic best. These are starting points — adapt colours to the brand when the user supplies one. Every font below is on Google Fonts with `latin-ext` (Azerbaijani-safe); verify the glyphs ə ğ ı ş İ in the QC stills anyway.

Import path = font name without spaces: `@remotion/google-fonts/Inter`, `Fraunces`, `ArchivoBlack`, `Anton`, `SpaceGrotesk`, `PlayfairDisplay`, `DMSerifDisplay`, `Baloo2`, `Fredoka`. Before using any other font, check it has `latin-ext`: `node -e 'const i=require("@remotion/google-fonts/<Font>").getInfo();console.log(Object.keys(Object.values(i.fonts.normal)[0]))'`.

Contrast rule for all styles: body text at least 4.5:1 against what is behind it; never put muted text over a busy area.

## Dark Tech (SaaS, apps, AI, fintech)
- Palette: bg `#06060A`, text `#F5F5FA`, muted `#8B8BA3`, accents violet `#7C5CFF` → cyan `#22D3EE`, alert `#FF4D6D`.
- Fonts: Inter 800–900 for everything; tight letter-spacing on headlines (−2 to −6 px).
- Motion: `snappy` + `bouncy`, zoom-through and whip transitions, camera shake on hooks.
- Background: drifting violet/cyan glows, perspective floor grid scrolling toward camera, vignette.
- Elements: glass panels (`rgba(255,255,255,0.045)` + 2 px `rgba(255,255,255,0.1)` border), gradient check icons, progress bars with glow.

## Warm Premium (café, food, bakery, hospitality)
- Palette: bg `#0E0806`, text `#FBF3E8`, muted `#B9A593`, accents orange `#FF8A3D` → caramel `#E0A15E` → cream `#F3E1C7`.
- Fonts: Fraunces 800–900 for headlines, Inter for body.
- Motion: `gentle` for hero objects, `bouncy` for stamps/offers, shared-element morph of the product.
- Background: warm drifting glows, blurred bokeh particles of the product (beans, leaves, crumbs).
- Elements: illustrated SVG product (cup, plate) with living detail (steam, liquid wave), menu cards with price count-up, rotated offer stamp.

## Light Minimal (Apple-like, premium hardware, design studios)
- Palette: bg `#F5F5F7`, text `#111114`, muted `#6E6E73`, one accent e.g. `#0071E3`.
- Fonts: Inter 600–800, generous letter-spacing on small caps labels (+4 px).
- Motion: `gentle` only, slow push-ins, mask wipes and fades; no shake, no blur bursts.
- Background: flat with one very soft radial highlight; subtle shadow under hero objects.
- Elements: large whitespace, one product/hero per scene, thin 1–2 px dividers.

## Bold Pop (retail sales, youth brands, events)
- Palette: bg `#111111` or saturated `#FFE14D`, text black/white, accents `#FF3B6B`, `#2D6BFF`, `#00D68F`.
- Fonts: Archivo Black or Anton for headlines (uppercase), Inter for body.
- Motion: `bouncy` everywhere, hard-hitting slams with big shake, quick 6-frame overlaps, rotating stickers.
- Background: flat colour blocks that slide in as wipes, halftone dots or diagonal stripes.
- Elements: thick outlines (6–10 px), offset drop shadows (`12px 12px 0 #000`), price tags, starbursts.

## Neon Night (gaming, nightlife, music, crypto)
- Palette: bg `#05010D`, text `#FFFFFF`, accents magenta `#FF2BD6`, cyan `#00F0FF`, lime `#B6FF3B`.
- Fonts: Space Grotesk 700 for headlines, Inter for body.
- Motion: `snappy`, glitch jitter (2–3 frame horizontal offsets of RGB-split copies), strobe-free pulses.
- Background: neon grid horizon, scanlines at low opacity, glow bloom (`textShadow` stacked 0 0 20/40/80 px).
- Elements: neon-outlined cards, equaliser bars driven by `Math.sin`, glowing CTA.

## Luxury Editorial (fashion, jewellery, real estate, beauty)
- Palette: bg `#0B0B0B`, text `#F4EFE6`, muted `#9A9284`, accent gold `#C9A45C` → `#F1D9A0`.
- Fonts: Playfair Display or DM Serif Display for headlines (mixed italic), Inter 400–500 small caps for labels.
- Motion: `gentle` and `heavy`, long holds, slow mask reveals, letter-spacing animating from wide to normal.
- Background: deep gradient, thin gold frame lines that draw on, subtle grain.
- Elements: hairline dividers, numbered sections (01 / 02), elegant price in serif.

## Playful Kids / Education
- Palette: bg `#FFF8EC`, text `#1F1B3A`, accents `#FF7A59`, `#3DB2FF`, `#FFC93C`, `#7ED957`.
- Fonts: Baloo 2 or Fredoka 600–800, rounded.
- Motion: `bouncy` with squash-and-stretch (`scale: "1.15 0.85"` → `"1 1"`), wobbly rotations, pop-in confetti.
- Background: soft blobs that drift and morph (`borderRadius` animating), doodle shapes.
- Elements: rounded cards (radius 40+), sticker-like icons, progress stars.
