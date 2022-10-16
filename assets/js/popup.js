document.getElementById("addSession").addEventListener('click', addSession);

function addSession() {
    sessionName = prompt('Add current tabs to session')
    saveSession(sessionName)
    console.log('session save started');
}

async function getAllTab() {
    let queryOptions = {populate:true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tabs = await chrome.windows.getLastFocused(queryOptions)
    console.log(tabs);
    return tabs;
}

async function rebootSession(sessionName) {
    sessionUrls = []
    await chrome.storage.local.get([sessionName]).then(list => {
        list[sessionName].forEach(object => {
            sessionUrls.push(object.url)
        });
    })
    chrome.windows.create({url: sessionUrls})
}

async function saveSession(sessionName) {
    let sessionList = []
    await getAllTab().then( tabs => {
        tabs.tabs.forEach(tab => {
            sessionList.push({"title": tab.title, "url": tab.url})
        });
    })
    await chrome.storage.local.set({[sessionName]: sessionList}, function() {
        console.log('Session saved', {[sessionName]: sessionList});
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
    li.innerHTML = `<li class="session"><div class="session_title" id="title-${sessionName}">${sessionName}</div><div class="session_delete" id="delete-${sessionName}">X</div></li>`
    session_list.appendChild(li)
    document.getElementById(`title-${sessionName}`).addEventListener('click', () => {
        rebootSession(`${sessionName}`)
    })
    // document.getElementById(`delete-${sessionName}`).addEventListener('click', removeSession(`${sessionName}`))
}

listSessions()