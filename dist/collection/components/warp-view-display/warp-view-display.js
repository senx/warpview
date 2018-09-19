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
import { Logger } from "../../utils/logger";
import { Param } from "../../model/param";
import { GTSLib } from "../../utils/gts.lib";
import { DataModel } from "../../model/dataModel";
import { ChartLib } from "../../utils/chart-lib";
/**
 * Display component
 */
export class WarpViewDisplay {
    constructor() {
        this.unit = '';
        this.responsive = false;
        this.options = new Param();
        this.width = '';
        this.height = '';
        this.LOG = new Logger(WarpViewDisplay);
        this._options = new Param();
    }
    onData(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['onData'], newValue);
            this.drawChart();
        }
    }
    onOptions(newValue, oldValue) {
        if (oldValue !== newValue) {
            this.LOG.debug(['options'], newValue);
            this.drawChart();
        }
    }
    drawChart() {
        this.LOG.debug(['drawChart'], [this.options, this._options]);
        this._options = ChartLib.mergeDeep(this._options, this.options);
        this.height = (this.responsive ? this.el.parentElement.clientHeight : this.height || 600) + 'px';
        this.width = (this.responsive ? this.el.parentElement.clientWidth : this.width || 800) + 'px';
        if (this.data instanceof DataModel) {
            this.toDisplay = GTSLib.isArray(this.data.data) ? this.data.data[0] : this.data.data;
        }
        else {
            this.toDisplay = GTSLib.isArray(this.data) ? this.data[0] : this.data;
        }
        this.LOG.debug(['drawChart'], [this.data, this.toDisplay]);
    }
    getStyle() {
        this.LOG.debug(['getStyle'], this._options);
        if (!this._options) {
            return {};
        }
        else {
            const style = { 'background-color': this._options.bgColor || 'transparent' };
            if (this._options.fontColor) {
                style.color = this._options.fontColor;
            }
            this.LOG.debug(['getStyle', 'style'], style);
            return style;
        }
    }
    componentDidLoad() {
        this.LOG.debug(['componentDidLoad'], this._options);
        this.drawChart();
    }
    render() {
        return h("div", null, this.toDisplay && this.toDisplay !== '' ?
            h("div", { class: "chart-container", id: "#wrapper" },
                h("div", { style: this.getStyle() },
                    h("div", { class: "value" },
                        this.toDisplay,
                        h("small", null, this.unit))))
            :
                h("warp-view-spinner", null));
    }
    static get is() { return "warp-view-display"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onData"]
        },
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "mutable": true
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptions"]
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "unit": {
            "type": String,
            "attr": "unit"
        },
        "width": {
            "type": String,
            "attr": "width",
            "mutable": true
        }
    }; }
    static get style() { return "/**style-placeholder:warp-view-display:**/"; }
}
