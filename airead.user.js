// ==UserScript==
// @name         AIRead
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  An AI-assisted reading script in browsers.
// @author       Hansimov
// @match        http://127.0.0.1:17777/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @require      file:///E:/_codes/airead/airead.user.js
// ==/UserScript==

var HEADER_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

var PARA_TAGS = ["p"];
var TABLE_TAGS = ["table"];
var LI_TAGS = ["li"];
var CODE_TAGS = ["pre", "code"];
var Math_TAGS = ["math"];

var GROUP_TAGS = ["p", "div", "section"];
var LINK_TAGS = ["a", "img"];
var LIST_TAGS = ["ul", "ol"];

var ATOM_TAGS = HEADER_TAGS.concat(
    PARA_TAGS,
    LI_TAGS,
    TABLE_TAGS,
    CODE_TAGS,
    Math_TAGS
);

console.log("ATOM_TAGS:", ATOM_TAGS);

function get_tag(element) {
    return element.tagName.toLowerCase();
}

class ReadableElementsSelector {
    constructor() {}
    is_atomized(element) {
        // Only atomized if tag is in ATOM_TAGS, and no child is in ATOM_TAGS
        for (var i = 0; i < element.children.length; i++) {
            if (ATOM_TAGS.includes(get_tag(element.children[i]))) {
                return false;
            }
        }
        if (ATOM_TAGS.includes(get_tag(element))) {
            return true;
        } else {
            return false;
        }
    }
    select_atomized_elements() {
        var elements = document.getElementsByTagName("*");
        var atomized_elements = [];
        for (var i = 0; i < elements.length; i++) {
            if (this.is_atomized(elements[i])) {
                atomized_elements.push(elements[i]);
            }
        }
        return atomized_elements;
    }
    add_border_to_atomized_elements() {
        var atomized_elements = this.select_atomized_elements();
        for (var i = 0; i < atomized_elements.length; i++) {
            atomized_elements[i].style.border = "1px solid red";
        }
    }
}

(function () {
    "use strict";
    console.log("Plugin Loaded");

    var selector = new ReadableElementsSelector();
    selector.add_border_to_atomized_elements();
})();
