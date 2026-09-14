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

- Weight inputs: `updateWeightInputColor()` compares typed value to `computeStatsFor(...).best`. Above best → class `pr-val` (green, unchanged). At/below best → inline `color: trackGradientColor(val, best, getPersonColor(personId))`.
- Rep inputs: `updateRepsInputColor()` — same idea against `getPersonRepsTarget(personId)`.
- `trackGradientColor(value, target, baseColor)` (near `applyTheme`) — **exactly on target returns `baseColor` untouched** (no interpolation at all, so it's pixel-identical every time, not just "close"); `updateWeightInputColor`/`updateRepsInputColor` pass `getPersonColor(personId)` as `baseColor`, so "on target" reads as *that person's own colour* (their name-label colour), not a shared theme colour — this was a deliberate revision after an earlier version used the theme accent for everyone and the user found that confusing ("why is Joe's blue different from Sam's blue"). Below target grades pale→dark red as the shortfall grows; above target (only reachable via the `pr-val` class path currently, `trackGradientColor` isn't called for that branch) stays flat green. Red/green use **fixed hues** (`TRACK_RED_HUE`/`TRACK_GREEN_HUE`, matching `--red`/`--green`) via HSL, not hue-rotated from the base colour — rotating hue from an arbitrary base (e.g. cyan) toward red swept through muddy purple/magenta at partial values, which read as a random unrelated colour rather than "off track". `getPersonColor(personId)` looks up `people`, falling back to `currentAccentHex` if not found. `reg-val` (flat red class) still exists for `renderHistory()`'s past-session PR/regression flags (simpler session-over-session comparison, unrelated to this gradient) — don't remove it.
- `colorizeFormInputs()` (called at the end of `renderForm()`) runs the two colour functions over **every** rendered set input, including untouched/prefilled ones — so a carried-forward suggestion shows its target-relative colour immediately instead of sitting in flat grey (`.prefilled` CSS colour rules are now just the fallback for when no stats/target exist yet, e.g. a brand new exercise+person with no history — inline colour always wins once one is set).
- `checkOverloadHint(exIndex, personId)` is **per person** — each person gets their own `.overload-hint` div (id `overloadHint-{exIndex}-{personId}`), placed right under that person's set-row in `renderForm()`. High reps (≥15) → amber "add weight"; very low reps vs *that person's own* rep target (≤ half, floor 2) → red `.overload-hint-warn` "drop weight". (Previously this was one hint per exercise shared across everyone, so one person's high reps could mask another person's low-rep warning — don't regress back to that.)
- `exerciseTip(ex, sets, target)` reuses the same thresholds to produce a short string, stored per exercise in the session summary (see below) as a "Next session" pointer.

## Sessions can repeat on the same date

- Every session object has an `id` (string) in addition to `date`. New sessions get `nextSessionId()` (timestamp + random suffix, so lexicographic sort ≈ creation order); legacy sessions loaded without one get `id = date` (backfilled in `normalizeSessions()`, called from both `loadTab()` and `applyRemoteGithubData()`). **`date` is no longer a unique key** — saving no longer overwrites-by-date; logging a second session on a date that already has one creates a separate, independently editable/deletable entry.
- `editSession(tabKey, id)` / `deleteSession(tabKey, id)` are id-keyed now (history row buttons pass `s.id`, not `s.date`). Anywhere sessions are sorted or diffed needs an `id` tiebreaker alongside `date` for correctness on same-day ties: `renderHistory()`'s chrono/display sorts and its `prFlags`/`regFlags` key (`s.id + "|" + ex`, was `s.date + "|" + ex`).
- **Editing vs. logging fresh**: `editSession()` stores `editingId: sess.id` inside `formDrafts[tabKey]` (alongside the existing `date`/`values`). `handleSave()` reads that back — if set and the session still exists, it updates that entry in place (by `id`); otherwise (no `editingId`, or the ask **wasn't** initiated via the history row's ✎ button) it always `push()`es a new session, then re-sorts `cache[activeTab]` by `(date, id)`. `clearDraft()` (called after a successful save, and by `cancelEditSession()`) deletes the whole draft object, which naturally clears `editingId` too. `deleteSession()` also clears the draft if the session being deleted is the one currently mid-edit.
- `renderForm()` shows an `.editing-mode` highlighted card + an `.editing-banner` ("✎ Editing the {date} session" + Cancel button calling `cancelEditSession()`) whenever `formDrafts[activeTab].editingId` is set, and the save button reads "Update" instead of "Log" in that state.
- **Known gap, not yet fixed**: Excel export/import (`exportExcel`, and the `byDate` Map in the Excel-restore handler) and are still one-row-per-date-per-exercise — round-tripping through an Excel backup will still collapse multiple same-day sessions back into one (last one wins). GitHub push/pull just serialize/replace the whole `cache[tabKey]` array directly (no date-keyed transformation), so **that** path is already fully multi-session-safe.

## Session summary modal

- `handleSave()` builds `personSummaries[personId] = {volume, exercises: [{ex, sets, isPR, isReg, tip}]}` while looping exercises — inclusion in `exercises` is gated on `hasAnyData` (any set has a weight or reps value, matching what actually gets saved/shown in history), **not** `hasRealData` (only freshly-typed-this-session values). Mixing those up was an earlier bug: the exercise list only showed exercises the user had literally retyped, while the volume total (correctly) summed every exercise that had any value including carried-forward ones — the two numbers looked inconsistent/wrong together. Keep them on the same condition.
- `prevVolumes[personId]` is captured *before* mutating `cache[activeTab]`, filtered to `s.date < date && s.id !== editingId` (excludes the session being edited even on a date tie).
- `showSessionSummary(date, personSummaries, prevVolumes)` opens the `sessionSummaryOverlay` modal: per person, a `.pb-banner` (glow/scale-in + confetti emoji + exercise chips) if they hit a PR, the exercise/sets list with PR/reg badges, total volume + % delta vs last session, and a "Next session" tips block (`.session-summary-tips`) built from each exercise's `tip`. The old aggregate "N new PRs" toast text is gone; the toast is just "Saved"/"Saved locally" (still tinted pr/reg via `showToast`'s second arg).

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
