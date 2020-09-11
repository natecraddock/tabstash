export class TabStash {
    name = "";
    tabs = [];

    addTab(tab) {
        this.tabs.push(tab);
    }
}

export class Tab {
    url = "";
    favicon = "";
}
