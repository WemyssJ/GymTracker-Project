# Changelog

## v0.7.4 — 2026-09-09
### Fixed
- **Estimated 1RM could spike to implausible numbers** — the formula was reading a rep count off the front of old free-text reps notes (e.g. "57.5kg (4,4), 55kg (4)" → read as 57 reps), producing wildly inflated estimates. It now only estimates from a clean whole-number rep count and skips anything else, same as it skips a blank set

### Added
- **X/Y axis labels on the Progress chart** ("Session date" / "Weight (kg)" or "Est. 1RM (kg)")
- **Settings jump nav** — a row of quick links (Days · Theme · People · Exercises · Backup · Timers · Credits) at the top of Settings that expands and scrolls straight to a section, instead of scrolling past everything above it
- **Exercises in Settings collapse per day** (like the setup wizard already did), defaulting to collapsed except whichever day you were on when you opened Settings — with 4 days and 20+ exercises this was the single biggest reason Settings felt endless
- **"+ Add note" link** instead of an always-visible notes box per person — a 2-person, 6-exercise day no longer shows 12 empty note fields at once; tapping it reveals and focuses the field, and it stays open once it has text

### Changed
- **Personal Bests now defaults to collapsed** (matching History) so the actual logging form is front and center when you open a day
- Renamed the Backup & Sync GitHub button's icon from the settings-gear emoji to a key, since it sat one tap away from the real Settings gear and looked like a second settings screen

---

## v0.7.3 — 2026-09-09
### Changed
- **Default reps target moved into each person's card in Settings → People** (far right, below their colour swatches) instead of living as separate rows down in Settings → Exercises

---

## v0.7.2 — 2026-09-09
### Added
- **Projected pace line on Progress** — a dashed line now extends from your last logged point across the final quarter of the chart, showing where you'd land if you kept up your own historical rate of improvement (a simple linear trend fit to your actual data, not a fixed target). Needs at least 2 sessions logged for that exercise/person to appear; real data is drawn at the same point spacing, just fit into the first three-quarters of the chart to make room

---

## v0.7.1 — 2026-09-09
### Changed
- **Moved the Assisted/Unassisted and Weight/Est. 1RM toggles on Progress** — they sat as two more full-width pill rows between the Exercise picker and the chart, adding to an already tall stack of button rows before you reached the chart. They now sit together in one combined row directly above the chart, right after the people legend, grouping "how to view this chart" next to the chart itself instead of mixed in with "which exercise to view"

---

## v0.7.0 — 2026-09-09
### Added
- **Comments** — an optional "Notes (optional)" field per person under each exercise, for things like "watch form" or "felt tired" that don't belong in the reps field. Notes never carry forward between sessions, show up in History and in the exercise info History tab, and restore correctly when editing a past session. Toggle it off in Settings → Exercises if you don't want it (on by default)
- **Estimated 1RM trend on Progress** — a Weight/Est. 1RM switch above the chart lets you view either your logged top-set weight or an estimated one-rep max (Epley formula) over time, so you can compare sessions with different weight/rep combos on one consistent number

---

## v0.6.6 — 2026-09-09
### Added
- **Workout, Exercise, and Consistency headers on Progress are now collapsible** (tap to expand/collapse, state remembered), matching every other section header in the app

### Changed
- **Exercise info modal no longer visibly resizes when switching Muscles/Exercise tabs** — Form Tips moved from the Muscles tab to the Exercise tab (alongside the RepDB images), balancing the two tabs' heights so the modal doesn't noticeably jump size when tapping between them; the Exercise tab is also no longer hidden for exercises without RepDB images, since it can always show at least Form Tips now

---

## v0.6.5 — 2026-09-09
### Changed
- Added "Workout" and "Exercise" section headers above their respective button rows on the Progress tab, matching the "Consistency" label style already used for the heatmap below

---

## v0.6.4 — 2026-09-09
### Added
- **Per-person default rep target** — each person now gets their own reps preset in Settings (previously it was one shared number for everyone), and the reps field's green/red colour coding compares against that person's own target
- **Sets +/- buttons hide at the limits** — the "add set" button disappears at 6 sets and "remove set" disappears at 1, for the per-exercise counter and the default-set-count settings, instead of sitting there doing nothing once you hit the cap

### Fixed
- A CSS rule (`display:flex` on `.set-count-btn`) was overriding the browser's default hidden behaviour, so toggling a button's `hidden` attribute had no visible effect — this silently affected any future use of `hidden` on these buttons, not just the new limit-hiding above

---

## v0.6.3 — 2026-09-09
### Changed
- **Reps now always presets to your default rep target** (Settings, 8 by default) instead of carrying forward the last session's actual reps text — older sessions often have messy free-text notes ("3r", "2x, 4r", "3,3,2") that showed up as an inconsistent mix of blank/garbled prefills; weight still carries forward as before, only reps changed
- **Reps input is now colour-coded like weight** — green if you log more than your default rep target, red if fewer, matching the existing PR/regression colouring on the weight field
- **Assisted toggle no longer reuses the other mode's weight** — switching Assisted on/off for an exercise with no history yet in that mode now clears the weight field instead of silently showing the other mode's number, which made it look like the toggle wasn't doing anything. Once you've logged in both modes, switching correctly shows each mode's own last weight

---

## v0.6.2 — 2026-09-09
### Changed
- **Exercise info "Recent" tab renamed to "History" and no longer capped at 6 sessions** — it now lists every logged session for that exercise, scrollable within the panel, instead of just the last few

---

## v0.6.1 — 2026-09-09
### Added
- **Progress chart assisted/unassisted toggle** — for an exercise logged in both modes, Progress now shows an Unassisted/Assisted switch instead of silently plotting both weight scales as one misleading line; defaults to whichever mode you last used
- **Plate calculator per person** — when tracking more than one person, the calculator now has a tab per person so each gets their own target-weight prefill and per-side breakdown, instead of always using the first person's numbers
- **Auto-detect newer GitHub data on launch** — if you log from more than one device, opening the app now checks whether GitHub has data this device hasn't seen yet and offers to pull it in, instead of silently sitting behind

### Fixed
- **Background no longer scrolls behind an open modal** — exercise info, plate calculator, and other popups used to let the page underneath keep scrolling with them; the background is now frozen while a modal is open and unfrozen when it closes
- **Editing a past session while "Log today's session" was collapsed did nothing visible** — the values were populated into the form correctly, but the section stayed visually collapsed (zero height) so it looked like the edit button didn't work; editing now force-expands the section (and the specific exercise, if it was individually collapsed) so the values are actually on screen
- **Timer footer could overlap/clip the last bit of content** — the space reserved above the fixed timer footer was a guessed fixed value; it's now measured from the footer's actual rendered height (which varies by device font scaling and safe-area insets) and kept in sync live
- Removed the "Workout" tab from the exercise info panel — it only repeated info already visible elsewhere on the log form

---

## v0.6.0 — 2026-09-09
### Added
- **Session drafts persist automatically** — every weight/reps keystroke is saved as you type, so minimising a workout (tapping its name), switching tabs, or the app closing/crashing mid-session no longer wipes what you'd entered
- **Resume prompt on relaunch** — if there's an unfinished session sitting in a draft, the app now asks on open whether to continue where you left off (green) or clear it (red, with a confirmation warning before it discards anything)
- **"Assisted" checkbox per exercise** — for assisted pull-ups/dips etc. that use a machine with a completely different weight scale to the unassisted version; toggling it switches which history the preset weight and PR/regression colouring are pulled from
- **Copy-to-all-sets button** — a button at the end of each set row copies set 1's weight and reps into every other set for that exercise/person in one tap
- **Overload hint** — logging 15+ reps on a set now shows an inline suggestion to add weight and aim for ~5–8 reps next time, instead of just adding more reps indefinitely
- **Default rep target** (Settings, 8 by default) — pre-fills the reps field the first time you log a brand-new exercise with no history yet
- **Edit past sessions** — a pencil icon next to each history entry's delete button reopens that session's numbers in the log form for correction, then overwrites it on save
- **Workout & Recent tabs** in the exercise info panel (alongside Muscles/Exercise) — Workout shows which day it's assigned to and its current set-count/assisted setting; Recent lists the last several logged sessions for that exercise
- **Plate calculator** — a button next to each exercise's info button works out which plates to load per side for a target weight and bar weight
- **Consistency heatmap** on the Progress tab — a monthly calendar highlighting days with a logged session, regardless of split
- Reps field now opens the numeric keypad on mobile (was the default text keyboard)

### Fixed
- Unfilled sets on an exercise you engaged with this session now save as 0 instead of being left blank, so stats/history don't show gaps for sets you just forgot to fill in
- The setup wizard now saves your choices (even untouched defaults) the moment you finish it, rather than only when you touch a specific field — previously, accepting every default meant the app still considered you a "new user" on your next visit and showed the wizard again instead of the resume prompt

---

## v0.5.1.13 — 2026-09-09
### Added
- **Proper Web App Manifest** (`manifest.json`, `display: standalone`) and a `theme-color` meta tag that follows the active in-app theme — the app previously relied only on the older Apple-specific meta tags with nothing backing them up

### Fixed
- **Further work on the iOS Home Screen dark-bar issue**: research turned up a confirmed Apple Developer Forums bug where Safari can return `0` for `env(safe-area-inset-bottom)` while its toolbar is in a "hidden" state (exactly what standalone mode mimics), which would make our own padding math under-shoot. `html`/`body` now use `100dvh` (dynamic viewport height, the modern fix for this whole problem class, with `100%` kept as a fallback), and the timer footer's bottom padding has a `max(24px, ...)` floor so it can't collapse to near-nothing if the inset misreports as zero

---

## v0.5.1.12 — 2026-09-09
### Fixed
- **Dark bar below the timer footer on iOS "Add to Home Screen" mode** — this turned out to be a known iOS Safari standalone-mode bug where `position:fixed` elements can desync from the true visual bottom after the on-screen keyboard opens/closes (which happens constantly while typing weights). Now uses the VisualViewport API to actively re-align the timer footer to the real visual bottom instead of papering over it with a strip (the v0.5.1.11 native Android fix was correct but irrelevant — that screenshot was from iOS, not the Android APK)

---

## v0.5.1.11 — 2026-09-09
### Fixed
- **Removed the timer footer's "insurance strip"** — a stopgap added in v0.5.1.9 to patch an iOS gap issue, which itself showed up as an unwanted dark bar on other devices
- **Fixed a pre-existing dark bar below the timer footer on Android** — the project had no `colors.xml`, so Android's system navigation bar fell back to an unstyled default colour instead of matching the app; added `colors.xml` and set `navigationBarColor`/`statusBarColor` in `styles.xml` to the app's dark navy theme colour (note: this is a static native colour and won't follow in-app theme switching — Chalk & Iron, Burnt Red, etc. — since that would need a native bridge)

---

## v0.5.1.10 — 2026-09-09
### Added
- **Preset colour swatches everywhere** — Settings → People now uses the same boxed colour swatches as the setup wizard instead of the native picker
- **Duplicate-colour prevention** — a colour already used by another person is now greyed out and unclickable, in both Settings and the wizard, so chart legends and history rows never show two people in the same colour

### Fixed
- **Timer footer layout bug** — the mode label ("TIMER"/"STOPWATCH") wasn't stacking above the digits in Count down mode (it sat beside them instead), caused by the tap-to-edit dashed-underline style switching the display to `inline-block`; now stacks correctly in both modes
- **"kg"/"reps" input centering** — removed the browser's reserved number-spinner space that was skewing the centred placeholder text
- Wizard intro: "Set up my profile" now sits above Restore from GitHub / Import from Excel, styled rounded and blue like the other buttons (was unstyled/boxy)
- Wizard "Add a partner" renamed to "Add another user"; the person's name no longer crops off — it now sits on its own line above the colour swatches
- Wizard Workouts step (6): each day is now collapsible and starts collapsed, with an exercise count
- Wizard Timer step (8) now only asks Show timer / No timer — mode and duration are set from the footer itself, not during setup

---

## v0.5.1.9 — 2026-09-09
### Fixed
- **Dark gap below the timer footer on iOS "Add to Home Screen" mode** — added a background-matched insurance strip beneath the timer footer to cover the intermittent gap iOS standalone mode can leave when its safe-area-inset calculation doesn't quite reach the true bottom edge

---

## v0.5.1.8 — 2026-09-09
### Added
- **Scroll-wheel duration picker** — tapping the countdown time now opens two scrollable minute/second wheels (like iOS) instead of a keyboard-based input, so the on-screen keyboard never covers what you're editing; tap ✓ to confirm

### Changed
- **Timer controls redesigned**: Start now turns into a red "Reset" button once running or paused; Pause/Resume freezes the display in place without clearing it; only pressing the red Reset button clears the timer back to zero and reverts the button to "Start" (removed the separate Stop button)
- Toned down the timer footer's top border from a bright 2px accent line to a subtle 1px line, consistent with dividers used elsewhere in the app

---

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
