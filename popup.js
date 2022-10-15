async function getAllTab() {
    let queryOptions = {populate:true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tabs = await chrome.windows.getLastFocused(queryOptions)
    return tabs;
}

async function listTabs() {
    let sessionObject = []
    await getAllTab().then( tabs => {
        tabs.tabs.forEach(tab => {
            sessionObject.push({"title": tab.title, "url": tab.url})
        });
    })
    return sessionObject
}

async function saveSession(sessionName) {
    listTabs().then(d => {
        chrome.storage.local.set({sessionName: d}, function() {
            console.log('Settings saved', {sessionName: d});
        });
    })
}

saveSession('test')