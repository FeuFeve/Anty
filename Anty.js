// ==UserScript==
// @name         Anty
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fourmizzz/Antzzz helper
// @author       FeuFeve
// @match        http://s1.antzzz.org/alliance.php?Membres
// @icon         https://www.google.com/s2/favicons?domain=antzzz.org
// @grant        none
// ==/UserScript==

/* eslint-env jquery */

{
    /* CSS STYLES */

    let redStyle = {
        color: '#FF0000'
    }

    let blueStyle = {
        color: '#0000FF'
    }



    /* GLOBAL VARIABLES */

    let currentPlayer
    let playerList = []
    let playersWithinRange = []



    /* CLASSES */

    class Player {
        constructor(name, hf) {
            this.name = name
            this.hf = hf
        }
    }



    /* GLOBAL FUNCTIONS */

    function stringToInt(str) {
        return parseInt(str.replaceAll(' ', ''))
    }

    function playerIsInRange(from, to) {
        let fromHf = stringToInt(from.hf.innerText)
        let toHf = stringToInt(to.hf.innerText)
        console.log(`Comparing ${fromHf} to ${toHf}`)

        return fromHf / 2 < toHf && fromHf * 3 > toHf ? true : false
    }



    /* Members page */

    function UpdateMembersPage() {
        ParseMembersPageData()
        ApplyMembersPageVisuals()

        console.log("UpdateMembersPage done.")
    }

    function ParseMembersPageData() {

        let currentPlayerPseudo = document.querySelector("#boiteInfo .titre_colonne_cliquable .titre_ressource").text.split(" ")[1]
        let table = document.querySelector("#tabMembresAlliance tbody")

        for (let i = 1; i < table.childElementCount; i++) {
            let line = table.children[i]
            let pseudo = line.children[3]
            let hf = line.children[5]

            let player = new Player(pseudo, hf)
            if (pseudo.innerText == currentPlayerPseudo) {
                currentPlayer = player
            }
            else {
                playerList.push(player)
            }
        }
    }

    function ApplyMembersPageVisuals() {
        Object.assign(currentPlayer.name.firstChild.style, blueStyle)
        playerList.forEach(player => {
            //console.log(`${player.name.innerText} - ${player.hf.innerText}`)
            if (playerIsInRange(currentPlayer, player)) {
                Object.assign(player.name.firstChild.style, redStyle)
            }
        })
    }



    /* MAIN FUNCTION */

    (function() {
        'use strict'

        window.addEventListener('load', function () {
            // MutationObserver
            const targetNode = document.getElementById('centre');
            const config = { attributes: false, childList: true, subtree: true };
            const observer = new MutationObserver(UpdateMembersPage);
            observer.observe(targetNode, config);
        })
    })()
}