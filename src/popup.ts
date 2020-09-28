import { browser } from "webextension-polyfill-ts";
import * as storage from "./storage";

type Popup = {
    buttons: {
        stash: HTMLButtonElement,
        unstash: HTMLButtonElement,
        add: HTMLButtonElement,
        delete: HTMLButtonElement,
        more: HTMLButtonElement,
        settings: HTMLImageElement,
    },
    stashList: HTMLSelectElement,
    tabList: HTMLDivElement,
    alertBox: HTMLSpanElement,
};
let popup: Popup;

function clearAlert() {
    popup.alertBox.classList.remove("show");

    // Reset the text later to prevent the box from resizing as it fades.
    setTimeout(function() {
        popup.alertBox.textContent = "";
    }, 1000);
}

function alert(text: string, alertType: "sticky" | "timed" = "timed") {
    const TIMEOUT = 3000;
    popup.alertBox.textContent = text;

    popup.alertBox.classList.add("show");

    if (alertType === "timed") {
        setTimeout(clearAlert, TIMEOUT);
    }
}

function buttonStash() {
    /* For now let's just remove tabs, perhaps later we can pick a new active
     * and hide/discard tabs. */
    browser.tabs.query({ currentWindow: true, highlighted: true }).then((tabs) => {
        let urls: storage.Tab[] = tabs.reduce((results: storage.Tab[], tab) => {
            if (tab.url) {
                results.push(new storage.Tab(tab.title ?? "", tab.url, tab.favIconUrl ?? ""));
            }
            return results;
        }, []);

        for (let tab of tabs) {
            if (tab.id) {
                browser.tabs.remove(tab.id);
            }
        }

        let stash = new storage.TabStash(new Date().toISOString(), urls);
        storage.storeTabs(stash);

        alert(`Stashed ${tabs.length} tabs!`);
    });
}

function listTabs(tabs: storage.TabStash) {
    let currentTabs = document.createDocumentFragment();

    popup.tabList.textContent = "";

    for (let tab of tabs.tabs) {
        let tabLi = document.createElement("li");
        let tabLink = document.createElement("a");
        let fav = document.createElement("img");

        fav.setAttribute("src", tab.icon);

        tabLi.appendChild(fav);
        tabLi.appendChild(tabLink);
        tabLink.textContent = tab.name;

        tabLink.setAttribute('href', tab.url);
        tabLink.classList.add('switch-tabs');
        currentTabs.appendChild(tabLi);
    }

    let ul = document.createElement('ul');
    ul.appendChild(currentTabs);
    popup.tabList.appendChild(ul);
}

function listStashes(stashes: storage.TabStash[], active: number) {
    // Remove old stashes if needed
    for (let i = popup.stashList.options.length; i >= 0; --i) {
        popup.stashList.remove(i);
    }

    for (let stash of stashes) {
        let option = document.createElement("option") as HTMLOptionElement;
        option.text = stash.name;

        popup.stashList.add(option);
    }

    if (active !== -1) {
        popup.stashList.selectedIndex = active;
    }
}

function buttonUnstash() {
    console.log("Clicked Unstash");
    let tabstash = storage.getStorage();

    for (let tab of tabstash.stashes[0].tabs) {
        browser.tabs.create({
            discarded: true,
            url: tab.url
        });
    }

    storage.clearStash();
}

function buttonAddToStash() {
    console.log("Clicked Add");
}

function buttonDeleteStash() {
    console.log("Clicked Delete");
}

function buttonMore() {
    console.log("Clicked More");
}

function stashListChanged() {
    storage.setActiveTab(popup.stashList.selectedIndex);
    refreshPopup(storage.getStorage());
}

function refreshPopup(tabstash: storage.StashStorage) {
    listStashes(tabstash.stashes, tabstash.activeStash);
    if (tabstash.activeStash !== -1) {
        listTabs(tabstash.stashes[tabstash.activeStash]);
    }
}

function setupListeners(popup: Popup) {
    popup.buttons.stash.addEventListener("click", buttonStash);
    popup.buttons.unstash.addEventListener("click", buttonUnstash);
    popup.buttons.add.addEventListener("click", buttonAddToStash);
    popup.buttons.delete.addEventListener("click", buttonDeleteStash);
    popup.buttons.more.addEventListener("click", buttonMore);
    popup.buttons.settings.addEventListener("click", function() {
        browser.runtime.openOptionsPage();
    })

    popup.stashList.addEventListener("change", stashListChanged)
}

function setupStorageListener(changes: any, areaName: string) {
    refreshPopup(changes.stashes.newValue);
}

function setup() {
    popup = {
        buttons: {
            stash: document.getElementById("but-stash") as HTMLButtonElement,
            unstash: document.getElementById("but-unstash") as HTMLButtonElement,
            add: document.getElementById("but-stash-add") as HTMLButtonElement,
            delete: document.getElementById("but-stash-delete") as HTMLButtonElement,
            more: document.getElementById("but-stash-more") as HTMLButtonElement,
            settings: document.getElementById("but-settings") as HTMLImageElement
        },
        stashList: document.getElementById("stash-list") as HTMLSelectElement,
        tabList: document.getElementById('tabs-list') as HTMLDivElement,
        alertBox: document.getElementById('alert') as HTMLSpanElement,
    };

    clearAlert();

    setupListeners(popup);
    browser.storage.onChanged.addListener(setupStorageListener);

    let tabstash = storage.getStorage()

    // Do the first paint of existing data.
    refreshPopup(tabstash);
}

document.addEventListener("DOMContentLoaded", function () {
    storage.initialize(setup);
});
