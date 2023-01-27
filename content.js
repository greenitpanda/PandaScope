document.addEventListener('DOMContentLoaded', function() {
    let element = document.getElementById("PandaScope_NbElements");
    console.log("ok");
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get([myTabId]).then((result) => {
                if (Object.keys(result).length === 0 && Object.keys(result[myTabId]).length === 0) {
                    result[myTabId] = {
                        requests: []
                    };
                    chrome.storage.local.set({ [myTabId]: result[myTabId] });
                }
                if (element)
                    element.innerHTML = result[myTabId].requests.length + " appels effectues"
            });
        }
    });
});