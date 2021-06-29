// ==UserScript==
// @name         Anty
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fourmizzz/Antzzz helper
// @author       FeuFeve
// @match        http://s1.antzzz.org/alliance.php?Membres
// @icon         https://www.google.com/s2/favicons?domain=antzzz.org
// @grant        none
// ==/UserScript==

/* eslint-env jquery */

(function() {
    'use strict'

    window.addEventListener('load', function () {
        console.log("ready!")

        // MutationObserver
        const targetNode = document.getElementById('centre');
        const config = { attributes: false, childList: true, subtree: true };
        const observer = new MutationObserver(MF);
        observer.observe(targetNode, config);
    })
})()

function MF() {
    let style = {
        color: '#FF0000'
    }

    let playerPseudo = document.querySelector("#boiteInfo .titre_colonne_cliquable .titre_ressource").text.split(" ")[1]
    let table = document.querySelector("#tabMembresAlliance tbody")

    for (let i = 1; i < table.childElementCount; i++) {
        Object.assign(table.children[i].children[3].firstChild.style, style)
    }
}