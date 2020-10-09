import { storage } from "./storage";

function setup() {
    let select = document.getElementById("stash-name") as HTMLSelectElement;
    select.addEventListener("change", function () {
        storage.setPreference("", select.value);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    storage.initialize(setup);
});
