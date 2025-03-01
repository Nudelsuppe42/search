import { bangs } from "./bang";
import "./global.css";

/**
 * Render the default page when no search query is present
 */
function defaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>!see</h1>
        <p>Bang redirects of DuckDuckGo, but faster and locally!</p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="https://see.nudl.dev?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
      </div>
      <footer class="footer">
        <p class="credits">Original by theo/t3.gg</p>
        <a href="https://nudl.dev" target="_blank">nudl</a>
        •
        <a href="https://x.com/theo" target="_blank">t3</a>
      
        •
        <a href="https://github.com/Nudelsuppe42/search" target="_blank">github</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });
}

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

/**
 * Find the correct URl to redirect to based on the bang query
 * @returns The URL to redirect to, or null if no search is present
 */
function getBangRedirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    defaultPageRender();
    return null;
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate) ?? defaultBang;

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;

  return searchUrl;
}

/**
 * Initial redirect function
 */
function doRedirect() {
  const searchUrl = getBangRedirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();
