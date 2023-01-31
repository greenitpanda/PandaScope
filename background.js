function logRequest(requestDetails) {
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get([myTabId]).then((result) => {
                if (!result || (Object.keys(result).length === 0 || Object.keys(result[myTabId]).length === 0)) {
                    result[myTabId] = getDefaultStorageValue();
                }
                if (result[myTabId].requests.active === true) {
                    result[myTabId].requests.urls.push({
                        url: requestDetails.url,
                        requestId: requestDetails.requestId,
                        startTime: requestDetails.timeStamp,
                        method: requestDetails.method
                    });
                }

                chrome.storage.local.set({ [myTabId]: result[myTabId] });
            });
        }
    });
}



function logComplete(requestDetails) {
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get([myTabId]).then((result) => {
                if (result && (Object.keys(result).length > 0 && Object.keys(result[myTabId]).length > 0)) {
                    for(let i = 0 ; i< result[myTabId].requests.urls.length; i++){
                        if (result[myTabId].requests.urls[i].requestId === requestDetails.requestId) {
                            result[myTabId].requests.urls[i].status = requestDetails.statusCode;
                            result[myTabId].requests.urls[i].stopTime = requestDetails.timeStamp;
                        }
                    }
                }

                chrome.storage.local.set({ [myTabId]: result[myTabId] });
            });
        }
    });
}

function logError(requestDetails) {
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get([myTabId]).then((result) => {
                if (result && (Object.keys(result).length > 0 && Object.keys(result[myTabId]).length > 0)) {
                    for(let i = 0 ; i< result[myTabId].requests.urls.length; i++){
                        if (result[myTabId].requests.urls[i].requestId === requestDetails.requestId) {
                            result[myTabId].requests.urls[i].error = requestDetails.error;
                            result[myTabId].requests.urls[i].status = "error";
                            result[myTabId].requests.urls[i].stopTime = requestDetails.timeStamp;
                        }
                    }
                }

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
    logRequest,
    {urls: ["<all_urls>"]}
);

chrome.webRequest.onCompleted.addListener(
    logComplete,
    {urls: ["<all_urls>"]}
);

chrome.webRequest.onErrorOccurred.addListener(
    logError,
    {urls: ["<all_urls>"]}
);