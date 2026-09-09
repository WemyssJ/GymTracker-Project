# Changelog

## v0.5.1.7 — 2026-09-09
### Added
- **Tap-to-edit timer duration** — tap the countdown time on the timer footer to edit it directly (minutes : seconds) without opening Settings; only available in Count down mode while idle

### Changed
- Removed the duration min/sec input from Settings → Timers — Count down / Count up mode selection stays there, but the duration itself is now set on-screen from the timer footer only

---

## v0.5.1.6 — 2026-09-09
### Added
- **Exercise collapse** — tap an exercise's name while logging to collapse it out of the way; its title turns green while collapsed; switching to that day tab uncollapses everything again
- **Weight input colour feedback** — turns white when freshly typed, grey when carried over from last time, green when above your personal best, red when below it
- **Inline timer mode toggle** — the timer footer's label is now a button that switches between Count down / Count up right there, without opening Settings
- **Stopwatch milliseconds** — count-up mode now shows centiseconds (e.g. `0:12.45`)

### Changed
- Removed "Day" from the tab labels (Push/Pull/Leg instead of Push Day/Pull Day/Leg Day)
- Fixed inconsistent spacing between Personal Bests / Log today's session / Past sessions (was 40px vs 22px, now 22px throughout)
- Renamed "Recent sessions" to "Past sessions", and it's now collapsed by default
- Progress tab now only shows sub-tabs for currently active training days
- Timer footer is more compact (smaller display/buttons) and its reserved bottom spacing now matches its actual height instead of overshooting it
- Turning the timer off now force-stops any running timer too, so the footer is never left showing

---

## v0.5.1.5 — 2026-09-09
### Changed
- **Timer simplified to one configurable timer** — Settings → Timers is now a single "Timer" toggle with a Count down / Count up mode selector; count-down duration is set directly (minutes + seconds) instead of fixed presets
- Removed the separate Challenge timer setting and its per-exercise ⏱ stopwatch button — there's now just the one timer, usable for either resting or timing anything else
- Version bump v0.5.1.4 → v0.5.1.5

---

## v0.5.1.4 — 2026-09-08
### Added
- **New user setup wizard** — replaces the old single-screen welcome with an 8-step walkthrough: name, optional partner/friend, per-person colours, theme (now with visual colour-swatch previews), training days, workouts (recommended defaults, editable inline with the real exercise picker), default sets per exercise, and rest timer
- **Drag-to-reorder exercises** — Settings → Exercises rows now have a ⠿ drag handle (touch + mouse via Pointer Events) to reorder a day's exercise list
- **Exercise picker "(already selected)" label** — greyed-out already-picked exercises now say so in text, not just via opacity
- **Default sets per exercise** — new Settings → Exercises control; used as the starting set count for any exercise without its own override
- **Delete All Data now asks first** — choose to keep your profile (people, colours, theme, days, exercises, settings) and only clear workout history, or reset everything and go through setup again
- **"Next day" legend** — a small "🟢 = your next day" line under the tab bar explains the green dot next to the suggested day
- **Persistent timer footer** — when the rest timer is enabled, a fixed footer (doesn't scroll) stays on workout day pages with a large countdown/stopwatch display and Start/Pause/Stop/Lap controls, usable anytime during a workout — not just automatically after logging a set

### Changed
- Version bump v0.5.1.3 → v0.5.1.4

---

## v0.5.1.3 — 2026-09-08
### Added
- **Android app** — GymTracker can now be packaged as an Android APK via Capacitor (`create-apk.bat`); web assets are bundled locally so the app runs fully offline once installed, with no dependency on GitHub Pages
- Local bundled copy of the SheetJS (`xlsx`) library — Excel export/import now works offline instead of requiring the cdnjs CDN

### Changed
- Version bump v0.5.1.2 → v0.5.1.3

---

## v0.5.1.1 — 2026-09-07
### Changed
- **Exercise picker middle column** — now shows the muscle diagram (highlighted body) instead of text group labels; uses `EXERCISE_INFO[name].image` (the same diagram shown in the ℹ modal)
- Version bump v0.5.1.0 → v0.5.1.1

---

## v0.5.1.0 — 2026-09-07
### Changed
- **Exercise picker layout** — replaced 2-column photo grid with a scrollable 3-column list: exercise name (left), muscles hit (middle), thumbnail image (right); all results visible at once, no pagination needed
- Version bump v0.5.0.9 → v0.5.1.0

---

## v0.5.0.7 — 2026-09-07
### Added
- **Exercise picker** — replaces the Settings dropdown with a visual modal: search by name, filter by muscle group (Chest / Shoulders / Back / Arms / Legs / Glutes / Core), browse 2-column photo grid, or add a custom exercise name

### Changed
- Version bump v0.5.0.6 → v0.5.0.7

---

## v0.5.0.6 — 2026-09-07
### Added
- **Local exercise images** — 43 exercises now have locally-hosted start/peak photos served from `images/exercises/`; no external CDN dependency

### Fixed
- Exercise tab in info modal now correctly loads local image files (was broken due to stale remote URL reference)

### Changed
- Version bump v0.5.0.5 → v0.5.0.6

---

## v0.5.0.5 — 2026-09-07
### Added
- **Exercise images toggle** — the exercise info modal now has a "Muscles / Exercise" pill toggle; Exercise view shows start + peak photos from the RepDB dataset (repdb.co) for 32 exercises
- **Rest timer** — optional countdown between sets; auto-starts after logging a session; duration configurable (30s / 1m / 1.5m / 2m / 3m); vibrates on completion; toggled in Settings → Timers
- **Challenge timer** — optional stopwatch for timed exercises (Plank, Leg Raise, Russian Twist); adds a ⏱ button next to those exercises in the log form; toggled in Settings → Timers
- **Credits section** — Settings → Credits lists musclecharts.net, RepDB, and SheetJS with links

### Changed
- Version bump v0.5.0.4 → v0.5.0.5

---

## v0.5.0.4 — 2026-09-07
### Added
- **Optional training days** — each day type (Push / Pull / Leg / Core) can be toggled on/off in Settings → Days; disabling hides the tab but keeps all logged data; at least one day must remain active
- **Setup day selection on first launch** — the welcome screen now lets new users pick which days they train before importing or starting fresh
- **Inline GitHub restore on welcome screen** — new users on a new device can enter their token + repo directly on the welcome screen to restore all data in one step, without navigating through Settings first; no need to re-link GitHub every time

### Changed
- Version bump v0.5.0.3 → v0.5.0.4

---

## v0.5.0.3 — 2026-09-07
### Added
- **Core Day tab** — Plank, Crunch, Leg Raise, Russian Twist, Cable Crunch; fully wired into tracking, history, progress chart, and settings
- **History "Show all" toggle** — sessions beyond the first 6 are now accessible via an expand link; collapses back on tab switch
- **GitHub token show/hide toggle** — 👁 button next to the token field; resets to hidden each time the modal opens

### Changed
- **Modal animations** — all modals now slide up on open and slide down on close (0.22s / 0.18s)
- **Tab crossfade** — switching tabs fades content in (0.15s opacity)
- **Collapsible section transitions** — Settings and day-view sections animate open/close with max-height + opacity instead of snapping
- **Toast tiers** — PR toasts pulse amber; error/reg toasts animate in; animation restarts correctly on repeat triggers
- **Version bump** — v0.5.0.2 → v0.5.0.3

---

## v0.5.0.2 — 2026-09-07
### Changed
- Compressed all 61 muscle diagram PNGs from 72.6 MB → 31.6 MB (57% reduction)
- Added `.gitignore` to exclude `node_modules`, scripts, and dev files from deployment

---

## v0.5.0.1 — 2026-09-07
### Added
- Exercise info modal header (title + ✕) stays pinned when scrolling through muscle diagram and tips

### Fixed
- iOS PWA top content cropped under status bar — added `env(safe-area-inset-top)` to sticky header
- iOS PWA scroll snap-back on release — `html`/`body` now use `height:100%` + `overflow-y:scroll` with `overscroll-behavior-y:none`
- Toast and fixed elements now respect `env(safe-area-inset-bottom)` on iPhone

---

## v0.5.0.0 — 2026-09-07
### Added
- Exercise dropdown in Settings (alphabetical, day-relevant) with Custom… option for free-text entries
- Exercise info button (ℹ) on each log exercise — shows muscle diagram, primary/secondary muscles, and form tips
- Muscle diagram images for 43 exercises across push / pull / leg / core subfolders
- Default user changed to John Smith (blue); seed history removed for clean new-install experience
- Project moved to `C:\Users\wemyssj\Desktop\GymTracker-Project`
