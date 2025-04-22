import { bangs } from "./bang";
import "./global.css";

const LS_DEFAULT_BANG = localStorage.getItem("default-bang") ?? "g";
const defaultBang = bangs.find((b) => b.t === LS_DEFAULT_BANG);

/**
 * Render the default page when no search query is present
 */
function defaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("q")?.trim() ?? "";
  if (pathname !== "/") {
    console.log("Not on the default page, displaying error");

    app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <img src="logo.webp" alt="Nudlsupp logo" class="logo" />
        <h1>Hmm...</h1>
        <p>This query doesnt seem right. </p>
        <div class="url-container"> 
            <a href="${
              "/?q=" + pathname.replace("/", "")
            }" class="primary-button">Try Method 2</a>
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
    window.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.location.replace("/?q=" + pathname.replace("/", ""));
      }
    });
    window.addEventListener("click", (e) => {
      window.location.replace("/?q=" + pathname.replace("/", ""));
    });
    return;
  } else if (query) {
    const match = query.match(/!(\S+)/i);
    const bangCandidate = match?.[1]?.toLowerCase();

    const cleanQuery = query.replace(/!\S+\s*/i, "").trim();
    app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <img src="logo.webp" alt="Nudlsupp logo" class="logo" />
        <h1>!${bangCandidate}</h1>
        <p>Does not exist. Use other bangs or default bang!</p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="${defaultBang?.u.replace(
              "{{{s}}}",
              // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
              encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
            )}"
            readonly 
          />
          <button class="copy-button">
            <img src="/search.svg" alt="Copy" />
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
    const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

    copyButton.addEventListener("click", async () => {
      window.location.replace(urlInput.value);
    });

    window.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        window.location.replace(urlInput.value);
      }
    });
    window.addEventListener("click", (e) => {
      window.location.replace(urlInput.value);
    });

    return;
  } else {
    app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <img src="logo.webp" alt="Nudlsupp logo" class="logo" />
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
  }

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

  // Check if the query is a valid URL
  try {
    const domainPattern = new RegExp(
      "^([a-zA-Z]+:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", // fragment locator
      "i"
    );

    if (domainPattern.test(query)) {
      return query.startsWith("https://") ? query : `https://${query}`; // If it's a valid URL, return it directly
    }
  } catch {
    // Not a valid URL, continue with bang logic
  }

  const match = query.match(/!(\S+)/i);

  const bangCandidate = match?.[1]?.toLowerCase();
  const selectedBang = bangs.find((b) => b.t === bangCandidate);

  // Remove the first bang from the query
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}

  if (!selectedBang) {
    defaultPageRender();
    return null;
  }

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
