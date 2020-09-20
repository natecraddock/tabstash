import { browser } from "webextension-polyfill-ts";

export class TabStash {
    name = "";
    tabs: any = [];

    addTab(tab: any) {
        this.tabs.push(tab);
    }
}

export class Tab {
    url = "";
    favicon = "";
}
