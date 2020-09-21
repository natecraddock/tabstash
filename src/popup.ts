exports = {};

import { browser } from "webextension-polyfill-ts";
import { Tab, TabStash } from "./tabstash.js";
import { storeTabs } from "./stash";

let popup = null;

document.addEventListener("DOMContentLoaded", setup);

function getCurrentWindowTabs() {
    return browser.tabs.query({currentWindow: true});
}

function buttonStash() {
    /* For now let's just remove tabs, perhaps later we can pick a new active
     * and hide/discard tabs. */
    browser.tabs.query({currentWindow: true, highlighted: true}).then((tabs) => {
        storeTabs(tabs);
        for (let tab of tabs) {
            browser.tabs.remove(tab.id);
        }
    });
}

function buttonUnstash() {
    console.log("Clicked Unstash");
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

function setupButtonListeners(popup: any) {
    popup.buttons.stash.addEventListener("click", buttonStash);
    popup.buttons.unstash.addEventListener("click", buttonUnstash);
    popup.buttons.add.addEventListener("click", buttonAddToStash);
    popup.buttons.delete.addEventListener("click", buttonDeleteStash);
    popup.buttons.more.addEventListener("click", buttonMore);
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
    }
    setupButtonListeners(popup);

    console.log(popup);

    listTabs();
}

function listTabs() {
    getCurrentWindowTabs().then((tabs) => {
        let tabsList = document.getElementById('tabs-list');
        let currentTabs = document.createDocumentFragment();

        tabsList.textContent = "";

        for (let tab of tabs) {
            let tabLi = document.createElement("li");
            let tabLink = document.createElement("a");
            let fav = document.createElement("img");
            tabLi.appendChild(fav);
            tabLi.appendChild(tabLink);
            tabLink.textContent = tab.title;

            tabLink.setAttribute('href', tab.url);
            tabLink.classList.add('switch-tabs');
            currentTabs.appendChild(tabLi);
        }

        let ul = document.createElement('ul');
        ul.appendChild(currentTabs);
        tabsList.appendChild(ul);
    });
}
