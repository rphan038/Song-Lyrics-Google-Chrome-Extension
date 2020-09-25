chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'www.youtube.com', schemes: ['https']},
        }),
        new chrome.declarativeContent.PageStateMatcher({
        	pageUrl: {hostEquals: 'music.youtube.com', schemes: ['https']},
        }),
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
