// ==UserScript==
// @name         AIRead
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  An AI-assisted reading script in browsers.
// @author       Hansimov
// @match        http://127.0.0.1:17777/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @require      file:///E:/_codes/airead/airead.user.js
// ==/UserScript==

var HEADER_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
var FIGURE_TAGS = ["figure"];
var TABLE_TAGS = ["table"];
var CODE_TAGS = ["pre", "code"];
var MATH_TAGS = ["math"];
var BLOCKQUOTE_TAGS = ["blockquote"];
var IMG_TAGS = ["img"];
var CAPTION_TAGS = ["figcaption"];

var P_TAGS = ["p"];
var LI_TAGS = ["li"];
var LINK_TAGS = ["a"];

var GROUP_TAGS = ["div", "section"];
var LIST_TAGS = ["ul", "ol"];

var ATOM_TAGS = HEADER_TAGS.concat(
    TABLE_TAGS,
    CODE_TAGS,
    BLOCKQUOTE_TAGS,
    IMG_TAGS,
    CAPTION_TAGS
);
var PARA_TAGS = [].concat(GROUP_TAGS, LIST_TAGS, P_TAGS, LI_TAGS);

console.log("ATOM_TAGS:", ATOM_TAGS);

function get_tag(element) {
    return element.tagName.toLowerCase();
}
function get_descents(element) {
    return element.querySelectorAll("*");
}
function get_parents(element) {
    var parents = [];
    var parent = element.parentElement;
    while (parent) {
        parents.push(parent);
        parent = parent.parentElement;
    }
    return parents;
}

class ReadableElementsSelector {
    constructor() {}
    is_atomized(element) {
        var tag = get_tag(element);
        var decadents = get_descents(element);
        var parents = get_parents(element);

        if (ATOM_TAGS.includes(tag)) {
            for (var i = 0; i < parents.length; i++) {
                if (ATOM_TAGS.includes(get_tag(parents[i]))) {
                    return false;
                }
            }
            return true;
        }
        if (PARA_TAGS.includes(tag)) {
            for (var i = 0; i < parents.length; i++) {
                if (ATOM_TAGS.includes(get_tag(parents[i]))) {
                    return false;
                }
            }
            for (var i = 0; i < decadents.length; i++) {
                if (
                    PARA_TAGS.concat(ATOM_TAGS).includes(get_tag(decadents[i]))
                ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    select_atomized_elements() {
        var elements = get_descents(document.body);
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
