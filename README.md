# Bookkeeply

Simple bookkeeping for small businesses. The React app lives in `SBB/`.

## If `git pull` says “not a git repository”

You are in your home folder, not the project. The prompt looks like `mike@Michael:~$` — the `~` means home.

Run this **entire block** from that same terminal:

```bash
cd ~
if [ ! -d SBB-BOOKKEEPING-RECORDS-FE ]; then
  git clone https://github.com/michealeeee/SBB-BOOKKEEPING-RECORDS-FE.git
fi
cd SBB-BOOKKEEPING-RECORDS-FE
git checkout main
git pull origin main
npm install
npm run dev
```

Leave that terminal open. When it prints `Local: http://localhost:5173/`, open **that** URL in the browser.

## What will not show the app

- GitHub.com file pages
- Double-clicking `index.html`
- VS Code / Live Server on `index.html`
- `npm run dev` while you are still in `~`

Sign in with any valid email and a password of 6+ characters, for example `demo@business.com` / `demo1234`.
