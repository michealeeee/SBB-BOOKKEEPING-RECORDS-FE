import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

function showBootError(message) {
  const root = document.getElementById("root");
  if (!root) return;
  if (root.querySelector(".landing, .auth-shell, .app-shell")) return;
  root.innerHTML = `
    <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:640px;margin:48px auto;padding:0 20px;color:#1b241c">
      <h1 style="margin:0 0 8px">Bookkeeply could not start</h1>
      <p>The books UI did not load. Start the Vite server from this project, then open the local URL it prints.</p>
      <pre style="background:#efece4;padding:12px;border-radius:8px;white-space:pre-wrap">${String(message || "")}</pre>
      <pre style="background:#efece4;padding:12px;border-radius:8px">npm install
npm run dev</pre>
      <p>Then open <a href="http://localhost:5173">http://localhost:5173</a> and hard-refresh the tab.</p>
    </div>
  `;
}

window.addEventListener("error", (event) => {
  showBootError(event.error?.message || event.message);
});
window.addEventListener("unhandledrejection", (event) => {
  showBootError(event.reason?.message || event.reason);
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("Bookkeeply is missing #root");
}

try {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} catch (error) {
  showBootError(error?.message || error);
}
