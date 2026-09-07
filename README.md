# GymTracker

A lightweight, single-page gym logging app — no account required, no server, runs entirely in your browser.

**Live app:** https://wemyssj.github.io/GymTracker-Project/

---

## What it does

- Log weights and notes for each exercise across Push, Pull, and Leg days
- Tracks personal bests automatically
- View session history and progress over time
- Supports multiple users on the same device (e.g. gym partners)
- Exercise info cards with muscle diagrams and form tips

---

## Setting up a user

1. Open the app and tap **Settings** (bottom nav)
2. Under **People**, tap **+ Add person**, enter a name and pick a colour
3. To remove the default user, tap the delete icon next to their name
4. Each user's data is stored separately in your browser

---

## Customising exercises

1. Go to **Settings → Exercises**
2. Use the dropdowns to select exercises for each day (Push / Pull / Leg)
3. Choose **Custom…** at the bottom of any dropdown to type your own exercise name
4. Tap **+ Add exercise** to add a slot, or 🗑 to remove one

---

## Backing up & restoring data (GitHub Sync)

Your data lives in your browser's local storage. To back it up or share it across devices, use the built-in GitHub sync.

### First-time setup

1. Create a free [GitHub](https://github.com) account if you don't have one
2. Create a new **public or private repository** (e.g. `gym-log`)
3. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
4. Generate a token with the **`repo`** scope — copy it immediately
5. In the app, go to **Settings → GitHub Sync** and fill in:
   - **Token** — your personal access token
   - **Repo** — `yourusername/gym-log`
   - **File path** — `GymLog.json` (or any filename you like)
   - **Branch** — `main`

### Pushing data (backup)

Tap **Push to GitHub** in Settings. Your full workout history is saved as a JSON file in your repo.

### Pulling data (restore)

Tap **Pull from GitHub** to load your data back — useful when switching devices or browsers. Existing local data is merged, not overwritten.

---

## Data export / import (local file)

If you prefer not to use GitHub:

- **Export** — go to Settings and tap **Export JSON**. A `.json` file downloads to your device.
- **Import** — tap **Import JSON** and select a previously exported file to restore your data.

---

## Privacy

The app stores only the following in your browser's local storage:

- Your people's **names and colours**
- Your **workout log** (weights, notes, dates)
- Your chosen **exercises** and **theme** preferences
- Your **GitHub sync settings** (token, repo, branch) — stored locally on your device only, never sent anywhere except GitHub's own API

No analytics, no tracking, no third-party data collection. The only external resource loaded is the [SheetJS](https://sheetjs.com/) library from cdnjs.cloudflare.com, used for Excel export.

Clearing your browser's site data for this page will erase everything — back up via GitHub sync or JSON export regularly.
