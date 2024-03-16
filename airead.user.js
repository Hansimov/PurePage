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

const HEADER_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const FIGURE_TAGS = ["figure"];
const TABLE_TAGS = ["table"];
const CODE_TAGS = ["pre", "code"];
const MATH_TAGS = ["math"];
const BLOCKQUOTE_TAGS = ["blockquote"];
const IMG_TAGS = ["img"];
const CAPTION_TAGS = ["figcaption"];

const P_TAGS = ["p"];
const LI_TAGS = ["li"];
const LINK_TAGS = ["a"];

const GROUP_TAGS = ["div", "section"];
const LIST_TAGS = ["ul", "ol"];

const ATOM_TAGS = HEADER_TAGS.concat(
    TABLE_TAGS,
    CODE_TAGS,
    BLOCKQUOTE_TAGS,
    IMG_TAGS,
    CAPTION_TAGS
);
const PARA_TAGS = [].concat(GROUP_TAGS, LIST_TAGS, P_TAGS, LI_TAGS);

function get_tag(element) {
    return element.tagName.toLowerCase();
}

function get_descents(element) {
    return Array.from(element.querySelectorAll("*"));
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

function is_elements_has_tag(elements, tags) {
    return elements.some((element) => tags.includes(get_tag(element)));
}

class ReadableElementsSelector {
    constructor() {}
    is_atomized(element) {
        const tag = get_tag(element);
        const descents = get_descents(element);
        const parents = get_parents(element);

        if (ATOM_TAGS.includes(tag)) {
            return !is_elements_has_tag(parents, ATOM_TAGS);
        }
        if (PARA_TAGS.includes(tag)) {
            const is_parent_has_atom = is_elements_has_tag(parents, ATOM_TAGS);
            const is_descent_has_para_or_atom = is_elements_has_tag(
                descents,
                PARA_TAGS.concat(ATOM_TAGS)
            );
            return !(is_parent_has_atom || is_descent_has_para_or_atom);
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
