# GymTracker

Single-page workout tracker (Capacitor/Cordova app for Android, also runs as plain web page).

## Source of truth

- **Edit `index.html` at repo root.** It's one big file (~5500 lines): all CSS in a `<style>` block, all HTML, all JS in `<script>` at the bottom. There is no build step, no bundler, no framework — plain DOM manipulation with template-string `innerHTML` rendering.
- `www/index.html` is the Capacitor webDir copy (`capacitor.config.json` → `webDir: "www"`) — it is **stale/out of sync** with root `index.html` unless manually copied. `android/app/src/main/assets/public/index.html` is Capacitor's synced copy of `www/` (via `npx cap sync android`), plus `android/app/build/...` build output copies.
- When a change is meant to ship to the Android app: copy root `index.html` → `www/index.html`, then run `npx cap sync android` (not yet automated/scripted — do it manually or ask the user).
- `vendor/xlsx.full.min.js` — SheetJS, used for Excel backup/restore export.

## Versioning

- Commit messages end with `; v0.X.Y`. **Only bump the patch digit (Y) per commit.** Never bump the minor digit (X) without an explicit user ask.

## Data model

- `people`: array of `{id, name, color}`. `COLOR_PALETTE` (index.html:1710) auto-assigns colors via `nextColor()`.
- `cache[tabKey]`: array of sessions, each `{date, entries}`. `entries[exerciseName] = {sets: {personId: [{wt, reps}, ...]}, assisted: bool, notes: {personId: string}}`.
- `CONFIG[tabKey]` defines each workout tab (label, storage key, seed history, etc.); `activeTab` is the current tab.
- `computeStatsFor(tabKey, exercise, personId)` → `{best, last}` (best/last top single-set weight for that person on that exercise).
- `getPersonRepsTarget(personId)` — per-person target rep count used to color rep inputs.
- `topSetWeight(sets)` — heaviest weight across a sets array.

## PR / regression indicators

- Weight inputs: `updateWeightInputColor()` compares typed value to `computeStatsFor(...).best`. Above best → class `pr-val` (green). At/below best → `trackGradientColor(val/best)` sets an inline `color` (see below); no more flat `reg-val` red for this case.
- Rep inputs: `updateRepsInputColor()` — same idea against `getPersonRepsTarget(personId)`.
- `trackGradientColor(ratio)` (index.html, near `applyTheme`) — ratio `1` = on target → returns the current theme's accent colour (`currentAccentHex`, kept in sync inside `applyTheme`); as ratio drops it grades toward a dark red, interpolated in **HSL** (via `hexToHsl`/`hslToHex`), not RGB — plain RGB lerp between a cyan/green accent and red passes through muddy grey, HSL hue-rotation stays vivid (and for a green theme it naturally sweeps green→yellow→orange→red, a nice traffic-light effect). `reg-val` (flat red) class still exists and is still used by `renderHistory()`'s past-session PR/regression flags (a different, simpler comparison: this session's top set vs the immediately-previous session, not vs a target) — don't remove it.
- `checkOverloadHint(exIndex)` (search for `function checkOverloadHint`) shows `.overload-hint` (id `overloadHint-{i}`): high reps (≥15, any person) → amber "add weight" suggestion; very low reps relative to that set's own person's rep target (≤ half, floor 2) → red `.overload-hint-warn` "drop weight" suggestion. Only one hint shows at a time (high-reps check wins if both would fire).
- `handleSave` (search `async function handleSave`) builds `personSummaries[personId] = {volume, exercises: [{ex, sets, isPR, isReg}]}` while looping exercises, plus `prevVolumes[personId]` captured *before* mutating `cache[activeTab]` (so it reflects the last session strictly before the saved date). After saving it calls `showSessionSummary(date, personSummaries, prevVolumes)`, which opens the `sessionSummaryOverlay` modal — a per-person end-of-session breakdown (sets logged, PR/reg badges, total volume + % delta vs last session), with a flashy `.pb-banner` (glow/scale-in animation + confetti emoji + exercise chips) per person who hit a PR that session. The old aggregate "N new PRs" toast text is gone; the toast is now just "Saved"/"Saved locally" (still tinted pr/reg via `showToast`'s second arg).

## Testing changes locally

- It's a static page — no build step needed to preview. Serve the repo root (`python -m http.server <port>`) and open `index.html`.
- Playwright is already in `node_modules` (`chromium.launch()` works out of the box, no `npx playwright install` needed) — the fastest way to verify a UI change end-to-end. **Write the driver script inside the project directory itself** (not the scratchpad temp dir) — Node resolves `require('playwright')` relative to the script's own location via `node_modules` lookup, and the scratchpad dir has no `node_modules`, so a script placed there fails with `MODULE_NOT_FOUND`. Delete the throwaway script from the repo afterward (don't commit it).
- The onboarding wizard is the fastest way to get past `isNewUser` in a fresh/incognito profile: click "Set up my profile", fill `#wizardNameInput`, then click "Next" repeatedly (7 steps total) and "Finish". Tab switching in a script is more reliable via `page.evaluate(() => switchTab('settings'))` than clicking nav text (some tab labels also appear as plain text elsewhere on the page, e.g. inside hidden help copy).

## UI system

- Toast: `showToast(msg, type)` — `type` is `"pr"` (green border, pulse anim), `"reg"` (red border), or default. Single toast element `#toast`, 3.2s auto-hide.
- Modals: generic `openModal(id)` / `closeModal(id)` operate on `.modal-overlay` > `.modal-box` pairs (slide up/down anim). Existing overlays: `welcomeOverlay`, `confirmOverlay`, `resumeOverlay`, `settingsOverlay`, `exInfoOverlay`, `plateCalcOverlay`, `exercisePickerOverlay`. `showConfirm(message)` is a promise-based confirm dialog built on `confirmOverlay`.
- Themes: `THEMES` object (index.html:1749) has `{name, bg, accent}` per theme; `deriveTheme(bg, accent)` derives the full palette (panel/line/text/muted/accentDim/accentInk) via `mixHex`. `applyTheme()` writes CSS custom properties directly onto `document.documentElement.style` (e.g. `--amber` is actually "the accent color", not literally amber — it's theme-dependent, ranges from cyan to gold to red to green depending on selected theme). There's also a "custom" theme option with user-picked bg/accent.
- Rest timer: `timerSettings` (`{mode: "countdown"|"countup", duration}`) persisted to localStorage. Always on — there is no Settings toggle for it (removed; don't re-add one without an explicit ask) — it just shows/hides based on whether the active tab has a `CONFIG` entry. `timerMinimized` (in-memory only, not persisted) defaults to `true` so every fresh load starts as the small `#timerBubble` icon; tapping it calls `toggleTimerMinimize()` to reveal the full `#timerWidget` footer. `refreshTimerFooter()` re-renders both.

## Conventions

- No comments except where genuinely non-obvious (matches this repo's existing sparse-comment style).
- LocalStorage keys are namespaced `gymtracker:...`; most `loadX`/`saveX` pairs wrap `try{}catch(e){}` around localStorage access.
- Collapsible sections follow a repeated pattern: `loadXCollapsed`/`saveXCollapsed`/`toggleXCollapsed`/`applyXCollapsedState`, each targeting a `.collapsible-body.is-collapsed` element and a toggle icon (▸/▾).
