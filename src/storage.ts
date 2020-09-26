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
    activeStash: number = 0;

    constructor() {
        this.version = "0.0.1";
        this.stashes = [];
        this.activeStash = -1;
    }
}

/* Global State!
 * Each time the popup is opened the initialize() function will
 * Set this to the existing extension storage.
 */
let tabstash: StashStorage;

export function initialize(callback: () => void) {
    browser.storage.local.get("stashes").then(data => {
        if ("stashes" in data) {
            tabstash = data.stashes;
            callback();
        }
        else {
            tabstash = new StashStorage();
            browser.storage.local.set({ stashes: tabstash }).then(() => {
                callback();
            });
        }
    });
}

function writeStorage(): void {
    browser.storage.local.set({ stashes: tabstash });
}

export function clearStash(): void {
    tabstash.stashes.splice(tabstash.activeStash, 1);
    tabstash.activeStash = tabstash.stashes.length - 1;
    writeStorage();
}

export function setActiveTab(index: number) {
    if (index < 0 || index > tabstash.stashes.length - 1) {
        index = 0;
    }
    tabstash.activeStash = index;
    writeStorage();
}

export function getStorage(): StashStorage {
    return tabstash;
}

export function storeTabs(tabs: TabStash): void {
    tabstash.stashes.push(tabs);
    tabstash.activeStash = tabstash.stashes.length - 1;
    writeStorage();
}
