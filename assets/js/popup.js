let messageDiv = document.getElementById('message')
let displayStatus = false

function addSession() {
    sessionName = prompt('Add current tabs to session')
    if (sessionName) {
        saveSession(sessionName)
        console.log('session save started');
    } else {
        console.log('session not saved');
    }
}


function toggleMenu() {
    let element = document.getElementsByClassName("menu")[0];
    if (displayStatus) {
        element.style.transform = 'translateX(-100%)';
        displayStatus = false
    } else {
        element.style.transform = 'translateX(0)';
        displayStatus = true
    }
}

function renderMessage(m) {
    let message = `<p>${m}</p>`
    messageDiv.innerHTML = message;
    messageDiv.style.visibility = 'visible';
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

function deleteSession(sessionName) {
    chrome.storage.local.remove([sessionName]).then(() => {
        listSessions()
    })
}

async function saveSession(sessionName) {
    let sessionList = []
    await getAllTab().then( tabs => {
        tabs.tabs.forEach(tab => {
            sessionList.push({"title": tab.title, "url": tab.url, "date_created": Date.now(), "date_modified": Date.now()})
            console.log(sessionList[sessionList.length - 1]);
        });
    })
    await chrome.storage.local.set({[sessionName]: sessionList}, function() {
        console.log('Session saved', {[sessionName]: sessionList});
    });
    listSessions()
}

async function listSessions() {
    document.getElementById('session_list').innerHTML = ''
    let sessionNames = []
    await chrome.storage.local.get().then(dict => {
        sessionNames = Object.keys(dict)
        if (sessionNames.length > 0) {
            messageDiv.style.visibility = 'hidden';
            sessionNames.forEach(sessionName => {
                renderSession(sessionName)
            })
        } else {
            renderMessage('Currently No sessions Saved')
        }
    })
}

const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 0 }
];
  
function timeSince(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const interval = intervals.find(i => i.seconds <= seconds);
    console.log(interval);
    const count = Math.floor(seconds / interval.seconds) | 0;
    return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}

function renderSession(sessionName) {
    let session_list = document.getElementById('session_list')
    let li = document.createElement("li")
    li.innerHTML = `<li class="session"><div class="session_title" id="title-${sessionName}">${sessionName}</div><i class="session_delete" id="delete-${sessionName}"></i></li>`
    session_list.appendChild(li)
    document.getElementById(`title-${sessionName}`).addEventListener('click', () => {
        rebootSession(`${sessionName}`)
    })
    document.getElementById(`delete-${sessionName}`).addEventListener('click', () => {
        deleteSession(`${sessionName}`)
    })

    // document.getElementById(`delete-${sessionName}`).addEventListener('click', removeSession(`${sessionName}`))
}

document.getElementById("addSession").addEventListener('click', addSession);
document.getElementById("toggleMenu").addEventListener('click', toggleMenu);

listSessions()
const new_date = new Date()
let d = document.getElementById("time_ago")
d.innerHTML = timeSince(new_date)