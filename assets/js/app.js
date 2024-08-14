const coinsCount = document.getElementById("coins-count");
const exchangesCount = document.getElementById("exchanges-count");
const marketCap = document.getElementById("market-cap");
const marketCapChangeElement = document.getElementById("market-cap-change");
const volume = document.getElementById("volume");
const dominance = document.getElementById("dominance");

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.id = savedTheme;
    updateIcon(savedTheme);
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = body.id;
    const newTheme =
      currentTheme === "light-theme" ? "dark-theme" : "light-theme";
    body.id = newTheme;
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
  });

  /**
   * Updates the icon based on the current theme.
   *
   * @param {string} currentTheme - The current theme ("light-theme" or any other theme).
   * @returns {void}
   */
  function updateIcon(currentTheme) {
    if (currentTheme === "light-theme") {
      themeToggle.classList.replace("ri-moon-line", "ri-sun-line");
    } else {
      themeToggle.classList.replace("ri-sun-line", "ri-moon-line");
    }
    if (typeof initializeWidget === "function") {
      initializeWidget();
    }
  }

  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("search-input");
    const searchQuery = searchInput.value.trim();
    if (!searchQuery) return;

    window.location.href = `../../pages/search.html?query=${searchQuery}`;
  });

  const openMenuBtn = document.getElementById("open-menu");
  const overlay = document.getElementById("overlay");
  const closeMenuBtn = document.getElementById("close-menu");

  openMenuBtn.addEventListener("click", () => {
    overlay.classList.add("show");
  });

  closeMenuBtn.addEventListener("click", () => {
    overlay.classList.remove("show");
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.classList.remove("show");
    }
  });

  fetchGlobal();
});

/**
 * Retrieves data from the local storage based on the provided key.
 * @param {string} key - The key used to retrieve the data from the local storage.
 * @returns {any} - The parsed data associated with the provided key, or null if the data is not found or expired.
 */
function getLocalStorageData(key) {
  const storedData = localStorage.getItem(key);
  if (!storedData) return null;

  const parsedData = JSON.parse(storedData);
  const currentTime = new Date();
  if (currentTime - parsedData.timestamp > 300000) {
    localStorage.removeItem(key);
    return null;
  }
  return parsedData.data;
}

/**
 * Sets the data in the local storage with a specified key.
 *
 * @param {string} key - The key to store the data under.
 * @param {any} data - The data to be stored in the local storage.
 * @returns {void}
 */
function setLocalStorageData(key, data) {
  const storedData = {
    timestamp: new Date(),
    data: data,
  };
  localStorage.setItem(key, JSON.stringify(storedData));
}

function fetchGlobal() {
  const localStorageKey = "Global_Data";
  const localData = getLocalStorageData(localStorageKey);

  if (localData) {
    displayGlobalData(localData);
  } else {
    const options = { method: "GET", headers: { accept: "application/json" } };

    fetch("https://api.coingecko.com/api/v3/global", options)
      .then((response) => response.json())
      .then((data) => {
        const globalData = data.data;
        displayGlobalData(globalData);
        setLocalStorageData(localStorageKey, globalData);
      })
      .catch((error) => {
        coinsCount.textContent = "N/A";
        exchangesCount.textContent = "N/A";
        marketCap.textContent = "N/A";
        marketCapChangeElement.textContent = "N/A";
        volume.textContent = "N/A";
        dominance.textContent = "BTC N/A% - ETH N/A%";
      });
  }
}

/**
 * Displays global data for cryptocurrencies.
 *
 * @param {Object} globalData - The global data object.
 */
function displayGlobalData(globalData) {
  coinsCount.textContent = globalData.active_cryptocurrencies || "N/A";
  exchangesCount.textContent = globalData.markets || "N/A";

  marketCap.textContent = globalData.total_market_cap.usd
    ? `$${(globalData.total_market_cap.usd / 1e12).toFixed(3)}T`
    : "N/A";
  const marketCapChange = globalData.market_cap_change_percentage_24h_usd;

  if (marketCapChange !== undefined) {
    const changeText = marketCapChange.toFixed(1) + "%";
    marketCapChangeElement.innerHTML = `${changeText} <i class="${
      marketCapChange < 0 ? "red" : "green"
    } ri-arrow-${marketCapChange < 0 ? "down" : "up"}-s-fill"></i>`;
    marketCapChangeElement.style.color = marketCapChange < 0 ? "red" : "green";
  } else {
    marketCapChangeElement.textContent = "N/A";
  }

  volume.textContent = globalData.total_volume.usd
    ? `$${(globalData.total_volume.usd / 1e9).toFixed(3)}B`
    : "N/A";

  const btcDominance = globalData.market_cap_percentage?.btc
    ? `${globalData.market_cap_percentage?.btc.toFixed(1)}%`
    : "N/A";
  const ethDominance = globalData.market_cap_percentage?.eth
    ? `${globalData.market_cap_percentage?.eth.toFixed(1)}%`
    : "N/A";
  dominance.textContent = `BTC ${btcDominance} - ETH ${ethDominance}`;
}

/**
 * Toggles the visibility of a spinner and a list element.
 *
 * @param {string} listId - The ID of the list element.
 * @param {string} spinnerId - The ID of the spinner element.
 * @param {boolean} showSpinner - Determines whether to show or hide the spinner.
 */
function toggleSpinner(listId, spinnerId, showSpinner) {
  const element = document.getElementById(listId);
  const spinner = document.getElementById(spinnerId);

  if (spinner) {
    spinner.style.display = showSpinner ? "block" : "none";
  }
  if (element) {
    element.style.display = showSpinner ? "none" : "block";
  }
}

/**
 * Creates a table element with a header row containing the specified header names.
 *
 * @param {string[]} headerNames - An array of strings representing the header names.
 * @param {number} [fixedIndex=0] - The index of the column to be fixed.
 * @returns {HTMLTableElement} The created table element.
 */
function createTable(headerNames, fixedIndex = 0) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  table.appendChild(thead);

  const headerRow = document.createElement("tr");
  headerNames.forEach((headerName, index) => {
    const th = document.createElement("th");
    th.textContent = headerName;
    if (index === fixedIndex) {
      th.classList.add("table-fixed-column");
    }
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  return table;
}

/**
 * Creates a widget and appends it to the specified container element.
 *
 * @param {string} containerId - The ID of the container element where the widget will be appended.
 * @param {Object} widgetConfig - The configuration object for the widget.
 * @param {string} widgetSrc - The source URL of the widget script.
 * @returns {void}
 */
function createWidget(containerId, widgetConfig, widgetSrc) {
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  const widgetDiv = document.createElement("div");
  widgetDiv.classList.add("tradingview-widget-container__widget");
  container.appendChild(widgetDiv);

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = widgetSrc;
  script.async = true;
  script.innerHTML = JSON.stringify(widgetConfig);
  container.appendChild(script);

  setTimeout(() => {
    const copyright = document.querySelector(".tradingview-widget-copyright");
    if (copyright) {
      copyright.classList.remove("hidden");
    }
  }, 5000);
}

/**
 * Retrieves the theme configuration.
 *
 * @returns {Object} The theme configuration object.
 * @property {string} theme - The current theme.
 * @property {boolean} isDarkTheme - Indicates if the current theme is dark.
 * @property {string} backgroundColor - The background color based on the theme.
 * @property {string} gridColor - The grid color based on the theme.
 */
function getThemeConfig() {
  const root = getComputedStyle(document.documentElement);
  const theme = localStorage.getItem("theme");
  const isDarkTheme = theme === "dark-theme";

  const backgroundColor = root
    .getPropertyValue(isDarkTheme ? "--chart-dark-bg" : "--chart-light-bg")
    .trim();

  const gridColor = root
    .getPropertyPriority(
      isDarkTheme ? "--chart-dark-border" : "--chart-light-border"
    )
    .trim();

  return { theme, isDarkTheme, backgroundColor, gridColor };
}

const scrollToTopButton = document.getElementById("scroll-to-top");
window.onscroll = () => {
  scrollFunction();
};

/**
 * Function to handle scrolling behavior.
 * It checks the scroll position and displays or hides the scroll-to-top
 * button accordingly.
 */
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopButton.style.display = "flex";
  } else {
    scrollToTopButton.style.display = "none";
  }
}

/**
 * Scrolls the page to the top.
 */
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
