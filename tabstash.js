document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
    return browser.tabs.query({currentWindow: true});
}

function listTabs() {
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = document.getElementById('tabs-list');
        let currentTabs = document.createDocumentFragment();
        let counter = 0;

        tabsList.textContent = "";

        for (let tab of tabs) {
            let tabLi = document.createElement("li");
            let tabLink = document.createElement("a");
            let fav = document.createElement("img");
            tabLi.appendChild(fav);
            tabLi.appendChild(tabLink);
            tabLink.textContent = tab.title || tab.id;

            console.log(tab.favIconUrl);
            fav.setAttribute('src', tab.favIconUrl);
            fav.setAttribute('class', 'favicon');

            tabLink.setAttribute('href', tab.url);
            tabLink.classList.add('switch-tabs');
            currentTabs.appendChild(tabLi);
        }

        let ul = document.createElement('ul');
        ul.appendChild(currentTabs);
        tabsList.appendChild(ul);
    });
}
