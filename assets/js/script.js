const tabDataLoaded = {
  tab1: false,
  tab2: false,
  tab3: false,
  tab4: false,
};

function openTab(event, tabName) {
  const tabContent = document.querySelectorAll(".tab-content");
  const tabButtons = document.querySelectorAll(".tab-button");

  tabContent.forEach((content) => (content.style.display = "none"));
  tabButtons.forEach((button) => button.classList.remove("active"));

  document.getElementById(tabName).style.display = "block";
  event.currentTarget.classList.add("active");

  if (!tabDataLoaded[tabName]) {
    switch (tabName) {
    }
  }
}
