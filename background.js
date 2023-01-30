function logURL(requestDetails) {
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get([myTabId]).then((result) => {
                if (!result || (Object.keys(result).length === 0 || Object.keys(result[myTabId]).length === 0)) {
                    result[myTabId] = getDefaultStorageValue();
                }
                result[myTabId].requests.urls.push(`${requestDetails.url}`);
                chrome.storage.local.set({ [myTabId]: result[myTabId] });
            });
        }
    });
}

function getDefaultStorageValue() {
    return {
        requests: {
            urls: [],
            active: false
        }
    };
}

chrome.webRequest.onBeforeSendHeaders.addListener(
    logURL,
    {urls: ["<all_urls>"]}
);
