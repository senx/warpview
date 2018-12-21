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
import { DataModel } from "../../model/dataModel";
import { ColorLib } from "../../utils/color-lib";
import { GTSLib } from "../../utils/gts.lib";
export class WarpViewGtsPopup {
    constructor() {
        this.gtsList = new DataModel();
        this.maxToShow = 5;
        this.hiddenData = [];
        this.show = false;
        this.displayed = [];
        this.current = 0;
    }
    componentDidLoad() {
        const bottom = this.current - Math.ceil(this.maxToShow / 2);
        this.displayed = this.gtsList.data.slice(bottom, Math.min(this.gtsList.data.length, bottom + this.maxToShow));
    }
    render() {
        return h("div", null, this.show
            ? h("div", { class: "popup" },
                h("ul", null, this.displayed.map(gts => h("li", null,
                    h("div", { class: "round", style: { 'background-color': ColorLib.transparentize(gts.id), 'border-color': '' } }),
                    GTSLib.formatLabel(GTSLib.serializeGtsMetadata(gts.name))))),
                ";")
            : '');
    }
    static get is() { return "warp-view-gts-popup"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "displayed": {
            "state": true
        },
        "gtsList": {
            "type": "Any",
            "attr": "gts-list"
        },
        "hiddenData": {
            "type": "Any",
            "attr": "hidden-data"
        },
        "maxToShow": {
            "type": Number,
            "attr": "max-to-show"
        },
        "show": {
            "state": true
        }
    }; }
    static get events() { return [{
            "name": "warpViewSelectedGTS",
            "method": "warpViewSelectedGTS",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:warp-view-gts-popup:**/"; }
}
