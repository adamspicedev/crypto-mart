const coinsList = document.getElementById("coins-list");
const exchangesList = document.getElementById("exchanges-list");
const nftsList = document.getElementById("nfts-list");

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("query");
  if (searchQuery) {
    fetchSearchResults(searchQuery, [coinsList, exchangesList, nftsList]);
  } else {
    const searchHeading = document.getElementById("search-heading");
    const searchContainer = document.querySelector(".search-container");
    searchContainer.innerHTML = `<p style="color: red; text-align: center; margin-bottom: 8px;">No results found for that search query...</p>`;
    searchHeading.innerText = "Please search for a valid query";
  }
});

/**
 * Fetches search results based on the provided parameter and updates the UI accordingly.
 *
 * @param {string} param - The search parameter.
 * @param {Array<string>} idsToToggle - The array of element IDs to toggle.
 * @returns {void}
 */
function fetchSearchResults(param, idsToToggle) {
  const searchHeading = document.getElementById("search-heading");

  for (const id of idsToToggle) {
    const errorElement = document.getElementById(`${id}-error`);

    if (errorElement) {
      errorElement.style.display = "none";
    }

    toggleSpinner(id, `${id}-spinner`, true);
  }

  coinsList.innerHTML = "";
  exchangesList.innerHTML = "";
  nftsList.innerHTML = "";

  searchHeading.innerText = `Search results for "${param}"`;

  const url = `https://api.coingecko.com/api/v3/search?query=${param}`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      for (const id of idsToToggle) {
        toggleSpinner(id, `${id}-spinner`, false);
      }
      return response.json();
    })
    .then((data) => {
      let coins = (data.coins || []).filter(
        (coin) => coin.thumb !== "missing_thumb.png"
      );
      let exchanges = (data.exchanges || []).filter(
        (exchange) => exchange.thumb !== "missing_thumb.png"
      );
      let nfts = (data.nfts || []).filter(
        (nft) => nft.thumb !== "missing_thumb.png"
      );

      const coinsCount = coins.length;
      const exchangesCount = exchanges.length;
      const nftsCount = nfts.length;

      let minCount = Math.min(coinsCount, exchangesCount, nftsCount);

      if (coinsCount > 0 && exchangesCount > 0 && nftsCount > 0) {
        coins = coins.slice(0, minCount);
        exchanges = exchanges.slice(0, minCount);
        nfts = nfts.slice(0, minCount);
      }

      coinsResult(coins);
      exchangesResult(exchanges);
      nftsResult(nfts);

      if (coins.length === 0) {
        coinsList.innerHTML = `<p style="color: red; text-align: center; ">No coins found for that search query...</p>`;
      }
      if (exchanges.length === 0) {
        exchangesList.innerHTML = `<p style="color: red; text-align: center; ">No exchanges found for that search query...</p>`;
      }
      if (nfts.length === 0) {
        nfts.innerHTML = `<p style="color: red; text-align: center; ">No nfts found for that search query...</p>`;
      }
    })
    .catch((error) => {
      for (const id of idsToToggle) {
        toggleSpinner(id, `${id}-spinner`, false);
        document.getElementById(`${id}-error`).style.display = "block";
      }
      console.log("Error fetching Data:", error);
    });
}

function coinsResult(coins) {
  coinsList.innerHTML = "";
  const table = createTable(["Rank", "Coin"]);

  for (const coin of coins) {
    const row = table.insertRow();
    row.innerHTML = `
        <td>1</td>
        <td><img src="${coin.thumb}" alt="${coin.name}" />${coin.name} <span>(${coin.symbol})</span></td>
    `;

    table.appendChild(row);
  }
  coinsList.appendChild(table);
}

/**
 * Function to display a list of exchanges.
 *
 * @param {Array} exchanges - An array of exchange objects.
 * @returns {void}
 */
function exchangesResult(exchanges) {
  exchangesList.innerHTML = "";
  const table = createTable(["Exchange", "Market"]);

  for (const exchange of exchanges) {
    const row = table.insertRow();
    row.innerHTML = `
        <td><img src="${exchange.thumb}" alt="${exchange.name}" />${exchange.name}</td>
        <td>${exchange.market_type}</td>
    `;
    table.appendChild(row);
  }
  exchangesList.appendChild(table);
}

function nftsResult(nfts) {
  nftsList.innerHTML = "";
  const table = createTable(["NFT", "Symbol"]);

  for (const nft of nfts) {
    const row = table.insertRow();
    row.innerHTML = `
        <td><img src="${nft.thumb}" alt="${nft.name}" />${nft.name}</td>
        <td>${nft.symbol}</td>
    `;
    table.appendChild(row);
  }
  nftsList.appendChild(table);
}
