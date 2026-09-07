# Changelog

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
