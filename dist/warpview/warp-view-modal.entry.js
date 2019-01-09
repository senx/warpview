const h = window.warpview.h;

/*
 *  Copyright 2018  SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
class WarpViewModal {
    constructor() {
        this.modalTitle = '';
    }
    open() {
        this.el.style.display = 'block';
        this.el.style.zIndex = '999999';
        this.warpViewModalOpen.emit({});
    }
    close() {
        this.el.style.display = 'none';
        this.el.style.zIndex = '-1';
        this.warpViewModalClose.emit({});
    }
    handleKeyDown(ev) {
        if ('Escape' === ev.key) {
            ev.preventDefault();
            return false;
        }
    }
    handleKeyUp(ev) {
        if (ev.key === 'Escape') {
            ev.preventDefault();
            this.close();
            return false;
        }
    }
    componentDidLoad() {
        this.el.addEventListener('click', (event) => {
            if (event.path[0].nodeName === 'WARP-VIEW-MODAL') {
                this.close();
            }
        });
    }
    render() {
        return h("div", { class: "popup" },
            h("div", { class: "header" },
                h("div", { class: "title", innerHTML: this.modalTitle }),
                h("div", { class: "close", onClick: () => this.close() }, "\u00D7")),
            h("div", { class: "body" },
                h("slot", null)));
    }
    static get is() { return "warp-view-modal"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "close": {
            "method": true
        },
        "el": {
            "elementRef": true
        },
        "modalTitle": {
            "type": String,
            "attr": "modal-title"
        },
        "open": {
            "method": true
        }
    }; }
    static get events() { return [{
            "name": "warpViewModalOpen",
            "method": "warpViewModalOpen",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "warpViewModalClose",
            "method": "warpViewModalClose",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "document:keydown",
            "method": "handleKeyDown"
        }, {
            "name": "document:keyup",
            "method": "handleKeyUp"
        }]; }
    static get style() { return ":host {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 0;\n  display: none;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  outline: 0;\n  background-color: rgba(0, 0, 0, 0.3); }\n  :host .popup {\n    position: relative;\n    width: 100%;\n    height: auto;\n    background-color: var(--warpview-popup-bg-color, white);\n    top: 10%;\n    z-index: 999999;\n    background-clip: padding-box;\n    border: 1px solid var(--warpview-popup-border-color, rgba(0, 0, 0, 0.2));\n    border-radius: .3rem;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n    flex-direction: column;\n    pointer-events: auto;\n    outline: 0;\n    margin: 1.75rem auto; }\n    \@media (min-width: 576px) {\n      :host .popup {\n        max-width: 800px; } }\n    :host .popup .header {\n      background-color: var(--warpview-popup-header-bg-color, #ddd);\n      display: -ms-flexbox;\n      display: flex;\n      -ms-flex-align: start;\n      align-items: flex-start;\n      -ms-flex-pack: justify;\n      justify-content: space-between;\n      padding: 1rem 1rem;\n      border-bottom: 1px solid #e9ecef;\n      border-top-left-radius: .3rem;\n      border-top-right-radius: .3rem; }\n      :host .popup .header .title {\n        margin-bottom: 0;\n        line-height: 1.5;\n        color: var(--warpview-popup-title-color, #888); }\n      :host .popup .header .close {\n        padding: 1rem 1rem;\n        margin: -1rem -1rem -1rem auto;\n        cursor: pointer;\n        color: var(--warpview-popup-close-color, #888); }\n    :host .popup .body {\n      position: relative;\n      background-color: var(--warpview-popup-body-bg-color, #ffffff);\n      color: var(--warpview-popup-body-color, #000);\n      height: auto;\n      padding: 10px; }"; }
}

export { WarpViewModal };
