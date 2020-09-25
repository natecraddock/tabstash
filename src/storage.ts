import { browser } from "webextension-polyfill-ts";

export class Tab {
    name: string;
    url: string;

    constructor(name: string, url: string) {
        this.name = name;
        this.url = url;
    }
}

export class TabStash {
    tabs: Tab[];
    name: string;

    constructor(name: string, tabs: Tab[]) {
        this.tabs = tabs;
        this.name = name;
    }
}

export class StashStorage {
    version: string;
    stashes: TabStash[];
    activeStash: TabStash;

    constructor() {
        this.version = "0.0.1";
        this.stashes = [];
    }
}

/* Global State!
 * Each time the popup is opened the initialize() function will
 * Set this to the existing extension storage.
 */
let storage: StashStorage = undefined;

export function initialize(callback: () => void) {
    browser.storage.local.get("stashes").then(data => {
        if ("stashes" in data) {
            storage = data.stashes;
            callback();
        }
        else {
            storage = new StashStorage();
            browser.storage.local.set({ stashes: storage }).then(() => {
                callback();
            });
        }
    });
}

function writeStorage(): void {
    browser.storage.local.set({ stashes: storage });
}

export function clearStash(): void {
    delete storage.stashes[0];
    writeStorage();
}

export function getStorage(): StashStorage {
    return storage;
}

export function storeTabs(tabs: TabStash): void {
    storage.stashes[0] = tabs;
    writeStorage();
}
