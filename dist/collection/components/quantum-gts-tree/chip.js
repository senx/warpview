/*
 *
 *    Copyright 2016  Cityzen Data
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */
import { GTSLib } from "../../utils/gts.lib";
import { ColorLib } from "../../utils/color-lib";
import { GTS } from "../../model/GTS";
import { Logger } from "../../utils/logger";
export class QuantumChip {
    constructor() {
        this._node = {
            selected: true,
            gts: GTS
        };
        this.LOG = new Logger(QuantumChip);
    }
    /**
     *
     * @param {boolean} state
     * @returns {string}
     */
    gtsColor(state) {
        if (state) {
            return ColorLib.getColor(this.index);
        }
        else {
            return '#bbbbbb';
        }
    }
    /**
     *
     */
    componentWillLoad() {
        this._node = Object.assign({}, this.node, { selected: true });
    }
    /**
     *
     */
    componentDidLoad() {
        this.el.getElementsByClassName('normal')[0].style.setProperty('background-color', this.gtsColor(this._node.selected));
    }
    /**
     *
     * @param index
     * @param obj
     * @returns {boolean}
     * @private
     */
    lastIndex(index, obj) {
        let array = this.toArray(obj);
        return (index === array.length - 1);
    }
    /**
     *
     * @param obj
     * @returns {any}
     * @private
     */
    toArray(obj) {
        if (obj === undefined) {
            return [];
        }
        return Object.keys(obj).map(function (key) {
            return {
                name: key,
                value: obj[key],
            };
        });
    }
    /**
     *
     * @param {UIEvent} event
     */
    switchPlotState(event) {
        this._node = Object.assign({}, this._node, { selected: !this._node.selected, label: GTSLib.serializeGtsMetadata(this._node.gts) });
        this.LOG.debug(['switchPlotState'], [this._node]);
        this.el.getElementsByClassName('normal')[0].style.setProperty('background-color', this.gtsColor(this._node.selected));
        this.quantumSelectedGTS.emit(this._node);
    }
    render() {
        return (h("div", null, this._node && this._node.gts && this._node.gts.l ?
            h("span", null,
                h("i", { class: "normal" }),
                h("span", { class: "gtsInfo", onClick: (event) => this.switchPlotState(event) },
                    h("span", { class: 'gts-classname' }, this._node.gts.c),
                    h("span", { class: 'gts-separator', innerHTML: '&lcub; ' }),
                    this.toArray(this._node.gts.l).map((label, labelIndex) => h("span", null,
                        h("span", { class: 'gts-labelname' }, label.name),
                        h("span", { class: 'gts-separator' }, "="),
                        h("span", { class: 'gts-labelvalue' }, label.value),
                        h("span", { hidden: this.lastIndex(labelIndex, this._node.gts.l) }, ", "))),
                    h("span", { class: 'gts-separator', innerHTML: ' &rcub;' })))
            : ''));
    }
    static get is() { return "quantum-chip"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "index": {
            "type": Number,
            "attr": "index"
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "node": {
            "type": "Any",
            "attr": "node"
        }
    }; }
    static get events() { return [{
            "name": "quantumSelectedGTS",
            "method": "quantumSelectedGTS",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:quantum-chip:**/"; }
}
