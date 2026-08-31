# Spotify Clone

A responsive Spotify Clone built with HTML, CSS & JavaScript featuring an interactive music player and playlist functionality.


## Features

- Sidebar with Home, Search, and Your Library navigation
- Library filter chips — Playlists, Artists, Albums
- Quick picks grid on the home page
- Sections: Made For You, Recently Played, Popular Artists
- Fully functional player bar with:
  - Play / Pause toggle
  - Previous & Next track buttons
  - Shuffle and Repeat controls
  - Progress bar with hover interaction
  - Volume slider
  - Like / Unlike song (heart button)
- Topbar that darkens on scroll
- Dynamic greeting — Good morning / afternoon / evening based on time

## Tech Stack

- HTML5
- CSS3 (Grid, Flexbox, custom properties)
- Vanilla JavaScript (no frameworks)
- SVG icons (all local, no icon library needed)

## File Structure

```
spotify/
├── index.html       # Main markup
├── style.css        # All styles
├── script.js        # Interactivity
└── svgs/            # All icon SVGs
    ├── logo.svg
    ├── home.svg
    ├── search.svg
    ├── library.svg
    ├── play.svg
    ├── pause.svg
    ├── prev.svg
    ├── next.svg
    ├── shuffle.svg
    ├── repeat.svg
    ├── heart.svg
    ├── heart-filled.svg
    └── ...
```

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/your-username/spotify_clone.git
   ```
2. Open `index.html` directly in your browser — no build step needed.

## Notes

- Keep the `svgs/` folder inside the same directory as `index.html` — icons load via relative paths.
- No internet required after first load (except Google Fonts).