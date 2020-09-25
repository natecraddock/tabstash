import { browser } from "webextension-polyfill-ts";
import * as storage from "./storage";

type Popup = {
    buttons: {
        stash: HTMLElement,
        unstash: HTMLElement,
        add: HTMLElement,
        delete: HTMLElement,
        more: HTMLElement,
    },
    stashList: HTMLElement,
};
let popup: Popup = null;

function buttonStash() {
    /* For now let's just remove tabs, perhaps later we can pick a new active
     * and hide/discard tabs. */
     browser.tabs.query({currentWindow: true, highlighted: true}).then((tabs) => {
         let urls = tabs.map(tab => {
             return new storage.Tab(tab.title, tab.url);
         });

         for (let tab of tabs) {
            browser.tabs.remove(tab.id);
         }

         let stash = new storage.TabStash("stash", urls);
         storage.storeTabs(stash);
    });
}

function listTabs(tabs: storage.TabStash) {
    let tabsList = document.getElementById('tabs-list');
    let currentTabs = document.createDocumentFragment();

    tabsList.textContent = "";

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
    tabsList.appendChild(ul);
}

function refreshPopup(storage: storage.StashStorage) {
    listTabs(storage.stashes[0]);
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

function setupButtonListeners(popup: Popup) {
    popup.buttons.stash.addEventListener("click", buttonStash);
    popup.buttons.unstash.addEventListener("click", buttonUnstash);
    popup.buttons.add.addEventListener("click", buttonAddToStash);
    popup.buttons.delete.addEventListener("click", buttonDeleteStash);
    popup.buttons.more.addEventListener("click", buttonMore);
}

function setupStorageListener(changes: any, areaName: string) {
    console.log(changes.stashes.newValue);
    refreshPopup(changes.stashes.newValue);
}

function setup() {
    popup = {
        buttons: {
            stash: document.getElementById("but-stash"),
            unstash: document.getElementById("but-unstash"),
            add: document.getElementById("but-stash-add"),
            delete: document.getElementById("but-stash-delete"),
            more: document.getElementById("but-stash-more")
        },
        stashList: document.getElementById("stash-list")
    };

    setupButtonListeners(popup);
    browser.storage.onChanged.addListener(setupStorageListener);

    let tabstash = storage.getStorage()
    refreshPopup(tabstash);
}

document.addEventListener("DOMContentLoaded", function() {
    storage.initialize(setup);
});
