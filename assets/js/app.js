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

  function updateIcon(currentTheme) {
    if (currentTheme === "light-theme") {
      themeToggle.classList.replace("ri-moon-line", "ri-sun-line");
    } else {
      themeToggle.classList.replace("ri-sun-line", "ri-moon-line");
    }
  }

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
