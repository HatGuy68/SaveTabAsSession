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
        list[sessionName][1].forEach(object => {
            sessionUrls.push(object.url)
        });
    })
    chrome.windows.create({url: sessionUrls})
}

async function timeSinceSession(sessionName) {
    await chrome.storage.local.get([sessionName]).then(list => {
        if (!isNaN(list[sessionName][0])) {
            return timeSince(list[sessionName][0])
        }
    })
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
    await chrome.storage.local.set({[sessionName]: [Date.now(), sessionList]}, function() {
        console.log('Session saved', {[sessionName]: [Date.now(), sessionList]});
    });
    listSessions()
}

async function listSessions() {
    document.getElementById('session_list').innerHTML = ''
    let sessionNames = []
    await chrome.storage.local.get().then(dict => {
        sessionNames = Object.keys(dict)
        sessionTimes = Object.values(dict)

        if (sessionNames.length > 0) {
            messageDiv.style.visibility = 'hidden';
            sessionTime = ''
            for (let i=0; i < sessionNames.length; i++) {
                console.log(sessionTimes[i][0]);
                if (!isNaN(sessionTimes[i][0])) {
                    sessionTime = timeSince(sessionTimes[i][0])
                }
                renderSession(sessionNames[i], sessionTime)
            }
        } else {
            renderMessage('Currently No sessions Saved')
        }
    })
}

const new_date = new Date()
let d = document.getElementById("time_ago")
// d.innerHTML = timeSince(new_date)

const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 0 }
];
  
function timeSince(date) {
    console.log(date);
    const secondsSinceDate = Math.floor((Date.now() - date) / 1000);
    const interval = intervals.find(i => i.seconds <= secondsSinceDate);
    const count = Math.floor(secondsSinceDate / interval.seconds) | 0;
    return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}

function renderSession(sessionName, sessionTime) {
    let session_list = document.getElementById('session_list')
    let li = document.createElement("li")
    li.innerHTML = `
        <li class="session">
            <div class="session_title" id="title-${sessionName}">${sessionName}</div>
            <div id="time_ago">${sessionTime}</div>
            <i class="session_delete" id="delete-${sessionName}"></i>
        </li>
    `
    session_list.appendChild(li)
    document.getElementById(`title-${sessionName}`).addEventListener('click', () => {
        rebootSession(`${sessionName}`)
    })
    document.getElementById(`delete-${sessionName}`).addEventListener('click', () => {
        deleteSession(`${sessionName}`)
    })

    // document.getElementById(`delete-${sessionName}`).addEventListener('click', removeSession(`${sessionName}`))
}


listSessions()

document.getElementById("addSession").addEventListener('click', addSession);
document.getElementById("toggleMenu").addEventListener('click', toggleMenu);
