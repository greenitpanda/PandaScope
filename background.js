function logURL(requestDetails) {
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get([myTabId]).then((result) => {
                if (Object.keys(result).length === 0 || Object.keys(result[myTabId]).length === 0) {
                    result[myTabId] = {
                        requests: []
                    };
                }
                result[myTabId].requests.push(`${requestDetails.url}`);
                chrome.storage.local.set({ [myTabId]: result[myTabId] });
            });
        }
    });
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    logURL,
    {urls: ["<all_urls>"]}
);
