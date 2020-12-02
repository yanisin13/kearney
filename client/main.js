import { GameEngine } from "./scripts/game";

function documentReady() {
    const dom = loadDomData();
    const gameEngine = new GameEngine(dom);
}

function loadDomData() {
    const result = {};
    [...document.getElementsByTagName("*")].filter(e => e.id).forEach(e => result[e.id] = e);
    return result;
}

if(document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    documentReady();
} else {
    document.addEventListener("DOMContentLoaded", documentReady)
}