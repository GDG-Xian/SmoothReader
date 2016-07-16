function toggleInspectMode(tab) {
  talkToActiveTab({ type: 'toggleInspect' });
}

function talkToActiveTab(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, message, callback);
  });
}

function changeBrowserIcon(actived) {
  const path = actived ? 'icon_active_128.png' : 'icon_128.png';

  chrome.browserAction.setIcon({ path: path });
}

function messageHandler(request, sender, sendResponse) {
  if (request.type == 'inspectModeChange') {
    changeBrowserIcon(request.actived)
  }
}

chrome.browserAction.onClicked.addListener(toggleInspectMode);
chrome.runtime.onMessage.addListener(messageHandler);
