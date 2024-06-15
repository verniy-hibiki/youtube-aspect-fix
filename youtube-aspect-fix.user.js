// ==UserScript==
// @name         YouTube Aspect Ratio Switcher
// @version      0.2
// @description  Adds an aspect ratio switcher to the player to correct 4:3 stretched to widescreen
// @author       Bep
// @match        https://*.youtube.com/watch*v=*
// @match        https://*.youtube.com/embed/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var currentRatio = null;
    var aspectRatiosIndex = 0;
    var videoElemAttr = "data-aspectRatio-userscript";
    var buttonhtml = `<button id="aspectratioSwitcher" class="ytp-button" title="Aspect ratio">↔</button>`;
    var csshtml = `
        <style>
        #aspectratioSwitcher {
            top: -13px;
            position: relative;
            text-align: center;
            font-size: 25px;
        }
        .ytp-big-mode #aspectratioSwitcher {
            font-size: 25px;
            top: -13px;
        }

        .html5-main-video { transition: .2s; }

        #movie_player[data-aspectRatio-userscript="4:3"] .html5-main-video { transform: scale(.75,1)!important; }
        </style>
    `;

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && Array.from(mutation.addedNodes).some(node => node.classList && (node.classList.contains('ytp-right-controls') || node.id === 'movie_player'))) {
                addButtonIfNeeded();
            }
        });
    });

    function addButtonIfNeeded() {
        if (!document.querySelector("#aspectratioSwitcher")) {
            var controls = document.querySelector('.ytp-right-controls');
            if (controls) {
                controls.insertAdjacentHTML("afterbegin", buttonhtml + csshtml);
                var buttonElem = document.querySelector("#aspectratioSwitcher");
                buttonElem.addEventListener("click", aspectRatioSwitch);
            }
        }
    }

    function aspectRatioSwitch() {
        var videoElem = document.querySelector("#movie_player");
        var buttonElem = document.querySelector("#aspectratioSwitcher");

        aspectRatiosIndex++;
        if (aspectRatiosIndex > 1) aspectRatiosIndex = 0;

        switch(aspectRatiosIndex) {
          case 1:
            currentRatio = "4:3";
            break;
          default:
            currentRatio = null;
        }

        if (currentRatio) {
            videoElem.setAttribute(videoElemAttr, currentRatio);
            buttonElem.innerHTML = currentRatio;
        } else {
            videoElem.removeAttribute(videoElemAttr);
            buttonElem.innerHTML = "↔";
        }
    }

    observer.observe(document.body, { childList: true, subtree: true });

    addButtonIfNeeded();

})();
