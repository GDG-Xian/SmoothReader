const INSPECT_SEL = [
  '.crx-sr-inspecting p',
  '.crx-sr-inspecting div',
  '.crx-sr-inspecting section',
  '.crx-sr-inspecting article',
].join(', ');

function isInspecting() {
  return $('body').is('.crx-sr-inspecting');
}

function toggleInspect(enabled) {
  $('body').toggleClass('crx-sr-inspecting', enabled);
  $('.crx-sr-highlight').removeClass('crx-sr-highlight');
  chrome.runtime.sendMessage({ type: 'inspectModeChange', actived: enabled });
}

function highlightContent(event) {
  event.stopPropagation();

  $(this).toggleClass('crx-sr-highlight', true);
}

function unHighlightContent() {
  $(this).toggleClass('crx-sr-highlight', false);
}

function messageHandler(request, sender, sendResponse) {
  if (request.type == 'toggleInspect') {
    toggleInspect(!isInspecting());
  }
}

function shortcutHandler(event) {
  if (event.keyCode === 27) {
    toggleInspect(false);
  }
}

chrome.runtime.onMessage.addListener(messageHandler);

$(document).on('mouseover', INSPECT_SEL, highlightContent);
$(document).on('mouseout', INSPECT_SEL, unHighlightContent);
$(document).on('keyup', shortcutHandler);
