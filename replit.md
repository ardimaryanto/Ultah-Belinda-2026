# Workspace

## Overview

A digital birthday gift website for Aprillia Belinda Safitri — celebrating her 24th birthday with a warm, romantic, pastel-aesthetic single-page experience.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend (birthday-belinda)**: React 18 + Vite, plain CSS (no Tailwind for the page styles)

## Artifacts

- `artifacts/birthday-belinda` — main birthday website (served at `/`).
  - All photos and audio live in `public/assets/` and are referenced as `/assets/...`.
  - Photos: `foto1.jpg` … `foto7.jpg`
  - Audio: `kicau-mania-reff.mp3` (user-provided; the page gracefully shows "Backsound belum tersedia" if missing or fails to load).
  - No backend, no database, no external storage.
- `artifacts/api-server` — shared Express API (not used by the birthday page).
- `artifacts/mockup-sandbox` — design canvas (not used by the birthday page).

## Sections of the birthday page

1. Hero — "Happy 24th Birthday" + name + open-gift button + music toggle.
2. Galeri — auto-scrolling polaroid carousel with lightbox.
3. Pesan utama — long heartfelt message in Indonesian.
4. Bunny interaktif — fixed bottom-right SVG bunny that jumps and pops bubbles.
5. Doa & Harapan — six wish cards.
6. Penutup — closing line + replay buttons (confetti / gallery / bunny).

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Frontend dev: managed automatically by the Replit workflow.

## Notes

- Audio never autoplays — Android/iOS block autoplay; user must press the music button.
- Volume default 0.5, looped.
- Lightbox supports keyboard (Esc to close, arrows to navigate), tap/click outside to close, swipe-friendly carousel on mobile.
