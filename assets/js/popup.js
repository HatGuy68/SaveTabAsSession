async function getAllTab() {
    let queryOptions = {populate:true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tabs = await chrome.windows.getLastFocused(queryOptions)
    return tabs;
}

function rebootSession(sessionName)

async function saveSession(sessionName) {
    let sessionList = []
    await getAllTab().then( tabs => {
        tabs.tabs.forEach(tab => {
            sessionList.push({"title": tab.title, "url": tab.url})
        });
    })
    await chrome.storage.local.set({sessionName: sessionList}, function() {
        console.log('Settings saved', {sessionName: sessionList});
    });
}

async function listSessions() {
    let sessionNames = []
    await chrome.storage.local.get().then(dict => {
        sessionNames = Object.keys(dict)
        sessionNames.forEach(sessionName => {
            renderSession(sessionName)
        })
    })
}

function renderSession(sessionName)

saveSession('test')
console.log(listSessions())