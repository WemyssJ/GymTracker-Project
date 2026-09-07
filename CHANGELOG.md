# Changelog

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
