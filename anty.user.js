// ==UserScript==
// @name         Anty
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fourmizzz/Antzzz helper
// @author       FeuFeve
// @match        http://s1.antzzz.org/*
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



    /* ENUMS */

    const contexts = {
        CROPS: "crops",
    	MEMBERS: "members",
        NONE: "none"
    }



    /* GLOBAL VARIABLES */

    let context

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

    function updateContext() {
        if (document.URL.includes("Ressources.php")) {
            context = contexts.CROPS
        }
        else if (document.URL.includes("alliance.php?Membres")) {
            context = contexts.MEMBERS
        }
        else {
            context = contexts.NONE
        }
    }

    function enhancePage() {
        switch (context) {
            case contexts.NONE:
                break
            case contexts.CROPS:
                enhanceCropsPage()
                break
            case contexts.MEMBERS:
                enhanceMembersPage()
                break
        }
    }

    function stringToInt(str) {
        return parseInt(str.replaceAll(' ', ''))
    }

    function playerIsInRange(from, to) {
        let fromHf = stringToInt(from.hf.innerText)
        let toHf = stringToInt(to.hf.innerText)

        return fromHf / 2 < toHf && fromHf * 3 > toHf ? true : false
    }



    /* Crops/Ressources page */

    function enhanceCropsPage() {
        console.log("Welcome to the crops page!")
        maximiseMaterialsGatheringWorkers()
    }

    function maximiseMaterialsGatheringWorkers() {
        let totalHf = stringToInt(document.querySelector("#boite_tdc tbody tr td strong").innerText.substring(2).split('cm')[0])
        let foodGatherers = stringToInt(document.querySelector("#RecolteNourriture").value)
        let woodGatherers = stringToInt(document.querySelector("#RecolteMateriaux").value)

        if (foodGatherers + woodGatherers != totalHf) {
            woodGatherers = totalHf - foodGatherers
            document.querySelector("#RecolteMateriaux").value = woodGatherers
            document.querySelector("#ChangeRessource").click()
        }
    }



    /* Members/Membres page */

    function enhanceMembersPage() {
        // MutationObserver
        const targetNode = document.getElementById('centre');
        const config = { attributes: false, childList: true, subtree: true };
        const observer = new MutationObserver(updateMembersPage);
        observer.observe(targetNode, config);
    }

    function updateMembersPage() {
        parseMembersPageData()
        applyMembersPageVisuals()

        console.log("updateMembersPage done.")
    }

    function parseMembersPageData() {
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

    function applyMembersPageVisuals() {
        Object.assign(currentPlayer.name.firstChild.style, blueStyle)
        playerList.forEach(player => {
            if (playerIsInRange(currentPlayer, player)) {
                Object.assign(player.name.firstChild.style, redStyle)
            }
        })
    }



    /* MAIN FUNCTION */

    (function() {
        'use strict'

        window.addEventListener('load', function () {
            updateContext()
            enhancePage()
        })
    })()
}