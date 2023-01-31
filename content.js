document.addEventListener('DOMContentLoaded', function() {
    let element = document.getElementById("PandaScope_NbElements");
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get({[myTabId] : getDefaultStorageValue()}).then((result) => {
                if (element) {
                    if (result[myTabId].requests.active === true) {
                        let html = "<div>"
                        html += result[myTabId].requests.urls.length + " appels effectues"
                        html += "<ul>";
                        for(let i = 0 ; i< result[myTabId].requests.urls.length; i++){
                            html += "<li>";
                            html += result[myTabId].requests.urls[i].method + " " + result[myTabId].requests.urls[i].status
                                        + " " + (result[myTabId].requests.urls[i].stopTime - result[myTabId].requests.urls[i].startTime).toFixed(2) + "ms";
                            html += "</li>";
                        }
                        html += "</ul></div>"
                        element.innerHTML = html;
                    }
                    document.getElementById("PandaScope_Lancer").style.display = result[myTabId].requests.active === false ? "block" : "none";
                    document.getElementById("PandaScope_Arreter").style.display = result[myTabId].requests.active === true ? "block" : "none";
                }
            });
        }
    });
});

function getDefaultStorageValue() {
    return {
        requests: {
            urls: [],
            active: false
        }
    };
}

document.getElementById("PandaScope_Lancer").addEventListener('click', function() {
    startStopInspection(true);
    document.getElementById("PandaScope_Lancer").style.display = "none";
    document.getElementById("PandaScope_Arreter").style.display = "block";
});

document.getElementById("PandaScope_Arreter").addEventListener('click', function() {
    startStopInspection(false);
    document.getElementById("PandaScope_Lancer").style.display = "block";
    document.getElementById("PandaScope_Arreter").style.display = "none";
});

function startStopInspection(active) {
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();

            chrome.storage.local.get([myTabId]).then((result) => {
                if (!result || (Object.keys(result).length === 0 || Object.keys(result[myTabId]).length === 0)) {
                    result[myTabId] = getDefaultStorageValue();
                }

                result[myTabId].requests.active = active;
                chrome.storage.local.set({ [myTabId]: result[myTabId] });
            });
        }
    });
}

document.getElementById("PandaScope_clear").addEventListener('click', function() {
    chrome.storage.local.clear();
});