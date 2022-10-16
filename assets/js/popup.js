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

function renderSession(sessionName) {
    let session_list = document.getElementById('session_list')
    console.log(session_list);
    let li = document.createElement("li")
    li.innerHTML = `<li class="session"><div class="session_title" onclick="rebootSession(${sessionName})">${sessionName}</div><div class="session_delete" onclick="deleteSession("${sessionName}")">X</div></li>`
    session_list.appendChild(li)
}

saveSession('test')
console.log(listSessions())