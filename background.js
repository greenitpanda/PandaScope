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
                    result[myTabId].requests.began.push({
                        url: requestDetails.url,
                        requestId: requestDetails.requestId,
                        startTime: requestDetails.timeStamp,
                        method: requestDetails.method
                    });
                    chrome.storage.local.set({ [myTabId]: result[myTabId] });
                }
            });
        }
    });
}



function logComplete(requestDetails) {
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get({[myTabId] : getDefaultStorageValue()}).then((result) => {
                if (result && (Object.keys(result).length > 0 && Object.keys(result[myTabId]).length > 0)) {
                    for(let i = 0 ; i< result[myTabId].requests.began.length; i++){
                        if (result[myTabId].requests.began[i].requestId === requestDetails.requestId) {
                            result[myTabId].requests.completed.push({
                                url: result[myTabId].requests.began[i].url,
                                requestId: result[myTabId].requests.began[i].requestId,
                                startTime: result[myTabId].requests.began[i].timeStamp,
                                method: result[myTabId].requests.began[i].method,
                                status: requestDetails.statusCode,
                                stopTime: requestDetails.timeStamp,
                                elapsed: requestDetails.timeStamp - result[myTabId].requests.began[i].startTime
                            });
                        }
                    }
                    chrome.storage.local.set({ [myTabId]: result[myTabId] });
                }

            });
        }
    });
}

function logError(requestDetails) {
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get({[myTabId] : getDefaultStorageValue()}).then((result) => {
                if (result && (Object.keys(result).length > 0 && Object.keys(result[myTabId]).length > 0)) {
                    for(let i = 0 ; i< result[myTabId].requests.began.length; i++){
                        if (result[myTabId].requests.began[i].requestId === requestDetails.requestId) {
                            result[myTabId].requests.completed.push({
                                url: result[myTabId].requests.began[i].url,
                                requestId: result[myTabId].requests.began[i].requestId,
                                startTime: result[myTabId].requests.began[i].timeStamp,
                                method: result[myTabId].requests.began[i].method,
                                status: requestDetails.statusCode,
                                stopTime: requestDetails.timeStamp,
                                elapsed: requestDetails.timeStamp - result[myTabId].requests.began[i].startTime,
                                error: requestDetails.error
                            });
                        }
                    }
                    chrome.storage.local.set({ [myTabId]: result[myTabId] });
                }

            });
        }
    });
}

function getDefaultStorageValue() {
    return {
        requests: {
            began: [],
            completed: [],
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