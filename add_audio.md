# Task: Add background music playback (opt-in) using MP3 files in public/audio

## Goal
Add a small “music” toggle to the Cozy Jotto site that plays a looped MP3 from `public/audio/`. Must work on localhost and GitHub Pages.

## Hard constraints
- Do NOT add new dependencies.
- Do NOT change game logic, word logic, stats, or storage (except for storing music preference).
- Only modify UI code and add a small self-contained component/hook.
- Must respect browser autoplay rules: audio must not start until the user clicks/taps.

## Assets / paths
- Audio files live under: `public/audio/`
- Reference audio via absolute path: `/audio/<filename>.mp3`
- Choose the first `.mp3` in `public/audio/` as the default track (or hardcode `/audio/cozy.mp3` if present).

## Behavior requirements
1. Music is OFF by default.
2. User can toggle Music ON/OFF via a button (e.g., “🔇 music off” / “🔈 music on”).
3. When ON:
   - play the selected MP3
   - loop indefinitely
   - set volume to a cozy low default (e.g., 0.35–0.5)
4. When OFF:
   - pause playback
5. Persist preference in localStorage under a single key:
   - `cozyjotto:music` with values `"on"` or `"off"`
6. Do not create multiple <audio> tags. Use one audio element controlled via React.
7. If `audio.play()` fails (autoplay policy / other), fail silently and keep UI responsive.

## Placement / UI
- Add the toggle button in a non-intrusive location:
  - preferred: top-right area of the header, OR bottom-right fixed position.
- Use Tailwind classes consistent with the existing “cozy amber” theme.
- Button must be keyboard accessible (a real <button> with aria-label).

## Implementation guidance
- Create a component `src/components/MusicToggle.jsx` (or similar) that:
  - owns an `audioRef`
  - reads initial state from localStorage
  - toggles enabled state on click
  - in an effect: if enabled -> set volume, loop, play; else pause
  - writes preference back to localStorage

- Import and render `MusicToggle` from `App.jsx` in the chosen location.

## Acceptance tests (manual)
- `npm run dev`: page loads, music is not playing.
- Click toggle -> music starts playing and loops.
- Refresh page -> toggle state persists and music behavior matches state.
- Toggle off -> music stops.
- `npm run build` then `npm run preview`: works.
- Deploy to GitHub Pages: works (audio loads from `/audio/...`).

## Output format
- Provide a minimal patch: list files changed/added and show their full updated contents or a unified diff.
- Stop once acceptance tests are met. Do not do extra refactors.
