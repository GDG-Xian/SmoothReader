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

function toggleReader(enabled) {
  $('body').toggleClass('crx-sr-reading', enabled);
  if (!enabled) {
    $('.crx-sr-reader').remove();
  }
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
    toggleReader(false);
  }
}

function showSelected(event) {
  let content = $(event.target).html();  
  toggleInspect(false);
  showReader(sanitizeHtml(content));
}

function initReader() {
  let $reader = $('.crx-sr-reader');
  
  if ($reader.length == 0) {
    $reader = $('<div class="crx-sr-reader"><div class="crx-sr-reader-viewport yue"></div></div>');
    $reader.appendTo('body');
  }

  return $reader;
}

function showReader(content) {
  let $reader = initReader();

  $reader.find('.crx-sr-reader-viewport').html(content);
  toggleReader(true);
}

function hideReader(event) {
  if ($(event.target).is('.crx-sr-reader')) {
    toggleReader(false);
  }
}

chrome.runtime.onMessage.addListener(messageHandler);

$(document).on('mouseover', INSPECT_SEL, highlightContent);
$(document).on('mouseout', INSPECT_SEL, unHighlightContent);
$(document).on('keyup', shortcutHandler);
$(document).on('click', '.crx-sr-inspecting', showSelected);
$(document).on('click', '.crx-sr-reader', hideReader);

