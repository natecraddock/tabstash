import { browser } from "webextension-polyfill-ts";

export namespace storage {
    export class Tab {
        name: string;
        url: string;
        icon: string;

        constructor(name: string, url: string, icon: string) {
            this.name = name;
            this.url = url;
            this.icon = icon;
        }
    }

    export class Preferences {
        stashName: "date" | "tab_name" | "custom";
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
        preferences: Preferences;

        constructor() {
            this.version = "0.0.1";
            this.stashes = [];
            this.activeStash = -1;
            this.preferences = new Preferences();
        }
    }

    /* Global State!
     * Each time the popup is opened the initialize() function will
     * Set this to the existing extension storage.
     */
    let tabstash: StashStorage;

    function doVersioning(tabstash: StashStorage) {}

    export function initialize(callback: () => void) {
        browser.storage.local.get("stashes").then((data) => {
            if ("stashes" in data) {
                tabstash = data.stashes;

                doVersioning(tabstash);

                callback();
            } else {
                tabstash = new StashStorage();
                browser.storage.local.set({ stashes: tabstash }).then(() => {
                    callback();
                });
            }
        });

        /**
         * There are some cases where two instances of the storage are loaded into memory,
         * and they would get out of sync. For example, having the preferences open in
         * one window, and then opening the popup in another window. The preferences local
         * copy of the storage would overwrite the popup on preference changes.
         */
        browser.storage.onChanged.addListener((changes: any, areaName: string) => {
            tabstash = changes.stashes.newValue;
        });
    }

    export function writeStorage(): void {
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

    export function setPreference(name: string, value: any) {
        tabstash.preferences.stashName = value;
        writeStorage();
    }
}
