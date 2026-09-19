# Bookkeeply

Simple bookkeeping for small businesses. The React app lives in `SBB/`.

## Show the latest page (use this if the UI “did not change”)

An old `npm run dev` keeps showing the old cards. Stop it, then replace your local files with GitHub `main`:

```bash
cd ~/SBB-BOOKKEEPING-RECORDS-FE
git checkout main
git fetch origin
git reset --hard origin/main
```

Press **Ctrl+C** in every terminal that is running the app. Then:

```bash
npm install
npm run dev
```

Open **http://localhost:5173/** (not GitHub, not `index.html`). Hard-refresh with **Ctrl+Shift+R**.

You should see **Start demo**, a USD September ledger, **Built like a set of books, not a dashboard toy**, and **Monthly plans** for Starter, Business, and Professional.

## If `git pull` says “not a git repository”

You are in your home folder (`~`), not the project. Clone or `cd` into `SBB-BOOKKEEPING-RECORDS-FE` first, then run the block above.

## What will not show the app

- GitHub.com file pages
- Double-clicking `index.html`
- VS Code / Live Server on `index.html`
- `npm run dev` while you are still in `~`
- A Vite server that was started before you pulled

Sign in with any valid email and a password of 6+ characters, for example `demo@business.com` / `demo1234`.
