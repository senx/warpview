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
export class WarpViewModal {
    constructor() {
        this.modalTitle = '';
    }
    open() {
        this.el.style.display = 'block';
        this.el.style.zIndex = '999999';
    }
    close() {
        this.el.style.display = 'none';
        this.el.style.zIndex = '-1';
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
    static get listeners() { return [{
            "name": "document:keydown",
            "method": "handleKeyDown"
        }, {
            "name": "document:keyup",
            "method": "handleKeyUp"
        }]; }
    static get style() { return "/**style-placeholder:warp-view-modal:**/"; }
}
