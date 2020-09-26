import { browser } from "webextension-polyfill-ts";
import * as storage from "./storage";

type Popup = {
    buttons: {
        stash: HTMLButtonElement,
        unstash: HTMLButtonElement,
        add: HTMLButtonElement,
        delete: HTMLButtonElement,
        more: HTMLButtonElement,
    },
    stashList: HTMLSelectElement,
    tabList: HTMLDivElement
};
let popup: Popup;

function buttonStash() {
    /* For now let's just remove tabs, perhaps later we can pick a new active
     * and hide/discard tabs. */
    browser.tabs.query({ currentWindow: true, highlighted: true }).then((tabs) => {
        let urls: storage.Tab[] = tabs.reduce((results: storage.Tab[], tab) => {
            if (tab.url) {
                results.push(new storage.Tab(tab.title ?? "", tab.url));
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
    });
}

function listTabs(tabs: storage.TabStash) {
    let currentTabs = document.createDocumentFragment();

    popup.tabList.textContent = "";

    for (let tab of tabs.tabs) {
        let tabLi = document.createElement("li");
        let tabLink = document.createElement("a");
        let fav = document.createElement("img");
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

function listStashes(stashes: storage.TabStash[]) {
    for (let stash of stashes) {
        let option = document.createElement("option") as HTMLOptionElement;
        option.text = stash.name;

        popup.stashList.add(option);
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

function refreshPopup(tabstash: storage.StashStorage) {
    listTabs(tabstash.stashes[0]);
    listStashes(tabstash.stashes);
}

function setupButtonListeners(popup: Popup) {
    popup.buttons.stash.addEventListener("click", buttonStash);
    popup.buttons.unstash.addEventListener("click", buttonUnstash);
    popup.buttons.add.addEventListener("click", buttonAddToStash);
    popup.buttons.delete.addEventListener("click", buttonDeleteStash);
    popup.buttons.more.addEventListener("click", buttonMore);
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
            more: document.getElementById("but-stash-more") as HTMLButtonElement
        },
        stashList: document.getElementById("stash-list") as HTMLSelectElement,
        tabList: document.getElementById('tabs-list') as HTMLDivElement
    };

    setupButtonListeners(popup);
    browser.storage.onChanged.addListener(setupStorageListener);

    let tabstash = storage.getStorage()

    // Do the first paint of existing data.
    refreshPopup(tabstash);
}

document.addEventListener("DOMContentLoaded", function () {
    storage.initialize(setup);
});
