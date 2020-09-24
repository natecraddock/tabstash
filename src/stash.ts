/*
 * Utility functions for storing stashed tabs in the browser
 */

import { browser } from "webextension-polyfill-ts";

export class TabStash {
    tabs: string[];
    name: string;

    constructor(name: string, tabs: string[]) {
        this.tabs = tabs;
        this.name = name;
    }
}

export class StashStorage {
    version: string;
    stashes: TabStash[];

    constructor() {
        this.version = "0.0.1";
        this.stashes = [];
    }
}

let storage: StashStorage = undefined;

export async function getStorage() {
    if (storage === undefined) {
        storage = new StashStorage();
        await browser.storage.local.set({ stashes: storage });
    }
    browser.storage.local.get("stashes").then(data => {
        storage = data.stashes;
    });

    return storage;
}

async function setStorage(storage: StashStorage) {
    await browser.storage.local.set({stashes: storage});
}

export function storeTabs(tabs: TabStash) {
    getStorage().then(data => {
        storage.stashes.push(tabs);
        setStorage(storage);
    });
}
