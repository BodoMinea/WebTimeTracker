nowopen=[], first=true;

chrome.storage.sync.get('sites', function(items) {
	if(!items.sites){
		chrome.storage.sync.set({"sites": [] }, function() {

    	});
	}
})

function getByHost(url) {
    for (var i = 0; i < nowopen.length; i++) {
        if (nowopen[i].host == url) {
           return i;
       } 
    }
}

function store(host,time){
	var storage=[],found=false;
	chrome.storage.sync.get('sites', function(items) {
		storage = items.sites;
		for (var i = 0; i < storage.length; i++) {
	        if (storage[i].host == host) {
	           found=i;
	       } 
	    }
	    if(found!=false){
	    	storage[i].times=storage[i].times+1;
	    	storage[i].milis=storage[i].milis+time;
	    }else{
	    	console.log(host);
	    	console.log({host: host, times: 1, milis: time});
	    	storage.push({host: host, times: 1, milis: time});
	    	console.log(storage);
	    }
	    chrome.storage.sync.set({"sites": storage }, function() {
      	
    	});
	})
}

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
		    	store(nowopen[getByHost(extractHostname(last))].host,nowt-nowopen[getByHost(extractHostname(last))].opened)
		    	nowopen.splice(getByHost(extractHostname(last)), 1);
		}
	}
});