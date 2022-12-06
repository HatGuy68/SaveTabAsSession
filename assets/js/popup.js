let messageDiv = document.getElementById('message') 

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('open');
    // onClick's logic below:
    link.addEventListener('click', function() {
        openNav();
    });
});

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
document.getElementById("mySidebar").style.width = "0";
document.getElementById("main").style.marginLeft = "0";
}

function addSession() {
    sessionName = prompt('Add current tabs to session')
    saveSession(sessionName)
    console.log('session save started');
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
            sessionList.push({"title": tab.title, "url": tab.url})
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

function renderSession(sessionName) {
    let session_list = document.getElementById('session_list')
    console.log(session_list);
    let li = document.createElement("li")
    li.innerHTML = `<li class="session"><div class="session_title" id="title-${sessionName}">${sessionName}</div><div class="session_delete" id="delete-${sessionName}">X</div></li>`
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

listSessions()