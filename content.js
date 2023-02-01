document.addEventListener('DOMContentLoaded', function() {
    let element = document.getElementById("PandaScope_NbElements");
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get({[myTabId] : getDefaultStorageValue()}).then((result) => {
                console.log(result);
                if (element) {
                    if (result[myTabId].requests.active === true) {
                        result[myTabId].requests.completed.sort(GetSortOrder("elapsed"));
                        let html = "<div>"
                        html += result[myTabId].requests.began.length + " appels effectues"
                        html += "<ul>";
                        for(let i = 0 ; i< 3; i++){
                            html += "<li>";
                            html += result[myTabId].requests.completed[i].method + " " + result[myTabId].requests.completed[i].status
                                        + " " + result[myTabId].requests.completed[i].elapsed + "ms";
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

function GetSortOrder() {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
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
    document.getElementById("PandaScope_Lancer").style.display = "none";
    document.getElementById("PandaScope_Arreter").style.display = "block";
    let myTabId;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            myTabId = tabs[0].id.toString();
            chrome.storage.local.get({[myTabId] : getDefaultStorageValue()}).then((result) => {
                chrome.storage.local.set({ [myTabId]: result[myTabId]}).then(() => {
                    if (chrome.runtime.lastError)
                        alert('Error setting');
                });
            });
        }
    });
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

            chrome.storage.local.get({[myTabId] : getDefaultStorageValue()}).then((result) => {
                result[myTabId].requests.active = active;
                alert(JSON.stringify(result[myTabId]));
                try {
                        chrome.storage.local.set({ [myTabId]: result[myTabId] });
                  } catch (ex) {
                    alert(ex);
                  }
            });
        }
    });
}

document.getElementById("PandaScope_clear").addEventListener('click', function() {
    alert("clear");
    chrome.storage.local.clear();
});