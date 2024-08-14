function initializeWidget() {
  const theme = getThemeConfig();
  const widgetConfig = {
    autosize: true,
    symbol: "BINANCE:BTCUSD",
    interval: "4H",
    timezone: "Etc/UTC",
    theme: theme.isDarkTheme ? "dark" : "light",
    style: "1",
    locale: "en",
    container_id: "chart-widget",
    backgroundColor: theme.backgroundColor,
    gridColor: theme.gridColor,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    save_image: true,
    details: true,
    calendar: false,
    support_host: "https://www.tradingview.com",
  };

  createWidget(
    "chart-widget",
    widgetConfig,
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
  );
}

initializeWidget();
