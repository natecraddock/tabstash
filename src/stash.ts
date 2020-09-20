/*
 * Utility functions for storing stashed tabs in the browser
 */

import { browser } from "webextension-polyfill-ts";

let stashName = "tabstashstorage";

class StashStorage {
    version = "";
    stashes: any = [];
}

class TabStash {
    
}

function initStorage() {
    browser.storage.local.set({tabstashstorage: new StashStorage()});
}

function getStorage(): StashStorage {
    browser.storage.local.get(stashName).then((item) => {
        // Check if the object exists
        if ((Object.keys(item).length === 0) && item.constructor === Object) {
            initStorage();
        }
        console.log(item.tabstashstorage);
        return item.tabstashstorage;
    },
    (error) => {
        console.log("No storage", error);
    });

    return new StashStorage();
}

function setStorage(storage: any) {
    browser.storage.local.set({tabstashstorage: storage});
}

export function storeTabs(tabs: any) {
    let storage = getStorage();
    storage.stashes.push(tabs);
    setStorage(storage);
}
