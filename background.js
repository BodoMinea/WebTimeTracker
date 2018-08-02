nowopen=[], first=true;

function extractHostname(url) {
    var hostname;
    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    return hostname;
}

function getByHost(url) {
    for (var i = 0; i < nowopen.length; i++) {
        if (nowopen[i].host == url) {
           return i;
       } 
    }
}

function getByTab(id) {
    for (var i = 0; i < nowopen.length; i++) {
        if (nowopen[i].tab == id) {
           return i;
       } 
    }

}

chrome.tabs.onCreated.addListener(function(tab) {
	nowopen.push({host: extractHostname(tab.url), opened: Date.now(), tab: tab.id, last:tab.url});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(first){ first=false; nowopen.push({host: extractHostname(tab.url), opened: Date.now(), tab: tab.id, last:tab.url}); } else {
		if(changeInfo.url&&extractHostname(nowopen[getByTab(tabId)].last)!=extractHostname(tab.url)) {
		    	last = nowopen[getByTab(tabId)].last;
		    	nowopen.push({host: extractHostname(tab.url), opened: Date.now(), tab: tabId, last:tab.url});
		    	nowt = Date.now();
		    	console.log(nowt-nowopen[getByHost(extractHostname(last))].opened);
		    	nowopen.splice(getByHost(extractHostname(last)), 1);
		}
	}
});