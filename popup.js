const TABS = document.getElementById('tabs')

async function getAllTab() {
    let queryOptions = {populate:true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tabs] = await chrome.windows.getAll(queryOptions)
    return tabs;
}

async function listTabs() {
    await getAllTab().then( tabs => {
        tabs.tabs.forEach(tab => {
            var li = document.createElement("li");
            li.innerHTML = tab.url
            TABS.appendChild(li)
        });
    })
}

listTabs()