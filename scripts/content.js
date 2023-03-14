document.addEventListener('DOMContentLoaded', function() {
    displayElementsPopup();
});

function displayElementsPopup() {
    let nbElements = document.getElementById("nb_elements");
    let top3weight = document.getElementById("top3weight");
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get([myTabId]).then((result) => {
                if (!result || (Object.keys(result).length === 0 || Object.keys(result[myTabId]).length === 0)) {
                    result[myTabId] = getDefaultStorageValue();
                }
                if (nbElements) {
                    if (result[myTabId].requests.active === true) {
                        
                        // Sort the requests to get the longest 
                        result[myTabId].requests.completed = result[myTabId].requests.completed.sort((a, b) => {
                            return b.elapsed - a.elapsed;
                        });

                        let html = ""
                        if (result[myTabId].requests.completed.length > 0) {

                            let maxIterations = result[myTabId].requests.completed.length > 5 ? 5 : result[myTabId].requests.completed.length;
                            for(let i = 0 ; i< maxIterations; i++){
                                html += "<li title='" + result[myTabId].requests.completed[i].url + "'>";
                                let subUrl = result[myTabId].requests.completed[i].url.substring(0, 40);
                                html += "<b>" + result[myTabId].requests.completed[i].method + "</b> " + subUrl + "..."
                                            + " <span style=\"color:red;font-weight:bold;\">" + result[myTabId].requests.completed[i].elapsed + "ms</span>";
                                html += "</li>";
                            }
                        }
                        nbElements.innerHTML = result[myTabId].requests.began.length + " appels effectu&eacute;s";
                        top3weight.innerHTML = html;
                    }
                    document.getElementById("PandaScope_Lancer").style.display = result[myTabId].requests.active === false ? "block" : "none";
                    document.getElementById("PandaScope_Arreter").style.display = result[myTabId].requests.active === true ? "block" : "none";
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

document.getElementById("PandaScope_Lancer").addEventListener('click', function() {
    startStopInspection(true);
});

document.getElementById("PandaScope_Arreter").addEventListener('click', function() {
    startStopInspection(false);
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
                if (active === true) {
                    document.getElementById("PandaScope_Lancer").style.display = "none";
                    document.getElementById("PandaScope_Arreter").style.display = "block";
                    document.getElementById("PandaScope_NbElements").style.display = "block";
                    displayElementsPopup();
                } else {
                    document.getElementById("PandaScope_Lancer").style.display = "block";
                    document.getElementById("PandaScope_Arreter").style.display = "none";
                    document.getElementById("PandaScope_NbElements").style.display = "none";
                }
            });
        }
    });
}

document.getElementById("PandaScope_clear").addEventListener('click', function() {
    chrome.storage.local.clear();
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();

            chrome.storage.local.remove([myTabId]);
            document.getElementById("PandaScope_Lancer").style.display = "block";
            document.getElementById("PandaScope_Arreter").style.display = "none";
            document.getElementById("PandaScope_NbElements").style.display = "none";
        }
    });
});