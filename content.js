document.addEventListener('DOMContentLoaded', function() {
    let element = document.getElementById("PandaScope_NbElements");
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get({[myTabId] : getDefaultStorageValue()}).then((result) => {
                if (element) {
                    element.innerHTML = result[myTabId].requests.urls.length + " appels effectues"
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
                result[myTabId].requests.active = active;
                chrome.storage.local.set({ [myTabId]: result[myTabId] });
                alert(result[myTabId].requests.active);
            });
        }
    });
}

document.getElementById("PandaScope_clear").addEventListener('click', function() {
    chrome.storage.local.clear();
    alert("clear done");
});