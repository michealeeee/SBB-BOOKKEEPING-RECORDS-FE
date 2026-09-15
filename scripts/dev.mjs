#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sbbPkg = join(root, "SBB", "package.json");

if (!existsSync(sbbPkg)) {
  console.error("Bookkeeply was not started from the repo folder.");
  console.error("Your prompt should not be ~ only. Run:");
  console.error("");
  console.error("  git clone https://github.com/michealeeee/SBB-BOOKKEEPING-RECORDS-FE.git");
  console.error("  cd SBB-BOOKKEEPING-RECORDS-FE");
  console.error("  npm install");
  console.error("  npm run dev");
  process.exit(1);
}

const child = spawn("npm", ["run", "dev", "--prefix", "SBB"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 1));
