let tabsTime = {}; // Store the time spent on each tab
let activeTab = null;
let startTime = Date.now();

function updateTabTime(tabId) {
  if (activeTab !== null) {
    const currentTime = Date.now();
    const timeSpent = currentTime - startTime;
    if (!tabsTime[activeTab]) {
      tabsTime[activeTab] = 0;
    }
    tabsTime[activeTab] += timeSpent;
    startTime = currentTime;
  }
  activeTab = tabId;
}

chrome.tabs.onActivated.addListener(activeInfo => {
  updateTabTime(activeInfo.tabId);
  chrome.tabs.get(activeInfo.tabId, tab => {
    console.log(`Active tab changed to: ${tab.url}`);
    // Here, you can map tabId to URLs if needed and do something with this data, like saving it.
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    updateTabTime(tabId);
  }
});

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateTabTime(null); // No active window
  } else {
    chrome.tabs.query({active: true, windowId: windowId}, tabs => {
      if (tabs[0]) {
        updateTabTime(tabs[0].id);
      }
    });
  }
});
